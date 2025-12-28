import axios from "axios";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

interface Props {
    params: { id: number };
}


export async function GET(request: NextRequest, { params: { id } }: Props) {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: Number(id) },
        });
        return new Response(JSON.stringify(customer), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch customer" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}


export async function PUT(request: NextRequest, { params: { id } }: Props) {
    try {
        const data = await request.json();
        const { name, email, phone, address } = data;
        const updatedCustomer = await prisma.customer.update({
            where: { id: Number(id) },
            data: {
                name,
                email,
                phone,
                address
            }
        });;
        return new Response(JSON.stringify(updatedCustomer), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to update customer" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function DELETE(request: NextRequest, { params: { id } }: Props) {
    try {
        await prisma.customer.delete({
            where: { id: Number(id) }
        });;
        return new Response(null, {
            status: 204,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to delete customer" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}