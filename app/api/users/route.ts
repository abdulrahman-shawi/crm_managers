import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {


    try {
        // جلب جميع المستخدمين من جدول User
        const users = await prisma.user.findMany();
        const cat = await prisma.category.findMany();

        // إعادة النتيجة كـ JSON
        return NextResponse.json({ users, cat });
    } catch (error: any) {
        console.error("Error fetching users:", error);

        // إعادة رسالة خطأ مع كود 500
        return NextResponse.json(
            { error: "حدث خطأ أثناء جلب المستخدمين." },
            { status: 500 }
        );
    }
}
