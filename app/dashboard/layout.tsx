// app/dashboard/layout.tsx
"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "next-themes";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isCollapsed = typeof window !== "undefined" && window.innerWidth < 768
    ? !isMobileSidebarOpen
    : isDesktopCollapsed;

  const setSidebarState = (next: boolean) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobileSidebarOpen(!next);
      return;
    }

    setIsDesktopCollapsed(next);
  };

  return (
    <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange // إضافة اختيارية لتحسين الأداء عند التبديل
        >
    <div 
      className="flex min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500" 
      dir="rtl"
    >
      {isMobileSidebarOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة الجانبية"
          className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-[2px] md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setSidebarState} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => {
          if (typeof window !== "undefined" && window.innerWidth < 768) {
            setIsMobileSidebarOpen((prev) => !prev);
            return;
          }

          setIsDesktopCollapsed((prev) => !prev);
        }} />
        
        {/* المحتوى الرئيسي خلفية أفتح قليلاً من الخلفية الكلية لتعطي عمق */}
        <main className="p-4 md:p-8 bg-slate-50/50 dark:bg-slate-900/20 flex-1 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
    </ThemeProvider>
  );
}