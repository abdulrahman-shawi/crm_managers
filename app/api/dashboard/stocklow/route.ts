import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const products = await prisma.product.findMany({
            where: {
                stock: {
                    lt: 4 // تعني Less Than
                }
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "فشل في جلب البيانات" }, { status: 500 });
    }
}