"use client";
import React, { useState } from "react";
import { 
  Users, UserPlus, Search, Mail, Trash2, Edit3, Save, X, 
  TrendingUp, Receipt, Wallet, ArrowLeft, Clock, History, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


export default function CRMPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [customers, setCustomers] = useState([
    { 
      id: 1, 
      name: "أحمد محمد", 
      email: "ahmed@mail.com", 
      sales: 2500, 
      expenses: 400, 
      status: "نشط",
      activities: [
        { id: 1, type: "create", text: "تم إنشاء ملف العميل", date: "2023-12-01 10:30" },
        { id: 2, type: "update", text: "تعديل المبيعات المتوقعة", date: "2023-12-05 14:20" }
      ]
    },
    { 
      id: 2, 
      name: "شركة الأمل", 
      email: "info@hope.com", 
      sales: 12400, 
      expenses: 1500, 
      status: "نشط",
      activities: [
        { id: 1, type: "create", text: "تم إنشاء ملف الشركة", date: "2023-11-15 09:00" }
      ]
    },
  ]);

  const [formData, setFormData] = useState({ name: "", email: "", sales: "", expenses: "" });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toLocaleString('ar-EG', { hour12: true });
    const data = { ...formData, sales: Number(formData.sales), expenses: Number(formData.expenses) };
    
    if (editingId) {
      setCustomers(customers.map(c => {
        if (c.id === editingId) {
          return { 
            ...c, 
            ...data, 
            activities: [...c.activities, { id: Date.now(), type: "update", text: "تعديل البيانات المالية", date: now }] 
          };
        }
        return c;
      }));
    } else {
      setCustomers([...customers, { 
        id: Date.now(), 
        ...data, 
        status: "نشط", 
        activities: [{ id: Date.now(), type: "create", text: "تم إنشاء العميل يدوياً", date: now }] 
      }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", email: "", sales: "", expenses: "" });
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* الرأس */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white font-sans">
          <Users className="text-blue-600" /> إدارة العملاء
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 font-bold"
        >
          <Plus size={18} /> إضافة عميل جديد
        </button>
      </div>

      {/* جدول العملاء */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">العميل</th>
                <th className="px-6 py-4">صافي الربح</th>
                <th className="px-6 py-4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                  <td className="px-6 py-4" onClick={() => setViewingCustomer(customer)}>
                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{customer.name}</div>
                    <div className="text-xs text-slate-500">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 font-black text-blue-600">€{(customer.sales - customer.expenses).toLocaleString()}</td>
                  <td className="px-6 py-4 text-left flex justify-end gap-2">
                    <button onClick={() => setViewingCustomer(customer)} className="p-2 text-slate-400 hover:text-blue-600"><Edit3 size={18} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setCustomers(customers.filter(c => c.id !== customer.id)); }} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- نافذة عرض التفاصيل (Drawer) مع سجل النشاطات --- */}
      <AnimatePresence>
        {viewingCustomer && (
          <div className="fixed inset-0 z-[120] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingCustomer(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative w-full max-w-md bg-white dark:bg-[#0f172a] h-full shadow-2xl border-r border-slate-200 dark:border-slate-800 p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-10">
                <button onClick={() => setViewingCustomer(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><ArrowLeft className="dark:text-white" /></button>
                <h3 className="text-xl font-bold dark:text-white">ملف العميل</h3>
              </div>

              {/* الملخص المالي العلوي */}
              <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-500/20 mb-10 text-center">
                <div className="text-sm opacity-80 mb-1">صافي الأرباح الكلية</div>
                <div className="text-4xl font-black italic">€{(viewingCustomer.sales - viewingCustomer.expenses).toLocaleString()}</div>
              </div>

              {/* سجل النشاطات (Activity History) */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg mb-4">
                  <History size={20} className="text-blue-500" /> سجل النشاطات
                </div>

                <div className="relative border-r-2 border-slate-100 dark:border-slate-800 pr-6 mr-2 space-y-8">
                  {viewingCustomer.activities.map((activity: any, index: number) => (
                    <div key={activity.id} className="relative">
                      {/* النقطة على الخط */}
                      <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-500 z-10" />
                      
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {activity.text}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                          <Clock size={12} /> {activity.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {viewingCustomer.activities.length === 0 && (
                  <p className="text-center text-slate-500 text-sm italic">لا توجد نشاطات مسجلة بعد</p>
                )}
              </div>

              <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => { setEditingId(viewingCustomer.id); setFormData({name: viewingCustomer.name, email: viewingCustomer.email, sales: viewingCustomer.sales.toString(), expenses: viewingCustomer.expenses.toString()}); setIsModalOpen(true); setViewingCustomer(null); }}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Edit3 size={18} /> تعديل بيانات العميل
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* مودال الإضافة والتعديل */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold dark:text-white">{editingId ? "تحديث العميل" : "عميل جديد"}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 mr-1 italic">المعلومات الأساسية</label>
                   <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="الاسم الكامل" />
                </div>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="البريد الإلكتروني" />
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-500 mr-1 uppercase">المبيعات (€)</label>
                    <input required type="number" value={formData.sales} onChange={(e) => setFormData({...formData, sales: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-emerald-600 font-black outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0.00" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-red-500 mr-1 uppercase">المصروفات (€)</label>
                    <input required type="number" value={formData.expenses} onChange={(e) => setFormData({...formData, expenses: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-red-500 font-black outline-none focus:ring-2 focus:ring-red-500" placeholder="0.00" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                  <Save size={20} /> حفظ العميل وتحديث السجل
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}