import React from "react";
import { ShoppingBag, Zap, ShieldCheck } from "lucide-react";

export default function ModernTemplate({ settings }: { settings: any }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8" dir="rtl">
      {/* Hero Card */}
      <div className="max-w-7xl mx-auto bg-blue-600 rounded-[3rem] overflow-hidden relative shadow-2xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <ShoppingBag size={300} />
        </div>
        
        <div className="relative z-10 p-12 md:p-24 flex flex-col items-center text-center space-y-8">
          <span className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white font-bold text-sm uppercase tracking-widest">
             أهلاً بك في {settings.siteName}
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-white leading-tight uppercase italic">
            تسوق بذكاء <br /> مع {settings.siteName}
          </h1>
          <p className="text-blue-100 text-xl max-w-2xl font-medium leading-relaxed">
            نحن نقدم لك تجربة تسوق عصرية باستخدام أحدث التقنيات لضمان وصول طلبك بأمان، وجميع تعاملاتنا بـ <span className="underline decoration-white underline-offset-8 text-white">{settings.currency}</span>.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl">
              تصفح المجموعة
            </button>
          </div>
        </div>

        {/* Features Bar */}
        <div className="bg-blue-700/50 backdrop-blur-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10">
          <div className="flex items-center justify-center gap-4 text-white font-bold">
            <Zap className="text-yellow-400" /> شحن سريع جداً
          </div>
          <div className="flex items-center justify-center gap-4 text-white font-bold border-x border-white/10">
            <ShieldCheck className="text-green-400" /> ضمان حقيقي
          </div>
          <div className="flex items-center justify-center gap-4 text-white font-bold text-xl tabular-nums">
             نقبل الدفع بـ {settings.currency}
          </div>
        </div>
      </div>
    </div>
  );
}