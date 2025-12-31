"use client";
import React, { useEffect, useState } from "react";
import { 
  Plus, Trash2, Calendar, FileText, 
  CreditCard, Search, X, Edit3, Save, 
  ArrowUpRight, LayoutGrid, ArrowDownRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function FixedExpensesPage() {
  const [expenses, setExpenses] = useState([
    { id: 1, name: "إيجار المكتب الرئيسي", amount: 2500, category: "عقارات", date: "01 كل شهر" },
    { id: 2, name: "رواتب الفريق التقني", amount: 12400, category: "موارد بشرية", date: "25 كل شهر" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", amount: "", category: "إداري", date: "" });

  const totalFixed = expenses.reduce((sum, item) => sum + item.amount, 0);

  const getExp = async () => {
    const res =   await axios.get("/api/dashboard/fixed-expenses")
    if(res.status === 200){
      setExpenses(res.data)
      console.log(res.data)
    }
  }
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const res = await axios.put(`/api/dashboard/fixed-expenses/${editingId}` ,{
        title:formData.name,
        amount: parseFloat(formData.amount)
      })
      if(res.status === 200){
      setExpenses(expenses.map(item => item.id === editingId ? { ...item, ...formData, amount: parseFloat(formData.amount) } : item));
      }
    } else {
      const res = await axios.post('/api/dashboard/fixed-expenses', { 
        title: formData.name, 
        amount: parseFloat(formData.amount), 
        date: formData.date || "01 كل شهر" 
      });
      if (res.status === 201) 
      {

      setExpenses([...expenses, { id: Date.now(), ...formData, amount: parseFloat(formData.amount), date: formData.date || "01 كل شهر" }]);
      }
    }
    closeModal();
  };

  useEffect(() => {
    getExp()
  } , [])
  const closeModal = () => { setIsModalOpen(false); setEditingId(null); setFormData({ name: "", amount: "", category: "إداري", date: "" }); };

  return (
    <div className="space-y-8" dir="rtl">
      {/* الهيدر بنفس أسلوب AnalyticsPage */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
           المصروفات الثابتة
        </h1>
        <p className="text-slate-500 text-sm">إدارة وتتبع الالتزامات المالية المتكررة شهرياً</p>
      </div>

      {/* بطاقة الإجمالي بتصميم StatCard المطور */}
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

      {/* الجدول بنفس تنسيق وألوان الرسوم البيانية في AnalyticsPage */}
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
                        <button onClick={() => { setEditingId(item.id); setFormData({name: item.name, amount: item.amount.toString(), category: item.category, date: item.date}); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Edit3 size={18} />
                        </button>
                        <button onClick={() => setExpenses(expenses.filter(i => i.id !== item.id))} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
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

      {/* المودال الداكن المتوافق */}
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