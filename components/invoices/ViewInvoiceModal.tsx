"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer } from "lucide-react";

export function ViewInvoiceModal({ isOpen, onClose, invoice, products }: any) {
    if (!isOpen || !invoice) return null;

    // حساب القيم المالية بناءً على بياناتك
    const subtotal = Number(invoice.amount) || 0;
    const isReturnDifference = invoice.sourceKind === "RETURN_DIFFERENCE";

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
                                    {isReturnDifference
                                        ? invoice.type === "REVENUE"
                                            ? "قيد مقبوضات من فرق مرتجع"
                                            : "قيد مدفوعات من فرق مرتجع"
                                        : invoice.type === "REVENUE"
                                            ? "فاتورة مبيعات"
                                            : "فاتورة مشتريات"}
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
                                {!isReturnDifference && invoice.rawItems && invoice.rawItems.length > 0 ? (
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
                                ) : isReturnDifference && invoice.rawReturns && invoice.rawReturns.length > 0 ? (
                                    invoice.rawReturns.map((ret: any) => (
                                        <tr key={ret.id} className="border-b border-slate-100">
                                            <td className="px-6 py-6 font-bold text-slate-700">
                                                {ret.type === "EXCHANGE"
                                                    ? `${ret.returnedProduct?.name || "-"} -> ${ret.exchangedProduct?.name || "-"}`
                                                    : ret.returnedProduct?.name || "-"}
                                            </td>
                                            <td className="px-6 py-6 text-center font-bold">{ret.quantity}</td>
                                            <td className="px-6 py-6 text-center text-slate-500">ل.س{Math.abs(Number(ret.priceDifference || 0)).toLocaleString()}</td>
                                            <td className="px-6 py-6 text-left font-black italic">ل.س{Math.abs(Number(ret.priceDifference || 0)).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="border-b border-slate-100">
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-bold">لا توجد تفاصيل للمواد</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="mb-10">
                            <h3 className="text-lg font-black text-slate-800 mb-4">المرتجعات المرتبطة بهذه الفاتورة</h3>
                            <table className="w-full text-right border border-slate-100 rounded-2xl overflow-hidden">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-700">
                                        <th className="px-4 py-3">النوع</th>
                                        <th className="px-4 py-3">المنتج المرتجع</th>
                                        <th className="px-4 py-3">المنتج البديل</th>
                                        <th className="px-4 py-3">الكمية</th>
                                        <th className="px-4 py-3">فرق السعر</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.rawReturns && invoice.rawReturns.length > 0 ? (
                                        invoice.rawReturns.map((ret: any) => (
                                            <tr key={ret.id} className="border-t border-slate-100">
                                                <td className="px-4 py-3 font-bold">{ret.type === "EXCHANGE" ? "تبديل" : "ترجيع"}</td>
                                                <td className="px-4 py-3">{ret.returnedProduct?.name || "-"}</td>
                                                <td className="px-4 py-3">{ret.exchangedProduct?.name || "-"}</td>
                                                <td className="px-4 py-3 font-bold">{ret.quantity}</td>
                                                <td className="px-4 py-3 font-bold">ل.س{Number(ret.priceDifference || 0).toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-4 text-center text-slate-400">لا توجد مرتجعات مرتبطة</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

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