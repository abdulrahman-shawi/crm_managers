"use server";

// actions/settings.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSettingsAction(formData: FormData) {
  // استخراج كافة الحقول من الفورم
  const siteName = formData.get("siteName") as string;
  const currency = formData.get("currency") as string;
  const openingBalanceValue = Number(formData.get("openingBalance") ?? 0);
  const openingBalance = Number.isFinite(openingBalanceValue) ? openingBalanceValue : 0;
  const contactEmail = formData.get("contactEmail") as string;
  const facebookUrl = formData.get("facebookUrl") as string;
  const instagramUrl = formData.get("instagramUrl") as string;
  
  // ملاحظة: تأكد أن هذه الحقول موجودة في Schema الخاص بـ GeneralSettings في Prisma
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

    revalidatePath("/");
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/invoices");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "حدث خطأ أثناء الحفظ" };
  }
}