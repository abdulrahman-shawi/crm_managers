"use client";
import {
    ArrowDownCircle, ArrowUpCircle, Plus,
    X,ArrowUpRight, ArrowDownLeft, Printer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomers } from "@/hooks/customers";
import { useProductForm } from "@/hooks/products";
import { useInvoices } from "@/hooks/invoices";
import InvoicesTable from "@/components/invoices/invoicesTable";
import { AddInvoiceModal } from "@/components/invoices/AddInvoiceModal";

// --- الواجهات (Interfaces) ---
interface Invoice {
    id: string;
    party: string;
    category: string;
    amount: string;
    date: string;
    status: string;
    client?: string;
    vendor?: string;
}

// --- المكون الرئيسي ---
export default function InvoicesPage() {
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* صافي الرصيد */}
                <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl">
                    <p className="text-blue-100 text-sm font-medium">صافي الرصيد الحالي</p>
                    <h2 className="text-4xl font-black mt-2 font-sans">
                        ل.س{netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h2>
                </div>

                {/* إجمالي المقبوضات */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">إجمالي المقبوضات</p>
                        <h3 className="text-2xl font-black text-emerald-600 font-sans">
                            ل.س{totalRevenues.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600">
                        <ArrowDownLeft size={30} />
                    </div>
                </div>

                {/* إجمالي المدفوعات */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">إجمالي المدفوعات</p>
                        <h3 className="text-2xl font-black text-red-600 font-sans">
                            ل.س{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600">
                        <ArrowUpRight size={30} />
                    </div>
                </div>
            </div>

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
            <div className="bg-red-400 text-yellow-400">g</div>
            <InvoicesTable invoices={invoices} />

            <AddInvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} manager={invoices} type={activeTab} customers={customers} products={products} />
            <ViewInvoiceModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} invoice={selectedInvoice} products={products} />
        </div>
    );
}



// --- مكون عرض الفاتورة ---
function ViewInvoiceModal({ isOpen, onClose, invoice, products }: any) {
    if (!isOpen || !invoice) return null;

    // حساب القيم المالية بناءً على بياناتك
    const subtotal = Number(invoice.amount) || 0;
    const taxRate = 0.15; // الضريبة 15%
    const taxAmount = subtotal * taxRate;
    const grandTotal = subtotal + taxAmount;

    const getProductName = (productId: any) => {
        const product = products?.find((p: any) => p.id === productId);
        return product ? product.name : `منتج رقم #${productId}`;
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white text-slate-900 w-full max-w-4xl h-[600px] overflow-y-scroll rounded-3xl shadow-2xl overflow-hidden my-8 cursor-default"
                    dir="rtl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* شريط الأدوات العلوي */}
                    <div className="bg-slate-50 p-4 flex justify-between items-center border-b no-print">
                        <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-200">
                            <Printer size={18} /> طباعة الفاتورة
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-red-50 text-slate-600 rounded-full">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-12 bg-white" id="printable-area">
                        {/* الهيدر */}
                        <div className="flex justify-between items-start mb-12 border-b-2 border-slate-100 pb-10">
                            <div>
                                <h1 className="text-4xl font-black text-blue-600 mb-2 italic tracking-tighter">
                                    {invoice.type === "REVENUE" ? "فاتورة مبيعات" : "فاتورة مشتريات"}
                                </h1>
                                <p className="text-slate-500 font-bold">رقم المرجع: <span className="font-mono text-slate-900">#{invoice.id.slice(-8)}</span></p>
                                <p className="text-slate-500 font-bold">التاريخ: <span className="text-slate-900">{invoice.date}</span></p>
                            </div>
                            <div className="text-left">
                                <div className="text-2xl font-black text-slate-900">قطنيات السلطان</div>
                            </div>
                        </div>

                        {/* معلومات العميل */}
                        <div className="mb-12 bg-slate-50 p-8 rounded-[2.5rem] flex justify-between items-center">
                            <div>
                                <h3 className="text-[10px] font-black text-blue-500 uppercase mb-2 tracking-widest">
                                    {invoice.type === "REVENUE" ? "مشتري:" : "مورد:"}
                                </h3>
                                <p className="text-2xl font-black text-slate-800">{invoice.party}</p>
                            </div>
                            <div className={`px-5 py-2 rounded-full text-xs font-black shadow-sm ${invoice.status === 'مدفوعة' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                الحالة: {invoice.status}
                            </div>
                        </div>

                        {/* جدول المنتجات الحقيقي */}
                        <table className="w-full mb-10 text-right">
                            <thead>
                                <tr className="bg-slate-900 text-white">
                                    <th className="px-6 py-4 rounded-r-2xl">المنتج (ID)</th>
                                    <th className="px-6 py-4 text-center">الكمية</th>
                                    <th className="px-6 py-4 text-center">سعر الوحدة</th>
                                    <th className="px-6 py-4 text-left rounded-l-2xl">الإجمالي</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.rawItems && invoice.rawItems.length > 0 ? (
                                    invoice.rawItems.map((item: any, idx: number) => (
                                        <tr key={idx} className="border-b border-slate-100">
                                            <td className="px-6 py-6 font-bold text-slate-700">
                                                {/* هنا نستخدم الدالة لجلب الاسم بدلاً من الرقم */}
                                                {getProductName(item.productId)}
                                            </td>
                                            <td className="px-6 py-6 text-center font-bold">{item.quantity}</td>
                                            <td className="px-6 py-6 text-center text-slate-500">ل.س{item.unitPrice.toLocaleString()}</td>
                                            <td className="px-6 py-6 text-left font-black italic">ل.س{item.subTotal.toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="border-b border-slate-100">
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-bold">لا توجد تفاصيل للمواد</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* ملخص الحسابات */}
                        <div className="flex justify-end">
                            <div className="w-80 space-y-3 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">

                                <div className="flex justify-between text-2xl font-black text-blue-600 pt-3 border-t border-slate-200">
                                    <span>الإجمالي:</span>
                                    <span className="italic font-sans">ل.س{subtotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}