"use client";
// app/dashboard/page.tsx
import { OrdersTable } from '@/components/OrdersTable';
import { SalesChart } from '@/components/SalesChart';
import { StatCard } from '@/components/StatCard';

import { Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [users , setUser] = useState(0) 
  const fetchUsers = async () => {
        try {
            const res = await axios.get("/api/users");
            setUser(res.data.length || 0);
        } catch (err) {
            console.error("فشل جلب البيانات", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
const { user  } = useAuth();
  return (
    // أزلت الخلفية من هنا لأن الـ Layout الأساسي يتكفل بها، لضمان تناسق الألوان
    <div className="space-y-8"> 
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          لوحة التحكم العامة
        </h1>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          تحديث تلقائي: <span className="font-mono">14:45</span>
        </div>
      </div>
      {/* شبكة البطاقات - تم تحسين التباعد */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي المستخدمين" value={users} icon={Users} trend="+12%" />
        <StatCard title="المبيعات" value="$45,231" icon={DollarSign} trend="+8%" />
        <StatCard title="الطلبات" value="154" icon={ShoppingCart} trend="+5%" />
        <StatCard title="معدل النشاط" value="89%" icon={Activity} trend="+2%" />
      </div>

      {/* قسم المبيعات */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <SalesChart />
      </div>
      {/* قسم الطلبات */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <OrdersTable />
      </div>
    </div>
  );
}