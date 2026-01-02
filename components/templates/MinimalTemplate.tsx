import React from "react";
import { MoveLeft } from "lucide-react";

export default function MinimalTemplate({ settings }: { settings: any }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors" dir="rtl">
      <div className="max-w-5xl mx-auto px-6 py-32 space-y-24">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-slate-200 dark:border-slate-800 pb-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-light text-slate-900 dark:text-white font-serif tracking-tight">
              {settings.siteName} <span className="italic text-slate-400">Concept</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-md leading-relaxed">
              توازن بين الفن والوظيفة. نختار لك قطعاً تدوم للأبد، تُباع بوضوح وشفافية بعملة {settings.currency}.
            </p>
          </div>
          <button className="group flex items-center gap-4 text-slate-900 dark:text-white font-bold text-lg">
             استكشف المنتجات <MoveLeft className="group-hover:-translate-x-2 transition-transform" />
          </button>
        </header>

        {/* Minimal Hero Image PlaceHolder */}
        <div className="aspect-[21/9] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-all duration-700" />
           <span className="text-slate-300 dark:text-slate-700 text-9xl font-black select-none tracking-tighter">
             {settings.siteName.substring(0, 2)}
           </span>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 text-sm text-slate-400">
           <div className="space-y-2 font-bold uppercase tracking-widest text-slate-900 dark:text-white">المجموعة</div>
           <div className="space-y-2">عن المتجر</div>
           <div className="space-y-2">الشروط</div>
           <div className="space-y-2">العملة: {settings.currency}</div>
        </div>
      </div>
    </div>
  );
}