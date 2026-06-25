import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const resolveJwtSecret = () => {
  const raw =
    process.env.JWT_SECRET ??
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "";

  return raw.trim();
};

export async function getCurrentUser() {
  const token = cookies().get("token")?.value;
  const jwtSecret = resolveJwtSecret();

  if (!token || !jwtSecret) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { email?: string };

    if (!decoded.email) {
      return null;
    }

    return await prisma.user.findUnique({
      where: { email: decoded.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
  } catch {
    return null;
  }
}