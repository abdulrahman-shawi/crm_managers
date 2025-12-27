"use client";
import React from "react";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="w-full max-w-xl space-y-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
        
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mb-2 text-blue-600">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">إنشاء حساب جديد</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">انضم إلينا وابدأ في إدارة بياناتك باحترافية</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pr-2">الاسم الكامل</label>
            <div className="relative group">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="الاسم الثلاثي"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pr-12 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pr-2">البريد الإلكتروني</label>
            <div className="relative group">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="example@mail.com"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pr-12 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pr-2">كلمة المرور</label>
            <div className="relative group">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pr-12 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pr-2">تأكيد كلمة المرور</label>
            <div className="relative group">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pr-12 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Signup Button */}
          <div className="md:col-span-2 pt-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-blue-500/20 active:scale-95">
              إنشاء حسابي الآن
            </button>
          </div>
        </form>

        <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
          هل لديك حساب بالفعل؟{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">سجل الدخول</Link>
        </p>
      </div>
    </div>
  );
}