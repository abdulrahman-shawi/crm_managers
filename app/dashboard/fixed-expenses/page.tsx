"use client";
import React from "react";
import { 
  Plus, Trash2, FileText, 
  CreditCard, Search, X, Edit3, Save 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// استيراد الـ Hook (تأكد من المسار الصحيح للملف)
import { useFixedExpenses } from "@/hooks/fixed";

export default function FixedExpensesPage() {
  // استخدام الـ Hook واستخراج القيم والوظائف المطلوبة
  const {
    expenses,
    totalFixed,
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    editingId,
    handleSave,
    deleteExpense,
    closeModal,
    openEditModal
  } = useFixedExpenses();

  return (
    <div className="space-y-8" dir="rtl">
      {/* الهيدر */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
           المصروفات الثابتة
        </h1>
        <p className="text-slate-500 text-sm">إدارة وتتبع الالتزامات المالية المتكررة شهرياً</p>
      </div>

      {/* بطاقة الإجمالي */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">إجمالي المصروفات الشهرية</p>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white tabular-nums">€{totalFixed.toLocaleString()}</h2>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
            <CreditCard className="text-blue-600" size={32} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
            <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
                <Plus size={20} /> إضافة مصروف جديد
            </button>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
           <h3 className="font-bold text-slate-900 dark:text-white">جدول الالتزامات</h3>
           <div className="relative w-64">
             <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input type="text" placeholder="بحث..." className="w-full bg-slate-50 dark:bg-slate-800 border-none pr-10 pl-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
                <th className="px-8 py-4">المصروف</th>
                <th className="px-8 py-4 text-center">المبلغ</th>
                <th className="px-8 py-4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {expenses.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-colors">
                        <FileText size={20} />
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="font-bold text-slate-900 dark:text-white text-lg tabular-nums">€{item.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <div className="flex justify-end gap-2">
                        {/* استخدام دالة الفتح للتعديل من الـ Hook */}
                        <button onClick={() => openEditModal(item)} className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Edit3 size={18} />
                        </button>
                        {/* استخدام دالة الحذف من الـ Hook */}
                        <button onClick={() => deleteExpense(item.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* المودال */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{editingId ? "تعديل المصروف" : "مصروف جديد"}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">اسم المصروف</label>
                  <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">المبلغ (€)</label>
                  <input required type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                    <Save size={20} /> حفظ البيانات
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}