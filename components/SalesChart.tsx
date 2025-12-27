// components/SalesChart.tsx
"use client"; // ضروري لأن Recharts تعتمد على التفاعل في المتصفح

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// بيانات تجريبية للمبيعات
const data = [
  { name: 'يناير', sales: 4000 },
  { name: 'فبراير', sales: 3000 },
  { name: 'مارس', sales: 5000 },
  { name: 'أبريل', sales: 2780 },
  { name: 'مايو', sales: 4890 },
  { name: 'يونيو', sales: 2390 },
  { name: 'يوليو', sales: 6490 },
];

export const SalesChart = () => {
  return (
    <div className="h-[350px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {/* تدرج لوني للمساحة تحت الخط */}
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          {/* شبكة خلفية خفيفة */}
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            className="stroke-slate-200 dark:stroke-slate-800" 
          />
          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            dy={10}
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          
          {/* تخصيص صندوق المعلومات عند مرور الماوس */}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--tw-bg-opacity)',
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
            cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
          />
          
          {/* الخط والمساحة الملونة */}
          <Area 
            type="monotone" 
            dataKey="sales" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSales)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};