import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthWrapper from "@/lib/authprovider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// layout.tsx
export const metadata: Metadata = {
  title: {
    default: "CRM SYSTEM - نظام إدارة علاقات العملاء", // العنوان الذي يظهر إذا لم تضع عنواناً في الصفحة الفرعية
    template: "%s | CRM SYSTEM" // الـ %s سيتم استبدالها بعنوان الصفحة الفرعية
  },
  description: "نظام متطور لإدارة علاقات العملاء والموظفين",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CRM System",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange // إضافة اختيارية لتحسين الأداء عند التبديل
        >
           <AuthWrapper>{children}</AuthWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
