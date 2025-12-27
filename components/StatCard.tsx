// components/StatCard.tsx
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: string;
}

export const StatCard = ({ title, value, icon: Icon, trend }: StatCardProps) => (
  <div className="p-6 bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:border-blue-500/30 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      {/* أيقونة مع خلفية متغيرة */}
      <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      
      {/* مؤشر التوجه (Trend) */}
      <div className={`flex items-center px-2 py-1 rounded-lg text-xs font-bold ${
        trend.includes('+') 
        ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' 
        : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
      }`}>
        {trend}
      </div>
    </div>

    {/* النصوص */}
    <div className="space-y-1">
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide">
        {title}
      </h3>
      <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        {value}
      </p>
    </div>

    {/* خط ديكوري سفلي يظهر عند التحويم (Hover) في الوضع المظلم */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl" />
  </div>
);