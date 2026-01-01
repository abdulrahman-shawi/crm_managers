"use client";

import { OrdersTable } from '@/components/OrdersTable';
import { SalesChart } from '@/components/SalesChart';
import { StatCard } from '@/components/StatCard';
import { Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useInvoices } from '@/hooks/invoices';

export default function Dashboard() {
  const [users, setUser] = useState(0);
  const { netBalance, revenues, expenses } = useInvoices();
  const { user } = useAuth();

  /* 1. منطق حساب الإيرادات (Revenues) للرسم البياني */
  const chartData = useMemo(() => {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    // إنشاء كائن يحتوي على إجمالي كل شهر مبدئياً بقيمة 0
    const monthlyTotals: { [key: string]: number } = {};
    months.forEach(m => monthlyTotals[m] = 0);

    // تجميع مبالغ الإيرادات حسب الشهر
    revenues.forEach((inv: any) => {
      // تحويل التاريخ من قاعدة البيانات إلى كائن Date
      const d = new Date(inv.date);
      if (!isNaN(d.getTime())) {
        const monthName = months[d.getMonth()];
        // استخدام totalAmount بناءً على اسم الحقل في قاعدة بيانات Neon
        // وإضافة خيار amount كاحتياط
        const amount = Number(inv.totalAmount || inv.amount || 0);
        monthlyTotals[monthName] += amount;
      }
    });

    // تحويل الكائن إلى مصفوفة مرتبة تناسب Recharts
    return months.map(name => ({
      name,
      sales: monthlyTotals[name] // هنا sales تعبر عن إجمالي الإيرادات لهذا الشهر
    })).filter((_, index) => index <= new Date().getMonth()); 
    // يظهر الأشهر حتى الشهر الحالي فقط لضمان دقة الرسم البياني
  }, [revenues]);

  /* 2. جلب عدد المستخدمين */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users");
        setUser(res.data.length || 0);
      } catch (err) {
        console.error("فشل جلب البيانات", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-8"> 
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          لوحة التحكم العامة
        </h1>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          تحديث تلقائي: <span className="font-mono">{new Date().toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي المستخدمين" value={users} icon={Users} trend="+12%" />
        <StatCard title="الأرباح" value={`${netBalance.toLocaleString(undefined, {minimumFractionDigits:2})} ل.س`} icon={DollarSign} trend="+8%" />
        <StatCard title="الفواتير" value={expenses.length + revenues.length} icon={ShoppingCart} trend="+5%" />
        <StatCard title="معدل النشاط" value="89%" icon={Activity} trend="+2%" />
      </div>

      {/* 3. عرض رسم بياني للإيرادات (Revenues) */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">إجمالي الإيرادات الشهرية</h3>
        <SalesChart data={chartData} />
      </div>

      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">آخر الطلبات</h3>
        <OrdersTable />
      </div>
    </div>
  );
}