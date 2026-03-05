import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


interface BodyProps {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { message: "إعدادات السيرفر ناقصة: DATABASE_URL غير موجود", valid: false },
        { status: 500 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "إعدادات السيرفر ناقصة: JWT_SECRET غير موجود", valid: false },
        { status: 500 }
      );
    }

    const body = (await request.json()) as BodyProps;

    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: "البيانات ناقصة", valid: false },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email , isActive: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "المستخدم غير موجود أو غير نشط", valid: false },
        { status: 404 }
      );
    }
    

const hashedPassword = await bcrypt.compare(body.password, existingUser.password);

    if (!hashedPassword) {
      return NextResponse.json(
        { message: "كلمة المرور غير صحيحة", valid: false },
        { status: 401 }
      );
    }

    // ✅ إنشاء JWT
    const token = jwt.sign(
      { email: existingUser.email , id: existingUser.id   , role: existingUser.role , name: existingUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ حفظه في Cookie
    const response = NextResponse.json(
      { message: "تسجيل الدخول ناجح", valid: true },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 أيام
    });

    return response;

  } catch (error: any) {
    console.error("Login API Error:", error?.message || error);
    return NextResponse.json(
      { message: "خطأ في السيرفر", valid: false },
      { status: 500 }
    );
  }
}
