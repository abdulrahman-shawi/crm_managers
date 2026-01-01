import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // 🔒 حماية API dashboard
  if (pathname.startsWith("/api/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔒 حماية صفحات dashboard
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🚫 منع الدخول إلى login إذا كان مسجّل
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/dashboard/:path*",
    "/login"
  ],
};
