import { prisma } from "./prisma";

export async function getGeneralSettings() {
  try {
    // نحاول جلب السجل رقم 1 (سجل الإعدادات الوحيد)
    const settings = await prisma.generalSettings.findUnique({
      where: { id: 1 },
    });
    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}