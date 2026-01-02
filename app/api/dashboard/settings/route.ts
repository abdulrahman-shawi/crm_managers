// app/api/seo/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // 1. جلب البيانات من قاعدة البيانات
        const settings = await prisma.pageSeo.findMany();

        // 2. يجب دائماً إرجاع Response بصيغة JSON
        return NextResponse.json(settings, { status: 200 });

    } catch (error) {
        console.error("SEO Fetch Error:", error);

        // 3. إرجاع رسالة خطأ واضحة في حال فشل الاتصال بقاعدة البيانات
        return NextResponse.json(
            { error: "Failed to fetch SEO settings" }, 
            { status: 500 }
        );
    }
}