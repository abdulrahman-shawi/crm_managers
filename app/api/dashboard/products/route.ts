import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
    const stock = formData.get("stock") as string;
    const categoryId = formData.get("categoryId") as string;

    // 1. فحص البيانات الأساسية
    if (!name || !price || !file) {
      return NextResponse.json({ 
        success: false, 
        message: "الاسم، السعر، والصورة حقول إجبارية" 
      }, { status: 400 });
    }

    // 2. معالجة وحفظ الصورة في مجلد public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadDir, fileName);
    
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));
    
    const imageUrl = `/uploads/${fileName}`;

    // 3. الإدخال في قاعدة البيانات (متوافق مع السكيما الخاصة بك)
    const product = await prisma.product.create({
      data: {
        name: name,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        image: imageUrl, // الحقل الذي أضفناه للسكيما
        // تحويل categoryId لرقم فقط إذا كان موجوداً
        categoryId: categoryId ? parseInt(categoryId) : null,
      },
    });

    return NextResponse.json({ success: true, data: product });

  } catch (error: any) {
    console.error("خطأ في الخادم:", error);
    return NextResponse.json({ 
      success: false, 
      message: "فشل في حفظ المنتج: " + (error.message || "خطأ داخلي")
    }, { status: 500 });
  }
}