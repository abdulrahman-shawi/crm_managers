"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.valid) {
      throw new Error(data.message);
    }

    // تسجيل الدخول ناجح
    window.location.href = "/dashboard";

  } catch (err: any) {
    setError(err.message || "حدث خطأ غير متوقع");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 font-sans"
      dir="rtl"
    >
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            مرحباً بعودتك
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            قم بتسجيل الدخول لمتابعة حسابك
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pr-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@mail.com"
                className="w-full pr-12 pl-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                كلمة المرور
              </label>
              <Link href="#" className="text-xs font-bold text-blue-600">
                نسيت كلمة المرور؟
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pr-12 pl-12 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm font-bold text-center">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-lg transition-all disabled:opacity-50"
          >
            {loading ? "جاري الدخول..." : "دخول للنظام"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
          ليس لديك حساب؟{" "}
          <Link href="/signup" className="text-blue-600 font-bold hover:underline">
            أنشئ حسابك الآن
          </Link>
        </p>
      </div>
    </div>
  );
}
