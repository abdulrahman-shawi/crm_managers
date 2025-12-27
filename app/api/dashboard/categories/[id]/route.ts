import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

interface Props {
  params: { id: number };
}

export async function GET(request:NextRequest , { params: { id } }: Props  ) {       
    const category = await prisma.category.findUnique({
        where: { id: Number(id) },
        include: { products: true }
    });
    return new Response(JSON.stringify(category), {
        status: 200,
        headers: {      
            'Content-Type': 'application/json'}
    }); 
}

export async function PUT(request:NextRequest , { params: { id } }: Props  ) {
    const data = await request.json();
    const { name , description } = data;    
    const updatedCategory = await prisma.category.update({
        where: { id: Number(id) },
        data: { 
            name,       
            description
        }   
    });;
    return new Response(JSON.stringify(updatedCategory), {
        status: 200,
        headers: {      
            'Content-Type': 'application/json'}
    });
}

export async function DELETE(request:NextRequest , { params: { id } }: Props  ) {    
    await prisma.category.delete({
        where: { id: Number(id) }   
    });;
    return new Response(null, {
        status: 204,
        headers: {      
            'Content-Type': 'application/json'}
    });
}