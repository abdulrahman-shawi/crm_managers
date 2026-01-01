import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Filter } from 'lucide-react';

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
        const { type, clientName, status, items, grandTotal } = body;

        // 1. تحويل القيم للـ Enums
        const formattedType = type === "revenue" ? "REVENUE" : "EXPENSE";
        const formattedStatus = status === "مدفوعة" ? "PAID" : "PENDING";

        // 2. البحث عن العميل
        const customer = await prisma.customer.findFirst({
            where: { name: clientName }
        });

        // 3. بدء المعاملة (Transaction) لضمان سلامة البيانات
        const result = await prisma.$transaction(async (tx) => {
            
            // أ. إنشاء الفاتورة والبنود التابعة لها
            const newInvoice = await tx.invoice.create({
                data: {
                    type: formattedType,
                    status: formattedStatus,
                    totalAmount: parseFloat(grandTotal),
                    customerId: customer ? customer.id : null,
                    items: {
                        create: items.map((item: any) => ({
                            productId: parseInt(item.productId),
                            quantity: parseInt(item.quantity),
                            unitPrice: parseFloat(item.price),
                            discount: parseFloat(item.discount || 0),
                            note: item.note || "",
                            subTotal: parseFloat(item.total)
                        }))
                    }
                },
                include: { items: true }
            });

            // ب. تحديث المخزون لكل منتج
            for (const item of items) {
                const productId = parseInt(item.productId);
                const quantity = parseInt(item.quantity);

                // جلب بيانات المنتج للتأكد من المخزون الحالي (فقط في حالة البيع REVENUE)
                if (formattedType === "REVENUE") {
                    const product = await tx.product.findUnique({
                        where: { id: productId }
                    });

                    if (!product || product.stock < quantity) {
                        throw new Error(`المخزون غير كافٍ للمنتج: ${product?.name || productId}`);
                    }
                }

                // ج. تنفيذ التحديث (زيادة أو نقصان)
                await tx.product.update({
                    where: { id: productId },
                    data: {
                        stock: {
                            [formattedType === "REVENUE" ? "decrement" : "increment"]: quantity
                        }
                    }
                });
            }

            return newInvoice;
        });

        return NextResponse.json(result, { status: 201 });

    } catch (error: any) {
        console.error("Error:", error.message);
        return NextResponse.json(
            { 
                error: "فشل في معالجة الطلب", 
                details: error.message 
            }, 
            { status: 400 } // نستخدم 400 للأخطاء المنطقية مثل "المخزون غير كافٍ"
        );
    }
}