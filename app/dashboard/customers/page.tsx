"use client";
import React from "react";
import {
  Users, Edit3, Trash2, Save, X,
  History, Plus, Phone, MapPin, Mail, Receipt
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomers } from "@/hooks/customers";
import { ToastAdd, ToastDELETE, ToastEdit } from "@/components/system/toast";

export default function CRMPage() {
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
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95 font-bold"
        >
          <Plus size={18} /> إضافة عميل
        </button>
      </div>

      {/* جدول العملاء */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">العميل</th>
                <th className="px-6 py-4">رقم الهاتف</th>
                <th className="px-6 py-4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer group transition-colors"
                    onClick={() => setViewingCustomer(customer)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {customer.name}
                      </div>
                      <div className="text-xs text-slate-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-sm">
                      {customer.phone}
                    </td>
                    <td className="px-6 py-4 text-left flex justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEditModal(customer); }} 
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        title="تعديل"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(customer.id); }} 
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                    لا يوجد عملاء مسجلين حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {/* مودال الإضافة / التعديل */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold dark:text-white">
                  {editingId ? "تحديث بيانات العميل" : "إضافة عميل جديد"}
                </h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-red-500">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 mr-2 uppercase">الاسم بالكامل</label>
                  <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:border-blue-500 transition-all" placeholder="مثال: محمد أحمد" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 mr-2 uppercase">البريد الإلكتروني</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:border-blue-500 transition-all" placeholder="mail@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 mr-2 uppercase">رقم الهاتف</label>
                    <input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:border-blue-500 transition-all" placeholder="05xxxxxxxx" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 mr-2 uppercase">العنوان بالتفصيل</label>
                  <input required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:border-blue-500 transition-all" placeholder="المدينة، الحي، الشارع" />
                </div>

                <button type="submit" className="w-full mt-4 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2">
                  <Save size={20} /> {editingId ? "حفظ التغييرات" : "تأكيد الإضافة"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* مودال تفاصيل الفواتير */}
        {viewingCustomer && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 dark:shadow-none">
                    {viewingCustomer.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold dark:text-white">{viewingCustomer.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Mail size={12}/> {viewingCustomer.email}</p>
                  </div>
                </div>
                <button onClick={() => setViewingCustomer(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <Phone size={18} className="text-blue-500" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">الهاتف</p>
                      <p className="text-sm font-bold dark:text-white">{viewingCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <MapPin size={18} className="text-red-500" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">العنوان</p>
                      <p className="text-sm font-bold dark:text-white truncate">{viewingCustomer.address || "غير محدد"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold flex items-center gap-2 dark:text-white"><History size={18} className="text-blue-600"/> سجل الفواتير</h4>
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-lg font-bold">
                      {viewingCustomer.invoices?.length || 0} عملية
                    </span>
                  </div>

                  <div className="max-h-[250px] overflow-y-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                    <table className="w-full text-right text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-slate-500 font-bold">التاريخ</th>
                          <th className="px-4 py-3 text-slate-500 font-bold">الحالة</th>
                          <th className="px-4 py-3 text-slate-500 font-bold">المبلغ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {viewingCustomer.invoices && viewingCustomer.invoices.length > 0 ? (
                          viewingCustomer.invoices.map((inv: any) => (
                            <tr key={inv.id} className="dark:text-slate-300">
                              <td className="px-4 py-3">{new Date(inv.date).toLocaleDateString("ar-EG")}</td>
                              <td className="px-4 py-3">
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">مكتملة</span>
                              </td>
                              <td className="px-4 py-3 font-bold">{inv.totalAmount.toLocaleString()} ر.س</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="px-4 py-10 text-center text-slate-400 italic">لا توجد فواتير</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                <button onClick={() => setViewingCustomer(null)} className="px-6 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold dark:text-white hover:bg-slate-50 transition-all">إغلاق</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* التنبيهات */}
        {toastType === "add" && <ToastAdd message="تمت الإضافة بنجاح" onClose={() => setToastType(null)} />}
        {toastType === "delete" && <ToastDELETE message="تم الحذف بنجاح" onClose={() => setToastType(null)} />}
        {toastType === "edit" && <ToastEdit message="تم التحديث بنجاح" onClose={() => setToastType(null)} />}
      </AnimatePresence>
    </div>
  );
}