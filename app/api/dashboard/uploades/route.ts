import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // تحديد المسار داخل مجلد public
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public/uploads", fileName);

    // حفظ الملف
    await writeFile(filePath, buffer);
    
    // إرجاع الرابط الذي سيستخدمه المتصفح للوصول للصورة
    return NextResponse.json({ 
        success: true, 
        url: `/uploads/${fileName}` 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Upload failed" });
  }
}