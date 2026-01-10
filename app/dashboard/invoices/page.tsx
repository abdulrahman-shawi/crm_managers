"use client";
import { useState, useEffect, use } from "react";
import {
    ArrowDownCircle, ArrowUpCircle, Plus,
    Trash2, Receipt, Save, X, Download,
    ArrowUpRight, ArrowDownLeft, FileText,
    Eye, User, CheckCircle, Clock, AlertCircle, Printer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomers } from "@/hooks/customers";
import { useProductForm } from "@/hooks/products";
import { useInvoices } from "@/hooks/invoices";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
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
        setSelectedInvoice,
        revenues,
        expenses,
        isLoading,
        totalRevenues,
        totalExpenses,
        netBalance,
        getStatusStyle,
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

// --- مكون مودال إضافة الفاتورة ---
// function AddInvoiceModal({ isOpen, onClose, type, customers, products }: any) {
//     const [client, setClient] = useState("");
//     const [overallDiscount, setOverallDiscount] = useState(0);
//     const [status, setStatus] = useState("مدفوعة");
//     const [items, setItems] = useState([
//         { productId: "", name: "", price: 0, quantity: 1, discount: 0, note: "", total: 0 }
//     ]);
//     const [searchQueries, setSearchQueries] = useState<{ [key: number]: string }>({});
//     const [showDropdown, setShowDropdown] = useState<{ [key: number]: boolean }>({});
//     // 1. أضف حالة (State) لإدارة حالة التحميل (Loading)
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const { user } = useAuth()
//     // 2. دالة إرسال البيانات
//     const handleSubmit = async () => {
//         // التحقق من وجود بيانات
//         if (!client || items.length === 0) {
//             alert("يرجى اختيار عميل وإضافة بند واحد على الأقل");
//             return;
//         }

//         setIsSubmitting(true);

//         // تجهيز الكائن (Object) النهائي للإرسال
//         const invoiceData = {
//             type: type, // 'revenue' أو 'expenses'
//             clientName: client,
//             status: status,
//             uderId: user?.id,
//             items: items.map(item => ({
//                 productId: item.productId,
//                 name: item.name,
//                 quantity: item.quantity,
//                 price: item.price,
//                 discount: item.discount,
//                 total: item.total
//             })),
//             subTotal: subTotal,
//             overallDiscount: overallDiscount,
//             grandTotal: grandTotal,
//             date: new Date().toISOString(),
//         };

//         try {
//             const response = await fetch("/api/dashboard/invoices", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(invoiceData),
//             });

//             if (response.ok) {
//                 axios.post("https://kyzendev.app.n8n.cloud/webhook/e6f93672-158d-437b-84fc-fdda3b2a62b8", invoiceData)
//                     .catch(err => console.error("n8n Webhook Error:", err));
//                 alert("تم حفظ الفاتورة بنجاح!");
//                 onClose(); // إغلاق المودال
//                 // هنا يمكنك تحديث قائمة الفواتير في الصفحة الرئيسية
//             } else {
//                 throw new Error("فشل في حفظ الفاتورة");
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             alert("حدث خطأ أثناء الإرسال");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const addNewItem = () => {
//         setItems([...items, { productId: "", name: "", price: 0, quantity: 1, discount: 0, note: "", total: 0 }]);
//     };

//     const updateItem = (index: number, field: string, value: any) => {
//         const newItems = [...items];
//         const item = newItems[index];

//         if (field === "productId") {
//             const product = products.find((p: any) => p.id === parseInt(value));
//             item.productId = value;
//             item.name = product?.name || "";
//             item.price = product?.price || 0;
//             setSearchQueries({ ...searchQueries, [index]: product?.name || "" });
//             setShowDropdown({ ...showDropdown, [index]: false });
//         } else {
//             (item as any)[field] = value;
//         }

//         item.total = (item.price * item.quantity) - (Number(item.discount) || 0);
//         setItems(newItems);
//     };

//     const subTotal = items.reduce((sum, item) => sum + item.total, 0);
//     const grandTotal = subTotal - (Number(overallDiscount) || 0);

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
//             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800 my-8" dir="rtl">
//                 <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
//                     <h2 className="text-2xl font-black flex items-center gap-3">
//                         <Receipt className={type === 'revenue' ? 'text-emerald-500' : 'text-red-500'} />
//                         إصدار فاتورة جديدة
//                     </h2>
//                     <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X /></button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                     <div className="space-y-2">
//                         <label className="text-sm font-bold text-slate-500 px-1">العميل / المورد</label>
//                         <select value={client} onChange={(e) => setClient(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold">
//                             <option value="">اختر من القائمة...</option>
//                             {customers?.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
//                         </select>
//                     </div>
//                     <div className="space-y-2">
//                         <label className="text-sm font-bold text-slate-500 px-1">حالة الدفع</label>
//                         <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold">
//                             <option value="مدفوعة">مدفوعة</option>
//                             <option value="معلقة">معلقة</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="space-y-4">
//                     {items.map((item, index) => (
//                         <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 items-center">
//                             <div className="md:col-span-3 relative"> {/* تم إضافة relative هنا لضبط القائمة المنسدلة */}
//                                 <label className="text-[10px] font-bold text-slate-400 mb-1">المنتج</label>
//                                 <input
//                                     type="text"
//                                     value={searchQueries[index] || item.name}
//                                     placeholder="اكتب اسم المنتج..."
//                                     onFocus={() => setShowDropdown({ ...showDropdown, [index]: true })}
//                                     onChange={(e) => {
//                                         setSearchQueries({ ...searchQueries, [index]: e.target.value });
//                                         setShowDropdown({ ...showDropdown, [index]: true });
//                                     }}
//                                     className="w-full bg-white dark:bg-slate-900 p-3 rounded-xl border-none outline-none font-bold text-sm shadow-sm"
//                                 />
//                                 <AnimatePresence>
//                                     {showDropdown[index] && (
//                                         <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-[210] w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
//                                             {products?.filter((p: any) => p.name.toLowerCase().includes((searchQueries[index] || "").toLowerCase())).map((product: any) => (
//                                                 <div key={product.id} onClick={() => updateItem(index, "productId", product.id.toString())} className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-sm font-bold border-b border-slate-50 dark:border-slate-700 last:border-0">
//                                                     {product.name} <span className="text-blue-500 mr-2 text-xs">ل.س{product.price}</span>
//                                                 </div>
//                                             ))}
//                                         </motion.div>
//                                     )}
//                                 </AnimatePresence>
//                             </div>
//                             <div className="md:col-span-1">
//                                 <label className="text-[10px] font-bold text-slate-400 mb-1">الكمية</label>
//                                 <input type="number" value={item.quantity} onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)} className="w-full bg-white dark:bg-slate-900 p-3 rounded-xl text-center font-bold outline-none text-sm shadow-sm" />
//                             </div>
//                             <div className="md:col-span-1 text-center">
//                                 <label className="text-[10px] font-bold text-slate-400 mb-1">السعر</label>
//                                 <div className="p-3 text-sm font-bold">ل.س{item.price}</div>
//                             </div>
//                             <div className="md:col-span-1">
//                                 <label className="text-[10px] font-bold text-red-400 mb-1">الخصم</label>
//                                 <input type="number" value={item.discount} onChange={(e) => updateItem(index, "discount", e.target.value)} className="w-full bg-red-50 dark:bg-red-900/10 p-3 rounded-xl text-center font-bold text-red-600 outline-none text-sm border border-red-100 dark:border-red-900/20" />
//                             </div>
//                             <div className="md:col-span-4">
//                                 <label className="text-[10px] font-bold text-slate-400 mb-1">ملاحظات المنتج</label>
//                                 <input type="text" value={item.note} onChange={(e) => updateItem(index, "note", e.target.value)} className="w-full bg-white dark:bg-slate-900 p-3 rounded-xl outline-none text-xs shadow-sm" placeholder="إضافة ملاحظة..." />
//                             </div>
//                             <div className="md:col-span-1 text-center font-black text-blue-600 italic">ل.س{item.total}</div>
//                             <div className="md:col-span-1 flex justify-center">
//                                 <button onClick={() => setItems(items.filter((_, i) => i !== index))} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
//                             </div>
//                         </div>
//                     ))}
//                     <button onClick={addNewItem} className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 font-bold text-xs hover:border-blue-500 hover:text-blue-500 transition-all">+ إضافة بند جديد</button>
//                 </div>

//                 {/* قسم الإجمالي والخصم الكلي */}
//                 <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
//                     <div className="flex gap-6 items-center">
//                         <div className="space-y-1">
//                             <label className="text-[10px] font-bold text-red-500 uppercase px-1">خصم إضافي (كلي)</label>
//                             <div className="relative">
//                                 <input type="number" value={overallDiscount} onChange={(e) => setOverallDiscount(Number(e.target.value))} className="w-32 bg-red-50 dark:bg-red-900/10 p-3 rounded-2xl border border-red-100 dark:border-red-900/20 outline-none font-bold text-red-600 text-center" placeholder="0" />
//                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400">ل.س</span>
//                             </div>
//                         </div>
//                         <div className="bg-blue-50 dark:bg-blue-900/20 px-8 py-4 rounded-3xl">
//                             <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">الإجمالي النهائي</p>
//                             <h3 className="text-3xl font-black font-sans text-blue-600 italic">ل.س{grandTotal.toLocaleString()}</h3>
//                         </div>
//                     </div>
//                     <div className="flex gap-4">
//                         <button
//                             onClick={handleSubmit}
//                             disabled={isSubmitting}
//                             className={`px-12 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
//                         >
//                             {isSubmitting ? (
//                                 <span className="flex items-center gap-2">جاري الحفظ...</span>
//                             ) : (
//                                 <>
//                                     <Save size={20} /> حفظ الفاتورة
//                                 </>
//                             )}
//                         </button>
//                         <button onClick={onClose} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold">إلغاء</button>
//                     </div>
//                 </div>
//             </motion.div>
//         </div>
//     );
// }

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