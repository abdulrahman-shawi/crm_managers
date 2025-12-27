export const dynamic = 'force-dynamic'; // يمنع التخزين المؤقت تماماً
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {


    try {
        // جلب جميع المستخدمين من جدول User
        const users = await prisma.user.findMany();

        // إعادة النتيجة كـ JSON
        return NextResponse.json({ users, status: 201 });
    } catch (error: any) {
        console.error("Error fetching users:", error);

        // إعادة رسالة خطأ مع كود 500
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب المستخدمين." },
            { status: 500 }
        );
    }
}
