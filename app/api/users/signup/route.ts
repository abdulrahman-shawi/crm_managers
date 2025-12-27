import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { Role } from "@/generated/prisma/enums";
import bcrypt from 'bcryptjs';

interface BodyProps {
    name: string;
    email: string;
    password: string;
    role: Role;
    isActive: boolean;
}

export async function POST(request: NextRequest) {
    const body = (await request.json()) as BodyProps
    const exitsuser = await prisma.user.findUnique({ where: { email: body.email } })
    if (exitsuser) {
        return new Response("المستخدم موجود بالفعل", { status: 400 })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    const createuser = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: hashedPassword,
            role: body.role,
            isActive: body.isActive
        },
        select:{
            name:true,
            id:true,
            role:true,
            isActive:true,
            email:true
        }
    })
    return new Response(JSON.stringify(createuser), { status: 201 })
}