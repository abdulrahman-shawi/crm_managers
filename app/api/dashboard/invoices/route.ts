import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const invoices = await prisma.invoice.findMany({
            include: {
                customer: true,
                items: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return NextResponse.json(invoices, { status: 200 });
    } catch (error: any) {
        console.error("Prisma Error Details:", error);
        return NextResponse.json(
            { error: "فشل في جلب الفواتير", details: error.message }, 
            { status: 500 }
        );
    }
 };     

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { 
            type, clientName, status, items, 
            grandTotal 
        } = body;

        // 1. البحث عن العميل للحصول على الـ ID (لأن السكيما تتطلب Int)
        const customer = await prisma.customer.findFirst({
            where: { name: clientName }
        });

        // 2. تحويل القيم لتناسب الـ Enums في السكيما
        const formattedType = type === "revenue" ? "REVENUE" : "EXPENSE";
        const formattedStatus = status === "مدفوعة" ? "PAID" : "PENDING";

        // 3. الحفظ في قاعدة البيانات
        const newInvoice = await prisma.invoice.create({
            data: {
                type: formattedType,
                status: formattedStatus,
                totalAmount: parseFloat(grandTotal),
                // ربط بالعميل إذا وجد، أو يترك null إذا كان اختيارياً
                customerId: customer ? customer.id : null,
                
                // إضافة البنود (InvoiceItem)
                items: {
                    create: items.map((item: any) => ({
                        productId: parseInt(item.productId),
                        quantity: parseInt(item.quantity),
                        unitPrice: parseFloat(item.price),
                        discount: parseFloat(item.discount || 0),
                        note: item.note || "",
                        subTotal: parseFloat(item.total) // الإجمالي بعد الخصم للبند
                    }))
                }
            },
            include: {
                items: true
            }
        });

        return NextResponse.json(newInvoice, { status: 201 });

    } catch (error: any) {
        console.error("Prisma Error Details:", error);
        return NextResponse.json(
            { error: "فشل في حفظ الفاتورة", details: error.message }, 
            { status: 500 }
        );
    }
}