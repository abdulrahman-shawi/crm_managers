"use client";
import { useState } from "react";
import { User, Lock, Bell, Moon, Sun, Camera, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">إعدادات الحساب</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* القائمة الجانبية للإعدادات */}
        <div className="space-y-2">
          <SettingsTab 
            icon={<User size={18} />} 
            label="الملف الشخصي" 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")} 
          />
          <SettingsTab 
            icon={<Lock size={18} />} 
            label="الأمان" 
            active={activeTab === "security"} 
            onClick={() => setActiveTab("security")} 
          />
          <SettingsTab 
            icon={<Bell size={18} />} 
            label="التنبيهات" 
            active={activeTab === "notifications"} 
            onClick={() => setActiveTab("notifications")} 
          />
        </div>

        {/* محتوى الإعدادات */}
        <div className="md:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "security" && <SecuritySettings />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// مكون الملف الشخصي
function ProfileSettings() {
  return (
    <div className="p-6 space-y-8">
      {/* تغيير الصورة الشخصية */}
      <div className="flex flex-col items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white dark:border-slate-800 overflow-hidden">
            أ
          </div>
          <button className="absolute bottom-0 left-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
            <Camera size={16} />
          </button>
        </div>
        <div className="text-center">
          <h3 className="font-bold">أحمد علي</h3>
          <p className="text-sm text-slate-500">مدير النظام</p>
        </div>
      </div>

      {/* نموذج البيانات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputGroup label="الاسم الكامل" placeholder="أحمد علي" />
        <InputGroup label="البريد الإلكتروني" placeholder="ahmed@example.com" />
        <div className="md:col-span-2">
          <InputGroup label="نبذة تعريفية" placeholder="اكتب شيئاً عن نفسك..." isTextArea />
        </div>
      </div>

      <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all w-full md:w-auto justify-center">
        <Save size={18} />
        حفظ التغييرات
      </button>
    </div>
  );
}

// مكون الأمان
function SecuritySettings() {
  return (
    <div className="p-6 space-y-6">
      <h3 className="font-bold text-lg mb-4">تغيير كلمة المرور</h3>
      <InputGroup label="كلمة المرور الحالية" type="password" />
      <InputGroup label="كلمة المرور الجديدة" type="password" />
      <InputGroup label="تأكيد كلمة المرور الجديدة" type="password" />
      <button className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all">
        تحديث كلمة المرور
      </button>
    </div>
  );
}

// مكونات مساعدة UI
const SettingsTab = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium ${
      active 
      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const InputGroup = ({ label, placeholder, type = "text", isTextArea = false }: any) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</label>
    {isTextArea ? (
      <textarea 
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]"
      />
    ) : (
      <input 
        type={type} 
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
    )}
  </div>
);