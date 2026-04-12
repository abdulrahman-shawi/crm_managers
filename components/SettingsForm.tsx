// SettingsForm.tsx (Client Component)
"use client";

import React, { useState } from "react";
import { 
  Info, Mail, Share2, Shield, 
  Save, Loader2, Wallet, Facebook, Instagram 
} from "lucide-react";
import { updateSettingsAction } from "@/actions/settings"; // تأكد من إنشاء هذا الملف

export default function SettingsForm({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  // دالة التعامل مع الحفظ
  const handleSubmit = async (formData: FormData) => {
    setIsSaving(true);
    const result = await updateSettingsAction(formData);
    if (result?.success) {
      // يمكنك إضافة toast هنا
      alert("تم حفظ الإعدادات بنجاح");
    }
    setIsSaving(false);
  };

  return (
    <form action={handleSubmit} className="p-8 space-y-6">
      {/* التبويبات - القسم العام */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
              <Info className="text-blue-500" size={20} /> المعلومات الأساسية
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-slate-300">اسم المتجر</label>
              <input 
                name="siteName"
                defaultValue={initialData?.siteName || ""}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="أدخل اسم الموقع..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-slate-300">العملة الافتراضية</label>
              <select 
                name="currency"
                defaultValue={initialData?.currency || "EUR"}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="SAR">SYR (ل.س)</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium dark:text-slate-300 flex items-center gap-2">
                <Wallet size={16} className="text-slate-400" /> مبلغ فتح الحساب
              </label>
              <input
                name="openingBalance"
                type="number"
                step="0.01"
                min="0"
                defaultValue={initialData?.openingBalance ?? 0}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="0.00"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                سيتم احتساب الرصيد الحالي في الفواتير كالتالي: مبلغ الافتتاح + المقبوضات - المدفوعات.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-slate-300 flex items-center gap-2">
              <Mail size={16} className="text-slate-400" /> بريد التواصل (الرسمي)
            </label>
            <input 
              name="contactEmail"
              type="email" 
              defaultValue={initialData?.contactEmail || ""}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              placeholder="admin@yourstore.com" 
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold dark:text-white flex items-center gap-2 mb-6">
              <Share2 className="text-blue-500" size={20} /> روابط التواصل الاجتماعي
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-300 flex items-center gap-2">
                  <Facebook size={16} className="text-blue-600" /> رابط Facebook
                </label>
                <input 
                  name="facebookUrl"
                  defaultValue={initialData?.facebookUrl || ""}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-300 flex items-center gap-2">
                  <Instagram size={16} className="text-pink-600" /> رابط Instagram
                </label>
                <input 
                  name="instagramUrl"
                  defaultValue={initialData?.instagramUrl || ""}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* التبويبات - قسم الأمان */}
      {activeTab === "security" && (
        <div className="space-y-6 py-10 text-center animate-in fade-in slide-in-from-bottom-4">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] max-w-sm mx-auto">
            <Shield size={48} className="mx-auto text-blue-500 mb-4" />
            <h4 className="font-bold dark:text-white mb-2">إعدادات الحماية</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              يمكنك هنا تغيير كلمة مرور الإدارة وتفعيل المصادقة الثنائية. (قيد التطوير)
            </p>
          </div>
        </div>
      )}

      {/* زر الحفظ الثابت في الأسفل */}
      <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button 
          type="submit"
          disabled={isSaving}
          className="w-full md:w-auto px-12 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>حفظ كافة الإعدادات</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}