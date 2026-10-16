import { prisma } from "./prisma";
import {
    applyComputedProductPrices,
    getComputedInvoiceItemTotals,
    normalizeExchangeRate,
} from "./pricing";

const SETTINGS_ID = 1;
const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

export interface DailyBalanceUpdateResult {
    ran: boolean;
    reason?: string;
    windowStart?: Date;
    windowEnd?: Date;
    invoicesCount?: number;
    openingBalanceBefore?: number;
    openingBalanceAfter?: number;
    totalRevenues?: number;
    totalExpenses?: number;
    totalOthers?: number;
    netProfit?: number;
    delta?: number;
}

/**
 * التحديث اليومي التلقائي لمبلغ فتح الحساب (الرصيد الافتتاحي) عند الساعة 12 ليلاً.
 *
 * يُجمّع كل الفواتير منذ آخر تحديث تلقائي حتى نهاية الأمس، ثم يطبق المعادلة:
 *   الرصيد الجديد = الرصيد الحالي + المقبوضات - المدفوعات - الفواتير الأخرى - صافي ربح المبيعات
 *
 * ملاحظات:
 * - التحديث ذري ومحمى ضد التنفيذ المزدوج عبر شرط openingBalanceLastAutoUpdated.
 * - إذا عُدّل الرصيد يدوياً خلال فترة التجميع يتم تخطي التحديث (مع تقديم مؤشر
 *   آخر تحديث) تفادياً لخصم/إضافة الفواتير مرتين.
 * - عند تمرير dryRun يتم حساب النتيجة فقط دون حفظها في قاعدة البيانات.
 */
export async function runDailyOpeningBalanceUpdate(
    options: { dryRun?: boolean } = {}
): Promise<DailyBalanceUpdateResult> {
    const now = new Date();
    const todayStart = startOfDay(now);
    const dryRun = options.dryRun === true;

    const settings = await prisma.generalSettings.findUnique({
        where: { id: SETTINGS_ID },
    });

    if (!settings) {
        return { ran: false, reason: "سجل الإعدادات العامة غير موجود" };
    }

    // فترة التجميع: من بداية يوم آخر تحديث تلقائي (أو من بداية الأمس إن لم يحدث من قبل)
    // وحتى بداية اليوم الحالي — أي إغلاق اليوم الذي انتهى عند منتصف الليل.
    const windowEnd = todayStart;
    const windowStart = settings.openingBalanceLastAutoUpdated
        ? startOfDay(settings.openingBalanceLastAutoUpdated)
        : new Date(todayStart.getTime() - DAY_MS);

    if (windowStart >= windowEnd) {
        return { ran: false, reason: "الرصيد محدث مسبقاً حتى اليوم الحالي" };
    }

    // إذا عدّل المستخدم الرصيد يدوياً خلال فترة التجميع نتخطى التحديث التلقائي
    // (يُفترض أن المستخدم أدخل الرصيد الصحيح بنفسه) ونُقدّم مؤشر آخر تحديث فقط.
    const lastModified = settings.openingBalanceLastModified;
    if (lastModified && lastModified >= windowStart && lastModified < windowEnd) {
        if (!dryRun) {
            await prisma.generalSettings.updateMany({
                where: {
                    id: SETTINGS_ID,
                    openingBalanceLastAutoUpdated: settings.openingBalanceLastAutoUpdated ?? null,
                },
                data: { openingBalanceLastAutoUpdated: now, updatedAt: now },
            });
        }
        return {
            ran: false,
            reason: "تم تخطي التحديث التلقائي لأن الرصيد عُدّل يدوياً خلال فترة التجميع",
            windowStart,
            windowEnd,
        };
    }

    const invoices = await prisma.invoice.findMany({
        where: {
            date: {
                gte: windowStart,
                lt: windowEnd,
            },
        },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            pricingCurrency: true,
                            sourcePrice: true,
                            sourcePriceLow: true,
                            price: true,
                            priceLow: true,
                        },
                    },
                },
            },
        },
    });

    const exchangeRate = normalizeExchangeRate(settings.exchangeRate);

    let totalRevenues = 0;
    let totalExpenses = 0;
    let totalOthers = 0;
    let netProfit = 0;

    for (const invoice of invoices) {
        const computedItems = invoice.items.map((item) => {
            const product = item.product
                ? applyComputedProductPrices(item.product, exchangeRate)
                : null;
            const { subTotal } = getComputedInvoiceItemTotals(
                {
                    quantity: item.quantity,
                    discount: item.discount,
                    unitPrice: item.unitPrice,
                    product,
                },
                exchangeRate
            );
            return { quantity: item.quantity, product, subTotal };
        });

        const invoiceTotal = computedItems.reduce((sum, item) => sum + item.subTotal, 0);

        if (invoice.type === "REVENUE") {
            totalRevenues += invoiceTotal;
            for (const item of computedItems) {
                const wholesaleUnitPrice = item.product ? Number(item.product.priceLow ?? 0) : 0;
                netProfit += item.subTotal - wholesaleUnitPrice * item.quantity;
            }
        } else if (invoice.type === "EXPENSE") {
            totalExpenses += invoiceTotal;
        } else {
            totalOthers += invoiceTotal;
        }
    }

    const openingBalanceBefore = Number(settings.openingBalance);
    const delta = totalRevenues - totalExpenses - totalOthers - netProfit;

    if (dryRun) {
        return {
            ran: false,
            reason: "dryRun — لم يتم حفظ أي تعديل",
            windowStart,
            windowEnd,
            invoicesCount: invoices.length,
            openingBalanceBefore,
            openingBalanceAfter: openingBalanceBefore + delta,
            totalRevenues,
            totalExpenses,
            totalOthers,
            netProfit,
            delta,
        };
    }

    // تحديث ذري: increment على الرصيد + شرط على مؤشر آخر تحديث يمنع التنفيذ المزدوج
    const updateResult = await prisma.generalSettings.updateMany({
        where: {
            id: SETTINGS_ID,
            openingBalanceLastAutoUpdated: settings.openingBalanceLastAutoUpdated ?? null,
        },
        data: {
            openingBalance: { increment: delta },
            openingBalanceLastAutoUpdated: now,
            updatedAt: now,
        },
    });

    if (updateResult.count === 0) {
        return { ran: false, reason: "تعذر التحديث: يوجد تحديث آخر قيد التنفيذ" };
    }

    return {
        ran: true,
        windowStart,
        windowEnd,
        invoicesCount: invoices.length,
        openingBalanceBefore,
        openingBalanceAfter: openingBalanceBefore + delta,
        totalRevenues,
        totalExpenses,
        totalOthers,
        netProfit,
        delta,
    };
}
