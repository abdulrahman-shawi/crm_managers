import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function GET(request:NextRequest) {
   try {
      const products = await prisma.product.findMany({
        include:{category:true},
        orderBy:{id:'asc'}
      });
      return new Response(JSON.stringify(products), {
         status: 200,
         headers: {
            "Content-Type": "application/json",
         },
      });
   } catch (error) {
      console.error("Error fetching products:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
         status: 500,
         headers: {
            "Content-Type": "application/json",
         },
      });
   }
}

import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const priceLow = formData.get("priceLow") as string;
    const stock = formData.get("stock") as string;
    const categoryId = formData.get("categoryId") as string;

    // 1. فحص البيانات
    if (!name || !price || !file) {
      return NextResponse.json({ 
        success: false, 
        message: "الاسم، السعر، والصورة حقول إجبارية" 
      }, { status: 400 });
    }

    // 2. الرفع إلى Vercel Blob فقط
    // ملاحظة: تأكد من إضافة BLOB_READ_WRITE_TOKEN في إعدادات Vercel
    const blob = await put(file.name, file, {
      access: "public",
    });

    // 3. الإدخال في قاعدة البيانات باستخدام رابط الـ Blob
    const product = await prisma.product.create({
      data: {
        name: name,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        image: blob.url, // الرابط المباشر من Vercel
        categoryId: categoryId ? parseInt(categoryId) : null,
        priceLow: parseFloat(priceLow)
      },
      include: { category: true }
    });

    return NextResponse.json({ success: true, product: product });

  } catch (error: any) {
    console.error("خطأ في الخادم:", error);
    
    // رسالة خطأ واضحة إذا كان السبب هو التوكن
    if (error.message.includes("No token found")) {
      return NextResponse.json({ 
        success: false, 
        message: "خطأ في الإعدادات: مفتاح Vercel Blob غير موجود" 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: false, 
      message: "فشل في حفظ المنتج: " + (error.message || "خطأ داخلي")
    }, { status: 500 });
  }
}
