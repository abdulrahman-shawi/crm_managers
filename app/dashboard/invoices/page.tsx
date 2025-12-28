"use client";
import { useState, useEffect } from "react";
import {
    ArrowDownCircle, ArrowUpCircle, Plus,
    Trash2, Receipt, Save, X, Download,
    ArrowUpRight, ArrowDownLeft, FileText,
    Eye, User, CheckCircle, Clock, AlertCircle, Printer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- بيانات تجريبية ---
const availableProducts = [
    { id: 1, name: "iPhone 15 Pro", price: 1200 },
    { id: 2, name: "MacBook Air", price: 2000 },
    { id: 3, name: "AirPods Pro", price: 250 },
    { id: 4, name: "شاشة سامسونج 4K", price: 450 },
];

const availableClients = [
    { id: 1, name: "أحمد علي", email: "ahmed@mail.com" },
    { id: 2, name: "سارة محمد", email: "sara@mail.com" },
    { id: 3, name: "شركة الأمل", email: "info@hope.com" },
];

export default function InvoicesPage() {
    const [activeTab, setActiveTab] = useState("revenue");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // بيانات افتراضية للجدول
    const [revenues] = useState([
        { id: "REC-001", party: "أحمد علي", category: "بيع منتج", amount: "1,200", date: "2024-03-20", status: "مدفوعة" },
        { id: "REC-002", party: "سارة محمد", category: "استشارة فنية", amount: "850", date: "2024-03-22", status: "معلقة" },
    ]);
    const [expenses] = useState([
        { id: "EXP-001", party: "شركة الاتصالات", category: "فواتير", amount: "150", date: "2024-03-19", status: "مدفوعة" },
    ]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "مدفوعة": return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20";
            case "معلقة": return "bg-amber-50 text-amber-600 dark:bg-amber-900/20";
            default: return "bg-slate-50 text-slate-600 dark:bg-slate-800";
        }
    };

    return (
        <div className="space-y-8 p-4 md:p-8" dir="rtl">
            {/* 1. بطاقات الملخص المالي */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl">
                    <p className="text-blue-100 text-sm font-medium">صافي الرصيد الحالي</p>
                    <h2 className="text-4xl font-black mt-2 font-sans">€42,850.00</h2>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">إجمالي المقبوضات</p>
                        <h3 className="text-2xl font-black text-emerald-600 font-sans">€55,400</h3>
                    </div>
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600">
                        <ArrowDownLeft size={30} />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">إجمالي المدفوعات</p>
                        <h3 className="text-2xl font-black text-red-600 font-sans">€12,550</h3>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600">
                        <ArrowUpRight size={30} />
                    </div>
                </div>
            </div>

            {/* 2. شريط التحكم والتبديل */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab("revenue")}
                        className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "revenue" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500"}`}
                    >
                        <ArrowDownCircle size={18} /> مقبوضات
                    </button>
                    <button
                        onClick={() => setActiveTab("expenses")}
                        className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "expenses" ? "bg-white dark:bg-slate-700 shadow-sm text-red-600" : "text-slate-500"}`}
                    >
                        <ArrowUpCircle size={18} /> مدفوعات
                    </button>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className={`w-full md:w-auto px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-white shadow-lg transition-transform active:scale-95 ${activeTab === "revenue" ? "bg-emerald-600 shadow-emerald-500/20" : "bg-red-600 shadow-red-500/20"}`}
                >
                    <Plus size={20} /> إضافة {activeTab === "revenue" ? "مقبوضات" : "مدفوعات"}
                </button>
            </div>

            {/* 3. جدول البيانات */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-right">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="px-8 py-5">الرقم المرجعي</th>
                            <th className="px-8 py-5">{activeTab === "revenue" ? "العميل" : "المورد"}</th>
                            <th className="px-8 py-5">الحالة</th>
                            <th className="px-8 py-5">المبلغ الكلي</th>
                            <th className="px-8 py-5 text-left">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(activeTab === "revenue" ? revenues : expenses).map((item) => (
                            <tr key={item.id} className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-8 py-5 font-mono text-sm font-bold text-blue-600">{item.id}</td>
                                <td className="px-8 py-5 font-bold">{item.party}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${getStatusStyle(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className={`px-8 py-5 font-black font-sans ${activeTab === "revenue" ? "text-emerald-600" : "text-red-600"}`}>
                                    €{item.amount}
                                </td>
                                <td className="px-8 py-5 text-left">
                                    <button
                                        onClick={() => {
                                            setSelectedInvoice(item as any);
                                            setIsViewOpen(true);
                                        }}
                                        className="p-2 text-slate-400 hover:text-blue-600 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl"
                                    >
                                        <Eye size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* استدعاء المودالات */}
            <AddInvoiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={activeTab}
            />

            <ViewInvoiceModal
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                invoice={selectedInvoice}
            />
        </div>
    );
}

// --- مكون مودال إضافة الفاتورة المطور ---
function AddInvoiceModal({ isOpen, onClose, type }: any) {
    const [client, setClient] = useState("");
    const [status, setStatus] = useState("مدفوعة");
    const [items, setItems] = useState([
        { productId: "", name: "", price: 0, quantity: 1, discount: 0, note: "", total: 0 }
    ]);

    const [searchQueries, setSearchQueries] = useState<{ [key: number]: string }>({});
    const [showDropdown, setShowDropdown] = useState<{ [key: number]: boolean }>({});
    const addNewItem = () => {
        setItems([...items, { productId: "", name: "", price: 0, quantity: 1, discount: 0, note: "", total: 0 }]);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        const item = newItems[index];

        if (field === "productId") {
            const product = availableProducts.find(p => p.id === parseInt(value));
            item.productId = value;
            item.name = product?.name || "";
            item.price = product?.price || 0;
            setSearchQueries({ ...searchQueries, [index]: product?.name || "" });
            setShowDropdown({ ...showDropdown, [index]: false });
        } else {
            (item as any)[field] = value;
        }

        // الحساب: (السعر * الكمية) - الخصم
        item.total = (item.price * item.quantity) - (Number(item.discount) || 0);
        setItems(newItems);
    };

    const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800 my-8"
                dir="rtl"
            >
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 className="text-2xl font-black flex items-center gap-3">
                        <Receipt className={type === 'revenue' ? 'text-emerald-500' : 'text-red-500'} />
                        إصدار فاتورة جديدة
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X /></button>
                </div>

                {/* معلومات أساسية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 px-1">العميل / المورد</label>
                        <select 
                            value={client} 
                            onChange={(e) => setClient(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                        >
                            <option value="">اختر من القائمة...</option>
                            {availableClients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 px-1">حالة الدفع</label>
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                        >
                            <option value="مدفوعة">مدفوعة</option>
                            <option value="معلقة">معلقة</option>
                        </select>
                    </div>
                </div>

                {/* بنود الفاتورة */}
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 items-center">
                            <div className="md:col-span-3">
                                <label className="text-[10px] font-bold text-slate-400 mb-1">المنتج</label>
                                <input
                                    type="text"
                                    value={searchQueries[index] || item.name}
                                    placeholder="اكتب اسم المنتج..."
                                    onFocus={() => setShowDropdown({ ...showDropdown, [index]: true })}
                                    onChange={(e) => {
                                        setSearchQueries({ ...searchQueries, [index]: e.target.value });
                                        setShowDropdown({ ...showDropdown, [index]: true });
                                    }}
                                    className="w-full bg-white dark:bg-slate-900 p-3 rounded-xl border-none outline-none font-bold text-sm shadow-sm"
                                />
                                
                                {/* قائمة البحث المنسدلة */}
                                <AnimatePresence>
                                    {showDropdown[index] && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute z-[210] w-[350px] mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto"
                                        >
                                            {availableProducts
                                                .filter(p => p.name.toLowerCase().includes((searchQueries[index] || "").toLowerCase()))
                                                .map(product => (
                                                    <div
                                                        key={product.id}
                                                        onClick={() => updateItem(index, "productId", product.id.toString())}
                                                        className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-sm font-bold border-b border-slate-50 dark:border-slate-700 last:border-0"
                                                    >
                                                        {product.name} <span className="text-blue-500 mr-2 text-xs">€{product.price}</span>
                                                    </div>
                                                ))}
                                            {availableProducts.filter(p => p.name.toLowerCase().includes((searchQueries[index] || "").toLowerCase())).length === 0 && (
                                                <div className="p-4 text-xs text-slate-400 text-center">لا توجد نتائج</div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="md:col-span-1">
                                <label className="text-[10px] font-bold text-slate-400 mb-1">الكمية</label>
                                <input
                                    type="number" value={item.quantity}
                                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                                    className="w-full bg-white dark:bg-slate-900 p-3 rounded-xl text-center font-bold outline-none text-sm shadow-sm"
                                />
                            </div>
                            <div className="md:col-span-1 text-center">
                                <label className="text-[10px] font-bold text-slate-400 mb-1">السعر</label>
                                <div className="p-3 text-sm font-bold">€{item.price}</div>
                            </div>
                            <div className="md:col-span-1">
                                <label className="text-[10px] font-bold text-red-400 mb-1">الخصم</label>
                                <input
                                    type="number" value={item.discount}
                                    onChange={(e) => updateItem(index, "discount", e.target.value)}
                                    className="w-full bg-red-50 dark:bg-red-900/10 p-3 rounded-xl text-center font-bold text-red-600 outline-none text-sm border border-red-100 dark:border-red-900/20"
                                />
                            </div>
                            <div className="md:col-span-4">
                                <label className="text-[10px] font-bold text-slate-400 mb-1">ملاحظات المنتج</label>
                                <input
                                    type="text" value={item.note}
                                    onChange={(e) => updateItem(index, "note", e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 p-3 rounded-xl outline-none text-xs shadow-sm"
                                    placeholder="إضافة ملاحظة..."
                                />
                            </div>
                            <div className="md:col-span-1 text-center font-black text-blue-600 italic">€{item.total}</div>
                            <div className="md:col-span-1 flex justify-center">
                                <button onClick={() => setItems(items.filter((_, i) => i !== index))} className="text-red-400 hover:text-red-600">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <button onClick={addNewItem} className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 font-bold text-xs hover:border-blue-500 hover:text-blue-500 transition-all">
                        + إضافة بند جديد
                    </button>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 px-8 py-4 rounded-3xl">
                        <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">الإجمالي الكلي</p>
                        <h3 className="text-3xl font-black font-sans text-blue-600 italic">€{grandTotal.toLocaleString()}</h3>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2">
                            <Save size={20} /> حفظ الفاتورة
                        </button>
                        <button onClick={onClose} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold">إلغاء</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// --- مكون عرض الفاتورة ---
function ViewInvoiceModal({ isOpen, onClose, invoice }: any) {
    if (!isOpen || !invoice) return null;

    const subtotal = parseFloat(invoice.amount.replace(/,/g, ''));
    const taxAmount = subtotal * 0.15;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white text-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-8 cursor-default"
                    dir="rtl"
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                >
                    <div className="bg-slate-50 p-4 flex justify-between items-center border-b no-print">
                        <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-200">
                            <Printer size={18} /> طباعة الفاتورة
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-red-50 text-slate-600 rounded-full"><X size={24} /></button>
                    </div>

                    <div className="p-12 h-[550px] overflow-y-auto bg-white" id="printable-area">
                        <div className="flex justify-between items-start mb-12 border-b-2 border-slate-100 pb-10">
                            <div>
                                <h1 className="text-4xl font-black text-blue-600 mb-2 italic tracking-tighter">INVOICE</h1>
                                <p className="text-slate-500 font-bold">رقم: <span className="font-mono text-slate-900">#{invoice.id}</span></p>
                                <p className="text-slate-500 font-bold">التاريخ: <span className="text-slate-900">{invoice.date}</span></p>
                            </div>
                            <div className="text-left">
                                <div className="text-2xl font-black text-slate-900">اسم شركتك</div>
                                <p className="text-xs text-slate-400 mt-1">الرقم الضريبي: 310022334455</p>
                            </div>
                        </div>

                        <div className="mb-12 bg-slate-50 p-8 rounded-[2.5rem] flex justify-between items-center">
                            <div>
                                <h3 className="text-[10px] font-black text-blue-500 uppercase mb-2 tracking-widest">إلى العميل:</h3>
                                <p className="text-2xl font-black text-slate-800">{invoice.client || invoice.vendor}</p>
                            </div>
                            <div className={`px-5 py-2 rounded-full text-xs font-black shadow-sm ${invoice.status === 'مدفوعة' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                الحالة: {invoice.status}
                            </div>
                        </div>

                        <table className="w-full mb-10 text-right">
                            <thead>
                                <tr className="bg-slate-900 text-white">
                                    <th className="px-6 py-4 rounded-r-2xl">الوصف</th>
                                    <th className="px-6 py-4 text-center">الكمية</th>
                                    <th className="px-6 py-4 text-left rounded-l-2xl tracking-tighter">الإجمالي</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-100">
                                    <td className="px-6 py-8">
                                        <p className="font-black text-lg">{invoice.category}</p>
                                        <p className="text-xs text-slate-400 italic">ملاحظة: هذه فاتورة تجريبية للنظام</p>
                                    </td>
                                    <td className="px-6 py-8 text-center font-bold">1</td>
                                    <td className="px-6 py-8 text-left font-black text-xl italic font-sans">€{invoice.amount}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="flex justify-end">
                            <div className="w-72 space-y-3 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                                <div className="flex justify-between text-slate-500 font-bold"><span>المجموع:</span><span>€{invoice.amount}</span></div>
                                <div className="flex justify-between text-slate-500 font-bold"><span>الضريبة (15%):</span><span>€{taxAmount.toLocaleString()}</span></div>
                                <div className="flex justify-between text-2xl font-black text-blue-600 pt-3 border-t border-slate-200"><span>الإجمالي:</span><span className="italic font-sans">€{(subtotal + taxAmount).toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}