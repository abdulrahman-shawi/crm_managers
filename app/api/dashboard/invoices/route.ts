import { prisma } from "@/lib/prisma";
import {
    applyComputedProductPrices,
    getComputedInvoiceItemTotals,
    normalizeExchangeRate,
} from "@/lib/pricing";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const fromParam = searchParams.get("from");
        const toParam = searchParams.get("to");

        const now = new Date();
        const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1);
        const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const fromDate = fromParam ? new Date(fromParam) : defaultFrom;
        const toDateSource = toParam ? new Date(toParam) : defaultTo;
        const toDate = new Date(toDateSource);
        toDate.setHours(23, 59, 59, 999);

        if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
            return NextResponse.json(
                { error: "صيغة التاريخ غير صحيحة" },
                { status: 400 }
            );
        }

        const [invoices, settings] = await Promise.all([
            prisma.invoice.findMany({
            where: {
                date: {
                    gte: fromDate,
                    lte: toDate,
                },
            },
            include: {
                customer: true,
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                modelNumber: true,
                                priceLow: true,
                                price: true,
                                sourcePrice: true,
                                sourcePriceLow: true,
                                pricingCurrency: true,
                            },
                        },
                    },
                },
                returns: {
                    include: {
                        returnedProduct: {
                            select: { id: true, name: true },
                        },
                        exchangedProduct: {
                            select: { id: true, name: true },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        }),
            prisma.generalSettings.findUnique({
                where: { id: 1 },
                select: { exchangeRate: true },
            }),
        ]);

        const exchangeRate = normalizeExchangeRate(settings?.exchangeRate);
        const invoicesWithComputedPrices = invoices.map((invoice) => {
            const computedItems = invoice.items.map((item) => {
                const product = item.product
                    ? applyComputedProductPrices(item.product, exchangeRate)
                    : item.product;
                const { unitPrice, subTotal } = getComputedInvoiceItemTotals(
                    {
                        quantity: item.quantity,
                        discount: item.discount,
                        unitPrice: item.unitPrice,
                        product,
                    },
                    exchangeRate
                );

                return {
                    ...item,
                    unitPrice,
                    subTotal,
                    product,
                };
            });

            const totalAmount = computedItems.reduce((sum, item) => sum + Number(item.subTotal || 0), 0);

            return {
                ...invoice,
                items: computedItems,
                totalAmount,
            };
        });

        return NextResponse.json(invoicesWithComputedPrices, { status: 200 });
    } catch (error: any) {
        console.error("Prisma Error Details:", error);
        return NextResponse.json(
            { error: "فشل في جلب الفواتير", details: error.message }, 
            { status: 500 }
        );
    }
 };     

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, clientName, status, items, grandTotal , uderId } = body;

        // 1. تحويل القيم للـ Enums
        const formattedType = type === "revenue" ? "REVENUE" : "EXPENSE";
        const formattedStatus = status === "مدفوعة" ? "PAID" : "PENDING";

        // 2. البحث عن العميل
        const customer = await prisma.customer.findFirst({
            where: { name: clientName }
        });

        // 3. بدء المعاملة (Transaction) لضمان سلامة البيانات
        const result = await prisma.$transaction(async (tx) => {
            
            // أ. إنشاء الفاتورة والبنود التابعة لها
            const newInvoice = await tx.invoice.create({
                data: {
                    type: formattedType,
                    status: formattedStatus,
                    userId:Number(uderId),
                    totalAmount: parseFloat(grandTotal),
                    customerId: customer ? customer.id : null,
                    items: {
                        create: items.map((item: any) => ({
                            productId: parseInt(item.productId),
                            quantity: parseInt(item.quantity),
                            unitPrice: parseFloat(item.price),
                            discount: parseFloat(item.discount || 0),
                            note: item.note || "",
                            subTotal: parseFloat(item.total)
                        }))
                    }
                },
                include: { items: true }
            });

            // ب. تحديث المخزون لكل منتج
            for (const item of items) {
                const productId = parseInt(item.productId);
                const quantity = parseInt(item.quantity);

                // جلب بيانات المنتج للتأكد من المخزون الحالي (فقط في حالة البيع REVENUE)
                if (formattedType === "REVENUE") {
                    const product = await tx.product.findUnique({
                        where: { id: productId }
                    });

                    if (!product || product.stock < quantity) {
                        throw new Error(`المخزون غير كافٍ للمنتج: ${product?.name || productId}`);
                    }
                }

                // ج. تنفيذ التحديث (زيادة أو نقصان)
                await tx.product.update({
                    where: { id: productId },
                    data: {
                        stock: {
                            [formattedType === "REVENUE" ? "decrement" : "increment"]: quantity
                        }
                    }
                });
            }

            return newInvoice;
        });

        return NextResponse.json(result, { status: 201 });

    } catch (error: any) {
        console.error("Error:", error.message);
        return NextResponse.json(
            { 
                error: "فشل في معالجة الطلب", 
                details: error.message 
            }, 
            { status: 400 } // نستخدم 400 للأخطاء المنطقية مثل "المخزون غير كافٍ"
        );
    }
}