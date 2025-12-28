"use client";
import React from "react";
import {
  Users, Edit3, Trash2, Save, X,
  ArrowLeft, Clock, History, Plus, Phone, MapPin, Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomers } from "@/hooks/customers";
import { ToastAdd, ToastDELETE, ToastEdit } from "@/components/system/toast";

export default function CRMPage() {
  // استخراج الدوال الناقصة من الهوك
  const {
    customers, isModalOpen, setIsModalOpen,
    viewingCustomer, setViewingCustomer,
    editingId, formData, setFormData,
    openEditModal, closeModal,
    handleSave, handleDelete,
    toastType, setToastType
  } = useCustomers();

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* الرأس */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          <Users className="text-blue-600" /> إدارة العملاء
        </h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95 font-bold">
          <Plus size={18} /> إضافة عميل
        </button>
      </div>

      {/* الجدول */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-bold uppercase">
            <tr>
              <th className="px-6 py-4">العميل</th>
              <th className="px-6 py-4">رقم الهاتف</th>
              <th className="px-6 py-4 text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer group transition-colors">
                <td className="px-6 py-4" onClick={() => setViewingCustomer(customer)}>
                  <div className="font-bold text-slate-900 dark:text-white">{customer.name}</div>
                  <div className="text-xs text-slate-500">{customer.email}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-sm">{customer.phone}</td>
                <td className="px-6 py-4 text-left flex justify-end gap-2">
                  <button onClick={() => openEditModal(customer)} className="p-2 text-slate-400 hover:text-blue-600"><Edit3 size={18} /></button>
                  {/* ربط دالة الحذف هنا */}
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(customer.id); }} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال الإضافة / التعديل */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold dark:text-white">{editingId ? "تحديث البيانات" : "إضافة عميل جديد"}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
              </div>
              {/* ربط دالة الحفظ هنا */}
              <form onSubmit={handleSave} className="space-y-4">
                <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white" placeholder="اسم العميل" />
                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white" placeholder="البريد الإلكتروني" />
                <input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white" placeholder="رقم الهاتف" />
                <input required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white" placeholder="العنوان بالتفصيل" />

                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2">
                  <Save size={20} /> {editingId ? "حفظ التغييرات" : "إضافة العميل"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
        {toastType === "add" && <ToastAdd message="تمت الإضافة" onClose={() => setToastType(null)} />}
        {toastType === "delete" && <ToastDELETE message="تم الحذف" onClose={() => setToastType(null)} />}
        {toastType === "edit" && <ToastEdit message="تم التحديث" onClose={() => setToastType(null)} />}

      </AnimatePresence>

      {/* نافذة التفاصيل (تأكد من بقاء الكود الخاص بها كما هو) */}
    </div>


  );
}