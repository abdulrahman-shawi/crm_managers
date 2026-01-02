// app/actions/seo.ts
"use server"
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSeoAction(formData: FormData) {
  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const keywords = formData.get("keywords") as string;

  await prisma.pageSeo.upsert({
    where: { slug },
    update: { title, description, keywords },
    create: { slug, title, description, keywords },
  });

  revalidatePath("/"); // لتحديث البيانات فوراً في الموقع
}