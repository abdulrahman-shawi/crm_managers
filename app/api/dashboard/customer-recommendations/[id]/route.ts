import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// في النسخ الحديثة من Next.js، الـ params تكون Promise
interface Props {
  params: Promise<{ id: string }>; 
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.testimonial.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}