"use client";
import React from "react";
import {
  Users, Save, X,
  History, Plus, Phone, MapPin, Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomers } from "@/hooks/customers";
import { ToastAdd, ToastDELETE, ToastEdit } from "@/components/system/toast";
import CustomerTable from "@/components/customers/customerTable";
import AddCustomers from "@/components/customers/addcustomers";
import ViewCustomerInvoices from "@/components/customers/viewCustomerInvoices";

export default function CustomerDashboard() {
  const customerdata = useCustomers()
  const {
    isModalOpen, setIsModalOpen,
    viewingCustomer,
    toastType, setToastType
  } = customerdata;

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
          <CustomerTable customerdata={customerdata} />
        </div>
      </div>

      <AnimatePresence>
        {/* مودال الإضافة / التعديل */}
        {isModalOpen && (
          <AddCustomers customerdata={customerdata} />
        )}

        {/* مودال تفاصيل الفواتير */}
        {viewingCustomer && (
          <ViewCustomerInvoices customerdata={customerdata} />
        )}

        {/* التنبيهات */}
        {toastType === "add" && <ToastAdd message="تمت الإضافة بنجاح" onClose={() => setToastType(null)} />}
        {toastType === "delete" && <ToastDELETE message="تم الحذف بنجاح" onClose={() => setToastType(null)} />}
        {toastType === "edit" && <ToastEdit message="تم التحديث بنجاح" onClose={() => setToastType(null)} />}
      </AnimatePresence>
    </div>
  );
}