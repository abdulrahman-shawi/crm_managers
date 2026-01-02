"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSettingsAction(formData: FormData) {
  const siteName = formData.get("siteName") as string;
  const currency = formData.get("currency") as string;
  const selectedTemplate = formData.get("selectedTemplate") as string;
  const logoUrl = formData.get("logoUrl") as string; // سنفترض حالياً أنه رابط نصي أو مسار

  try {
    await prisma.generalSettings.upsert({
      where: { id: 1 },
      update: {
        siteName,
        currency,
        selectedTemplate,
        logoUrl,
      },
      create: {
        id: 1,
        siteName,
        currency,
        selectedTemplate,
        logoUrl,
      },
    });

    revalidatePath("/"); // لتحديث الصفحة الرئيسية فوراً بالقالب الجديد
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "حدث خطأ أثناء الحفظ" };
  }
}