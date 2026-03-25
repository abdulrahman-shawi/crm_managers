import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type ReturnPayload = {
  invoiceId?: string;
  type: "REFUND" | "EXCHANGE";
  returnedProductId: number;
  exchangedProductId?: number;
  quantity: number;
  priceDifference?: number;
  note?: string;
};

export async function GET() {
  try {
    const returns = await (prisma as any).return.findMany({
      include: {
        invoice: {
          select: {
            id: true,
            customer: {
              select: {
                name: true,
              },
            },
          },
        },
        returnedProduct: {
          select: {
            id: true,
            name: true,
            modelNumber: true,
          },
        },
        exchangedProduct: {
          select: {
            id: true,
            name: true,
            modelNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(returns, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل في جلب المرتجعات", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ReturnPayload;

    if (!body.type || !body.returnedProductId || !body.quantity) {
      return NextResponse.json({ error: "البيانات الأساسية ناقصة" }, { status: 400 });
    }

    if (body.type === "EXCHANGE" && !body.exchangedProductId) {
      return NextResponse.json(
        { error: "يجب اختيار المنتج البديل عند نوع تبديل" },
        { status: 400 }
      );
    }

    if (body.type === "EXCHANGE" && body.returnedProductId === body.exchangedProductId) {
      return NextResponse.json(
        { error: "المنتج البديل يجب أن يكون مختلفا عن المنتج المرتجع" },
        { status: 400 }
      );
    }

    const quantity = Number(body.quantity);
    if (Number.isNaN(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "الكمية غير صالحة" }, { status: 400 });
    }

    if (body.invoiceId) {
      const invoice = await prisma.invoice.findUnique({ where: { id: body.invoiceId } });
      if (!invoice) {
        return NextResponse.json({ error: "رقم الفاتورة غير موجود" }, { status: 404 });
      }
    }

    const created = await prisma.$transaction(async (tx) => {
      const returnedProduct = await tx.product.findUnique({ where: { id: Number(body.returnedProductId) } });
      if (!returnedProduct) {
        throw new Error("المنتج المرتجع غير موجود");
      }

      await tx.product.update({
        where: { id: Number(body.returnedProductId) },
        data: {
          stock: {
            increment: quantity,
          },
        },
      });

      if (body.type === "EXCHANGE" && body.exchangedProductId) {
        const replacementProduct = await tx.product.findUnique({
          where: { id: Number(body.exchangedProductId) },
        });

        if (!replacementProduct) {
          throw new Error("المنتج البديل غير موجود");
        }

        if (replacementProduct.stock < quantity) {
          throw new Error(`مخزون المنتج البديل غير كاف: ${replacementProduct.name}`);
        }

        await tx.product.update({
          where: { id: Number(body.exchangedProductId) },
          data: {
            stock: {
              decrement: quantity,
            },
          },
        });
      }

      return (tx as any).return.create({
        data: {
          invoiceId: body.invoiceId || null,
          type: body.type,
          returnedProductId: Number(body.returnedProductId),
          exchangedProductId: body.type === "EXCHANGE" ? Number(body.exchangedProductId) : null,
          quantity,
          priceDifference: Number(body.priceDifference || 0),
          note: body.note || null,
        },
        include: {
          invoice: {
            select: {
              id: true,
              customer: {
                select: {
                  name: true,
                },
              },
            },
          },
          returnedProduct: {
            select: {
              id: true,
              name: true,
              modelNumber: true,
            },
          },
          exchangedProduct: {
            select: {
              id: true,
              name: true,
              modelNumber: true,
            },
          },
        },
      });
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل في إنشاء المرتجع", details: error.message },
      { status: 400 }
    );
  }
}
