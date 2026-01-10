"use client";
import {
    ArrowDownCircle, ArrowUpCircle, Plus,
    X, ArrowUpRight, ArrowDownLeft, Printer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomers } from "@/hooks/customers";
import { useProductForm } from "@/hooks/products";
import { useInvoices } from "@/hooks/invoices";
import InvoicesTable from "@/components/invoices/invoicesTable";
import { AddInvoiceModal } from "@/components/invoices/AddInvoiceModal";
import { ViewInvoiceModal } from "@/components/invoices/ViewInvoiceModal";
import AnalycisInvoices from "@/components/invoices/analycisInvoices";


// --- المكون الرئيسي ---
export default function InvoicesDashboard() {
    const { customers } = useCustomers();
    const { products } = useProductForm(() => { });
    const invoices = useInvoices()
    const {
        activeTab,
        setActiveTab,
        isModalOpen,
        setIsModalOpen,
        isViewOpen,
        setIsViewOpen,
        selectedInvoice,
        totalRevenues,
        totalExpenses,
        netBalance,
    } = invoices;

    return (
        <div className="space-y-8 p-4 md:p-8" dir="rtl">
            {/* بطاقات الملخص */}
            {/* بطاقات الملخص الديناميكية */}
            <AnalycisInvoices netBalance={netBalance} totalRevenues={totalRevenues} totalExpenses={totalExpenses} />
            {/* شريط التحكم */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-full md:w-auto">
                    <button onClick={() => setActiveTab("revenue")} className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "revenue" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500"}`}>
                        <ArrowDownCircle size={18} /> مقبوضات
                    </button>
                    <button onClick={() => setActiveTab("expenses")} className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "expenses" ? "bg-white dark:bg-slate-700 shadow-sm text-red-600" : "text-slate-500"}`}>
                        <ArrowUpCircle size={18} /> مدفوعات
                    </button>
                </div>
                <button onClick={() => setIsModalOpen(true)} className={`w-full md:w-auto px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-white shadow-lg transition-transform active:scale-95 ${activeTab === "revenue" ? "bg-emerald-600 shadow-emerald-500/20" : "bg-red-600 shadow-red-500/20"}`}>
                    <Plus size={20} /> إضافة {activeTab === "revenue" ? "مقبوضات" : "مدفوعات"}
                </button>
            </div>

            {/* الجدول */}
            <InvoicesTable invoices={invoices} />
            {/* الإجرائات */}
            <AddInvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} manager={invoices} type={activeTab} customers={customers} products={products} />
            <ViewInvoiceModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} invoice={selectedInvoice} products={products} />
        </div>
    );
}
