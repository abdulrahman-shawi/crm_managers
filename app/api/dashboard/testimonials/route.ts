import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: {
                id: 'desc',
            },
        });

        return NextResponse.json(testimonials);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch testimonials' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const testimonial = await prisma.testimonial.create({
            data: body,
        });

        return NextResponse.json(testimonial, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create testimonial' },
            { status: 500 }
        );
    }
}