import { prisma } from "./prisma";
import { runDailyOpeningBalanceUpdate } from "./opening-balance";

export async function getGeneralSettings() {
  try {
    let settings = await prisma.generalSettings.findUnique({
      where: { id: 1 },
    });

    if (settings) {
      // التحديث اليومي التلقائي لمبلغ فتح الحساب عند الساعة 12 ليلاً:
      // يُنفَّذ هنا كضمان في أول طلب بعد منتصف الليل، بالإضافة إلى مسار
      // /api/cron/daily-opening-balance الذي يُستدعى من مجدول خارجي (Cron).
      try {
        const updateResult = await runDailyOpeningBalanceUpdate();
        if (updateResult.ran) {
          settings = await prisma.generalSettings.findUnique({
            where: { id: 1 },
          });
        }
      } catch (updateError) {
        // لا نُفشل جلب الإعدادات إذا تعذر التحديث التلقائي
        console.error("Failed to run daily opening balance update:", updateError);
      }
    }

    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}
