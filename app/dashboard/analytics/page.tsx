"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { TrendingUp, Users, Eye, ShoppingCart, ArrowUpRight, ArrowDownRight } from "lucide-react";

// بيانات تجريبية للرسم البياني (نمو المستخدمين)
const data = [
  { name: "يناير", value: 400 },
  { name: "فبراير", value: 700 },
  { name: "مارس", value: 600 },
  { name: "أبريل", value: 1200 },
  { name: "مايو", value: 1500 },
  { name: "يونيو", value: 1800 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">إحصائيات النظام</h1>
        <p className="text-slate-500 text-sm">نظرة عامة على أداء المنصة خلال الـ 6 أشهر الأخيرة</p>
      </div>

      {/* بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي الزيارات" value="45.2k" trend="+12%" icon={<Eye className="text-blue-600" />} isUp={true} />
        <StatCard title="المستخدمين الجدد" value="1,284" trend="+5%" icon={<Users className="text-indigo-600" />} isUp={true} />
        <StatCard title="المبيعات" value="€12,430" trend="-2%" icon={<ShoppingCart className="text-emerald-600" />} isUp={false} />
        <StatCard title="معدل التحويل" value="3.2%" trend="+8%" icon={<TrendingUp className="text-amber-600" />} isUp={true} />
      </div>

      {/* الرسوم البيانية الرئيسية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الرسم البياني الكبير - نمو المنصة */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold mb-6">نمو عدد الزيارات</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* توزيع المستخدمين حسب الجهاز */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold mb-6">تفاعل المستخدمين</h3>
          <div className="space-y-6">
            <ProgressLine label="موبايل" percent={70} color="bg-blue-600" />
            <ProgressLine label="كمبيوتر" percent={20} color="bg-indigo-500" />
            <ProgressLine label="أجهزة لوحية" percent={10} color="bg-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

// مكونات فرعية للتنظيم
function StatCard({ title, value, trend, icon, isUp }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isUp ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'}`}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h2 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{value}</h2>
    </div>
  );
}

function ProgressLine({ label, percent, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}