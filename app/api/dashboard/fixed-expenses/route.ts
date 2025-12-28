import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
export async function GET(request:NextRequest) {
    try {
        // مثال على بيانات المصروفات الثابتة
        const fixedExpenses = await prisma.fixedExpense.findMany();
        return new Response(JSON.stringify(fixedExpenses), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'فشل في جلب المصروفات الثابتة' }), { status: 500 });
    }   
}

export async function POST(request:NextRequest) {  
    try {
        const data = await request.json();
        const newExpense = await prisma.fixedExpense.create({
            data: {
                name: data.title,
                amount: data.amount,
                dueDate: data.date,
                isActive:true
            },
        });
        return new Response(JSON.stringify(newExpense), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'فشل في إنشاء المصروف الثابت' }), { status: 500 });
    }   
}