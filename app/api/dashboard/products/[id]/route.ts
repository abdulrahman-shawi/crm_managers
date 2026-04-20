import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

interface Props {
  params: { id: string }; // Next.js params are strings by default
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const id = params.id;
    const formData = await request.formData(); // الحل هنا: استلام formData وليس json

    // استخراج القيم من الـ FormData
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const stock = formData.get("stock") as string;
    const priceLow = formData.get("priceLow") as string;
    const inputCurrency = (formData.get("inputCurrency") as string) || "SAR";
    const modelNumber = formData.get("modelNumber") as string;
    const categoryId = formData.get("categoryId") as string;
    const file = formData.get("file") as File | null;
    const status = formData.get("status") as string;
    const settings = await prisma.generalSettings.findUnique({ where: { id: 1 } });
    const exchangeRate = Number(settings?.exchangeRate ?? 1) > 0 ? Number(settings?.exchangeRate ?? 1) : 1;
    const normalizedPrice = inputCurrency === "USD" ? parseFloat(price) * exchangeRate : parseFloat(price);
    const normalizedWholesalePrice = inputCurrency === "USD" ? parseFloat(priceLow) * exchangeRate : parseFloat(priceLow);

    let imagePath = undefined;

    // إذا قام المستخدم برفع صورة جديدة، نقوم بحفظها
    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const uploadPath = path.join(process.cwd(), "public/uploads", filename);
      
      await writeFile(uploadPath, buffer);
      imagePath = `/uploads/${filename}`;
    }

    // تحديث البيانات في قاعدة البيانات
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        price: normalizedPrice,
        priceLow: normalizedWholesalePrice,
        stock: parseInt(stock),
        modelNumber:modelNumber,
        status: status || undefined,
        categoryId: Number(categoryId),
        ...(imagePath && { image: imagePath }), // تحديث الصورة فقط إذا تم رفع ملف جديد
      },
      include:{category:true}
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { success: false, message: "فشل تحديث المنتج" },
      { status: 500 }
    );
  }
}

// دالة GET كما هي مع تحسين بسيط
export async function GET(request: NextRequest, { params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: Number(params.id) },
    include: { category: true }
  });
  
  if (!product) {
    return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function DELETE(request: NextRequest, { params }: Props) {
   try {
      const id = params.id;
      await prisma.product.delete({
         where: { id: Number(id) }
      });
      // الخيار الأفضل: نجاح مع إرسال تأكيد JSON
      return NextResponse.json({ success: true }, { status: 200 });
   } catch (error: any) {
      return NextResponse.json({ success: false }, { status: 500 });
   }
}