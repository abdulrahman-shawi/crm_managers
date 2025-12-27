// app/dashboard/page.tsx
import { StatCard } from '@/components/StatCard';
import { Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">لوحة التحكم العامة</h1>
      
      {/* شبكة البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="إجمالي المستخدمين" value="2,543" icon={Users} trend="+12%" />
        <StatCard title="المبيعات" value="$45,231" icon={DollarSign} trend="+8%" />
        <StatCard title="الطلبات" value="154" icon={ShoppingCart} trend="+5%" />
        <StatCard title="معدل النشاط" value="89%" icon={Activity} trend="+2%" />
      </div>

      {/* قسم الرسوم البيانية */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">تحليل المبيعات السنوي</h2>
        <div className="h-[300px] flex items-center justify-center border-dashed border-2 border-slate-100">
          {/* هنا يتم وضع مكون Recharts لاحقاً */}
          <p className="text-slate-400">الرسم البياني سيظهر هنا</p>
        </div>
      </div>
    </div>
  );
}