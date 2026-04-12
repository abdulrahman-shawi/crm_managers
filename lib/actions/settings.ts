"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSettingsAction(formData: FormData) {
  const siteName = formData.get("siteName") as string;
  const currency = formData.get("currency") as string;
  const openingBalanceValue = Number(formData.get("openingBalance") ?? 0);
  const openingBalance = Number.isFinite(openingBalanceValue) ? openingBalanceValue : 0;
  const contactEmail = formData.get("contactEmail") as string;
  const facebookUrl = formData.get("facebookUrl") as string;
  const instagramUrl = formData.get("instagramUrl") as string;

  try {
    await prisma.generalSettings.upsert({
      where: { id: 1 },
      update: {
        siteName,
        currency,
        openingBalance,
        contactEmail,
        facebookUrl,
        instagramUrl,
      },
      create: {
        id: 1,
        siteName,
        currency,
        openingBalance,
        contactEmail,
        facebookUrl,
        instagramUrl,
      },
    });

    // تحديث الكاش لضمان ظهور البيانات الجديدة في كل الموقع
    revalidatePath("/");
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/invoices");
    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, error: "فشل تحديث الإعدادات" };
  }
}