import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { email: string };
}

/* =======================
   GET : التحقق من وجود مستخدم
======================= */
export async function GET(
  request: NextRequest,
  { params: { email } }: Props
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true }, // فقط تحقق
    });

    return NextResponse.json(
      { valid: Boolean(user) },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET USER ERROR:", error);
    return NextResponse.json(
      { message: "خطأ في السيرفر" },
      { status: 500 }
    );
  }
}

/* =======================
   PUT : تحديث المستخدم
======================= */
export async function PUT(
  request: NextRequest,
  { params: { email } }: Props
) {
  try {
    const body = await request.json();

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
        isActive: body.status, // boolean
        ...(body.password && {
          password: await bcrypt.hash(body.password, 12), // ❗ تأكد أنك تشفّره قبل الحفظ
        }),
      },
    });

    return NextResponse.json(
      { message: "تم تحديث المستخدم", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    return NextResponse.json(
      { message: "فشل تحديث المستخدم" },
      { status: 500 }
    );
  }
}

/* =======================
   DELETE : حذف المستخدم
======================= */
export async function DELETE(
  request: NextRequest,
  { params: { email } }: Props
) {
  try {
    await prisma.user.delete({
      where: { email },
    });

    return NextResponse.json(
      { message: "تم حذف المستخدم" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json(
      { message: "فشل حذف المستخدم" },
      { status: 500 }
    );
  }
}
