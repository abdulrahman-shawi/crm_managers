"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Save, Globe, Settings, 
  Users, CreditCard, ShoppingBag, Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateSeoAction } from "@/actions/seo";

const PAGES = [
  { slug: "products", name: "المنتجات", icon: ShoppingBag },
  { slug: "fixed-expenses", name: "المصاريف الثابتة", icon: CreditCard },
  { slug: "customers", name: "العملاء", icon: Users },
  { slug: "settings", name: "الإعدادات", icon: Settings }
];

export default function SeoSettingsPage() {
  const [activeTab, setActiveTab] = useState("products");
  const [seoData, setSeoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // جلب البيانات من الـ API
  useEffect(() => {
    fetch("/api/dashboard/settings")
      .then(res => res.json())
      .then(data => {
        setSeoData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const currentSeo = seoData.find(s => s.slug === activeTab);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="space-y-8" dir="rtl">
      {/* الهيدر */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="text-blue-600" size={28} />
          إعدادات محركات البحث (SEO)
        </h1>
        <p className="text-slate-500 text-sm">تخصيص كيفية ظهور صفحاتك في نتائج بحث Google</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* قائمة التبويبات الجانبية */}
        <div className="lg:col-span-1 space-y-2">
          {PAGES.map((page) => {
            const Icon = page.icon;
            return (
              <button
                key={page.slug}
                onClick={() => setActiveTab(page.slug)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                  activeTab === page.slug
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                <Icon size={20} />
                {page.name}
              </button>
            );
          })}
        </div>

        {/* نموذج التعديل */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  تحسين صفحة: {PAGES.find(p => p.slug === activeTab)?.name}
                </h3>
              </div>

              <form 
                action={async (formData) => {
                  setIsSaving(true);
                  await updateSeoAction(formData);
                  setIsSaving(false);
                }} 
                className="p-8 space-y-6"
              >
                <input type="hidden" name="slug" value={activeTab} />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">عنوان الميتا (Meta Title)</label>
                  <input 
                    key={activeTab + "-title"}
                    name="title" 
                    defaultValue={currentSeo?.title || ""}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="مثلاً: متجرنا | المنتجات المتميزة"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">وصف الميتا (Meta Description)</label>
                  <textarea 
                    key={activeTab + "-desc"}
                    name="description" 
                    defaultValue={currentSeo?.description || ""}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                    placeholder="اكتب وصفاً جذاباً ليظهر في نتائج البحث..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">الكلمات المفتاحية (Keywords)</label>
                  <input 
                    key={activeTab + "-key"}
                    name="keywords" 
                    defaultValue={currentSeo?.keywords || ""}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="كلمة1, كلمة2, ..."
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    حفظ إعدادات {PAGES.find(p => p.slug === activeTab)?.name}
                  </button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}