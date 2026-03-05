// AuthWrapper.tsx
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import AuthProvider from "@/context/AuthProvider";
import { prisma } from "./prisma";

export default async function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("token")?.value;
  const jwtSecret = process.env.JWT_SECRET;

  let user = null;

  if (token && jwtSecret) {
    try {
      const decoded = jwt.verify(token, jwtSecret) as {
        email: string;
      };

      const dbUser = await prisma.user.findUnique({
        where: { email: decoded.email },
        select: {
          name: true,
          email: true,
          role: true,
          isActive: true,
          id: true,
        }
      });

      if (dbUser) {
        // تحويل البيانات لتطابق الأنواع المطلوبة في AuthProvider
        user = {
          ...dbUser,
          id: String(dbUser.id), // تحويل number إلى string
          role: String(dbUser.role), // تحويل Enum إلى string
        };
      }
    } catch {
      user = null;
    }
  }

  return <AuthProvider user={user}>{children}</AuthProvider>;
}