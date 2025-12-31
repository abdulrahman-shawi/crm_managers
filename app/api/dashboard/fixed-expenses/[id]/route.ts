import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
interface Props {
    params: { id: number };
}

export async function GET(request: NextRequest, { params: { id } }: Props) {
    const exp = await prisma.fixedExpense.findUnique({
        where: { id: id },
    })
    return new Response(JSON.stringify(exp), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// api/dashboard/fixed-expenses/[id]/route.ts

export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const body = await request.json();
        const id = parseInt(params.id); // تحويل المعرف إلى رقم

        if (isNaN(id)) {
            return NextResponse.json({ error: 'معرف غير صالح' }, { status: 400 });
        }

        const exp = await prisma.fixedExpense.update({
            where: { id: id },
            data: {
                name: body.title,
                // تأكد من أن المبلغ رقم وليس NaN
                amount: parseFloat(body.amount) || 0,
            }
        });

        return NextResponse.json(exp, { status: 200 }); // status 200 للتحديث بنجاح
    } catch (error) {
        console.error("Update Error:", error); // مهم جداً لرؤية الخطأ الحقيقي في الـ Terminal
        return NextResponse.json({ error: 'فشل في تعديل المصروف الثابت' }, { status: 500 });
    }
}