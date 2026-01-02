// lib/seo.ts
// تأكد من إعداد ملف الـ prisma client

import { prisma } from "./prisma";

export async function getPageSeo(slug: string) {
  const seo = await prisma.pageSeo.findUnique({
    where: { slug },
  });
  return seo;
}