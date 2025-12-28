"use client";
import { useAuth } from "@/context/AuthContext";
import { 
  Home, BarChart2, Users, Settings, ChevronRight, ChevronLeft, 
  Receipt, Box, FileText, PieChart, ShieldCheck, HelpCircle, LogOut 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  icon: any;
  label: string;
  href: string;
};

export const Sidebar = ({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (val: boolean) => void }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  // تنظيم الروابط في مجموعات لسهولة القراءة
  const menuGroups = [
    {
      group: "الرئيسية",
      items: [
        { icon: Home, label: "لوحة التحكم", href: "/dashboard" },
        { icon: BarChart2, label: "التحليلات", href: "/dashboard/analytics" },
      ]
    },
    {
      group: "الأقسام الرئيسية",
      items: [
        { icon: Receipt, label: "الأقسام", href: "/dashboard/categories" },
        { icon: Box, label: "المخزن والمنتجات", href: "/dashboard/products" },
        { icon: Users, label: "العملاء", href: "/dashboard/customers" },
        { icon: FileText, label: "المصاريف الثابتة", href: "/dashboard/fixed-expenses" },
      ]
    },
    {
      group: "الموارد",
      items: [
        user?.role === "ADMIN" ?{ icon: Users, label: "المستخدمين", href: "/dashboard/users" }: null,
        { icon: FileText, label: "الفواتير", href: "/dashboard/invoices" },
      ].filter(Boolean) as MenuItem[],
    },
    {
      group: "النظام",
      items: [
        { icon: Settings, label: "الإعدادات", href: "/dashboard/settings" },
        { icon: ShieldCheck, label: "الأمان", href: "/dashboard/security" },
      ]
    }
  ];

  return (
    <aside className={`
      bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 h-screen sticky top-0 transition-all duration-300 ease-in-out hidden md:flex flex-col z-40
      ${isCollapsed ? "w-20" : "w-64"}
    `}>
      {/* زر التصغير/التكبير */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-3 top-[4.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm z-50 transition-colors"
      >
        {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
      {/* الشعار (Logo) */}
      <div className={`p-6 border-b border-slate-100 dark:border-slate-900 flex items-center ${isCollapsed ? "justify-center" : "justify-start"}`}>
        <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-2xl shrink-0 shadow-lg shadow-blue-500/20 flex items-center justify-center text-white rotate-3">
          <span className="font-black text-xl -rotate-3">ل</span>
        </div>
        {!isCollapsed && (
          <div className="mr-3 overflow-hidden">
            <span className="font-black text-xl text-slate-800 dark:text-white block leading-tight">لوحتي</span>
            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">نظام الإدارة</span>
          </div>
        )}
      </div>

      {/* القائمة الجانبية (Navigation) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-6">
            {!isCollapsed && (
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 px-3">
                {group.group}
              </p>
            )}
            <nav className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-4 p-3 rounded-xl transition-all group relative
                      ${isActive 
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-100 dark:shadow-none" 
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"}
                    `}
                  >
                    <item.icon size={22} className={`shrink-0 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                    {!isCollapsed && <span className="font-bold text-sm whitespace-nowrap">{item.label}</span>}
                    
                    {/* Tooltip عند التصغير */}
                    {isCollapsed && (
                      <div className="absolute right-full mr-4 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-2 group-hover:translate-x-0 shadow-xl whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                    {/* مؤشر النشاط */}
                    {isActive && !isCollapsed && (
                      <div className="absolute left-2 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* الجزء السفلي (الاعدادات وتسجيل الخروج) */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-900">
        <button className="w-full flex items-center gap-4 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all group relative">
          <LogOut size={22} className="shrink-0" />
          {!isCollapsed && <span className="font-bold text-sm">تسجيل الخروج</span>}
        </button>
        
        {!isCollapsed && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">أدمن النظام</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};