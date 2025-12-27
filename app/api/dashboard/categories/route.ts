import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest) {       
    // مثال على بيانات ثابتة لفئات المنتجات 
    const Categories = await prisma.category.findMany({
        include:{products:true},
        orderBy:{id:'asc'}
    })
    return new Response(JSON.stringify(Categories), {
        status: 200,
        headers: {      
            'Content-Type': 'application/json'}
    });
}

export async function POST(request:NextRequest) {
    const data = await request.json();
    const { name , description } = data;        
    const newCategory = await prisma.category.create({
        data: {
            name,       
            description
        }
    });
    return new Response(JSON.stringify(newCategory), {
        status: 201,
        headers: {      
            'Content-Type': 'application/json'}
    });
}