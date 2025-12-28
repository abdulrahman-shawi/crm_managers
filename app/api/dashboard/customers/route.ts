import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request : NextRequest) {
   try{
     const customers = await prisma.customer.findMany({});
    return new Response(JSON.stringify(customers), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
   } catch (error) {    
    return new Response(JSON.stringify({ error: "Failed to fetch customers" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
    });
   }
}

export async function POST(request : NextRequest) {
    try{
        const body = await request.json();
        const { name, email, phone, address } = body;   
        const newCustomer = await prisma.customer.create({
            data: {
                name,
                email,
                phone,
                address
            }
        });
        return new Response(JSON.stringify(newCustomer), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to create customer" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}