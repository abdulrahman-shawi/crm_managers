import { prisma } from "./prisma";

export async function getGeneralSettings() {
  try {
    // نحاول جلب السجل رقم 1 (سجل الإعدادات الوحيد)
    const settings = await prisma.generalSettings.findUnique({
      where: { id: 1 },
    });

    // التحقق من تحديث الرصيد الافتتاحي تلقائياً في بداية كل شهر
    if (settings) {
      const now = new Date();
      const currentMonth = now.getFullYear() * 12 + now.getMonth();
      const lastAutoUpdated = settings.openingBalanceLastAutoUpdated;
      const lastAutoUpdatedMonth = lastAutoUpdated ? lastAutoUpdated.getFullYear() * 12 + lastAutoUpdated.getMonth() : null;
      const lastModified = settings.openingBalanceLastModified;
      const lastModifiedMonth = lastModified ? lastModified.getFullYear() * 12 + lastModified.getMonth() : null;

      // إذا لم يتم تحديث تلقائي في الشهر الحالي، ولم يتم تعديل يدوي في الشهر الحالي
      if (lastAutoUpdatedMonth !== currentMonth && lastModifiedMonth !== currentMonth) {
        // حساب الرصيد النهائي للشهر السابق
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
        previousMonthEnd.setDate(0); // نهاية الشهر السابق

        const previousMonthStart = new Date(previousMonthEnd.getFullYear(), previousMonthEnd.getMonth(), 1);

        // جلب الفواتير للشهر السابق
        const invoices = await prisma.invoice.findMany({
          where: {
            date: {
              gte: previousMonthStart,
              lte: previousMonthEnd,
            },
          },
          include: {
            items: true,
            returns: true,
          },
        });

        // حساب الإيرادات والمصروفات والأخرى للشهر السابق
        let totalRevenues = 0;
        let totalExpenses = 0;
        let totalOthers = 0;

        invoices.forEach((invoice) => {
          if (invoice.type === 'REVENUE') {
            totalRevenues += Number(invoice.totalAmount);
          } else if (invoice.type === 'EXPENSE') {
            totalExpenses += Number(invoice.totalAmount);
          } else if (invoice.type === 'OTHER') {
            totalOthers += Number(invoice.totalAmount);
          }
        });

        // حساب الرصيد النهائي للشهر السابق
        const previousMonthNetBalance = Number(settings.openingBalance) + totalRevenues - totalExpenses + totalOthers;

        // تحديث الرصيد الافتتاحي للشهر الحالي
        await prisma.generalSettings.update({
          where: { id: 1 },
          data: {
            openingBalance: previousMonthNetBalance,
            openingBalanceLastAutoUpdated: new Date(),
            updatedAt: new Date(),
          },
        });

        // إعادة جلب الإعدادات بعد التحديث
        const updatedSettings = await prisma.generalSettings.findUnique({
          where: { id: 1 },
        });
        return updatedSettings;
      }
    }

    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}