"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Shield, UserPlus } from "lucide-react";
import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: any) => void;
}

export const AddUserModal = ({ isOpen, onClose, onAdd }: ModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    isActive: true,
    status: "active"
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData)
    onAdd({ ...formData, id: Date.now() });
    setFormData({ name: "", email: "", password: "", role: "", isActive: true, status: "active" });
    onClose();

  };

  return (
    <AnimatePresence>
      {isOpen && (
        // الحاوية الرئيسية التي تضمن التمركز
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">

          {/* الخلفية المعتمة - تملأ كامل الشاشة خلف الفورم */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute -inset-4 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* جسم النافذة (الفورم) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 z-[160]"
            dir="rtl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                  <UserPlus className="text-blue-600" size={24} />
                  إضافة مستخدم جديد
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-400 text-right">الاسم الكامل</label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="text"
                      className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500 rounded-xl outline-none transition-all text-sm text-slate-800 dark:text-white"
                      placeholder="أدخل الاسم..."
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-400 text-right">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="email"
                      className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500 rounded-xl outline-none transition-all text-sm text-slate-800 dark:text-white"
                      placeholder="example@mail.com"
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">كلمة المرور</label>
                  <input
                    required
                    type="password"
                    className="w-full pr-4 pl-4 py-3 rounded-xl border"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-400 text-right">الدور</label>
                  <div className="relative">
                    <Shield className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500 rounded-xl outline-none appearance-none transition-all text-sm text-slate-800 dark:text-white"
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="MANAGER">الحالة</option>
                      <option value="MANAGER">محرر</option>
                      <option value="USER">مستخدم</option>
                      <option value="ADMIN">مدير</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] mt-4"
                >
                  حفظ المستخدم
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};