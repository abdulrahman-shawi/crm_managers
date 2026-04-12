"use client";
import {
    ArrowDownCircle, ArrowUpCircle, Plus
} from "lucide-react";
import { useCustomers } from "@/hooks/customers";
import { useProductForm } from "@/hooks/products";
import { useInvoices } from "@/hooks/invoices";
import type { InvoiceDateFilter } from "@/hooks/invoices";
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
        openingBalance,
        totalRevenues,
        totalExpenses,
        netBalance,
        productProfitAnalysis,
        monthlySalesTotal,
        monthlyWholesaleTotal,
        monthlyNetProfit,
        dateFilter,
        customFrom,
        customTo,
        setDateFilter,
        setCustomFrom,
        setCustomTo,
    } = invoices;

    return (
        <div className="space-y-8 p-4 md:p-8" dir="rtl">
            {/* بطاقات الملخص */}
            {/* بطاقات الملخص الديناميكية */}
            <AnalycisInvoices
                openingBalance={openingBalance}
                netBalance={netBalance}
                totalRevenues={totalRevenues}
                totalExpenses={totalExpenses}
                monthlyNetProfit={monthlyNetProfit}
            />
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
                <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value as InvoiceDateFilter)}
                        className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold"
                    >
                        <option value="this_month">هذا الشهر</option>
                        <option value="last_month">الشهر الماضي</option>
                        <option value="last_7_days">آخر 7 أيام</option>
                        <option value="today">اليوم</option>
                        <option value="custom">مخصص</option>
                    </select>

                    {dateFilter === "custom" && (
                        <>
                            <input
                                type="date"
                                value={customFrom}
                                onChange={(e) => setCustomFrom(e.target.value)}
                                className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold"
                            />
                            <input
                                type="date"
                                value={customTo}
                                onChange={(e) => setCustomTo(e.target.value)}
                                className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold"
                            />
                        </>
                    )}

                    <button onClick={() => setIsModalOpen(true)} className={`w-full md:w-auto px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-white shadow-lg transition-transform active:scale-95 ${activeTab === "revenue" ? "bg-emerald-600 shadow-emerald-500/20" : "bg-red-600 shadow-red-500/20"}`}>
                        <Plus size={20} /> إضافة {activeTab === "revenue" ? "مقبوضات" : "مدفوعات"}
                    </button>
                </div>
            </div>

            {/* الجدول */}
            <InvoicesTable invoices={invoices} />

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">تحليل ربح المبيعات لكل منتج</h3>
                    <p className="text-slate-500 text-sm mt-1">يتم احتساب صافي الربح = سعر البيع - سعر الجملة حسب البنود المباعة ضمن الفلتر الحالي.</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
                        <span className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700">إجمالي البيع: ل.س{monthlySalesTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <span className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700">إجمالي الجملة: ل.س{monthlyWholesaleTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <span className={`px-4 py-2 rounded-xl ${monthlyNetProfit >= 0 ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700" : "bg-red-50 dark:bg-red-900/20 text-red-700"}`}>
                            صافي الربح: ل.س{monthlyNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-8 py-4">المنتج</th>
                                <th className="px-8 py-4">الموديل</th>
                                <th className="px-8 py-4">الكمية المباعة</th>
                                <th className="px-8 py-4">إجمالي الجملة</th>
                                <th className="px-8 py-4">إجمالي البيع</th>
                                <th className="px-8 py-4">صافي الربح</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productProfitAnalysis.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-slate-400">لا توجد مبيعات ضمن الفلتر الحالي</td>
                                </tr>
                            ) : (
                                productProfitAnalysis.map((row) => (
                                    <tr key={row.productId} className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-8 py-4 font-bold text-slate-800 dark:text-slate-100">{row.productName}</td>
                                        <td className="px-8 py-4 text-slate-500 font-mono">{row.modelNumber}</td>
                                        <td className="px-8 py-4 font-black">{row.soldQuantity}</td>
                                        <td className="px-8 py-4 font-black text-amber-700">ل.س{row.wholesaleTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td className="px-8 py-4 font-black text-emerald-700">ل.س{row.salesTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td className={`px-8 py-4 font-black ${row.netProfit >= 0 ? "text-blue-700" : "text-red-600"}`}>
                                            ل.س{row.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* الإجرائات */}
            <AddInvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} manager={invoices} type={activeTab} customers={customers} products={products} />
            <ViewInvoiceModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} invoice={selectedInvoice} products={products} />
        </div>
    );
}
