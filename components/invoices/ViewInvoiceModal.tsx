"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer } from "lucide-react";

export function ViewInvoiceModal({ isOpen, onClose, invoice, products }: any) {
    if (!isOpen || !invoice) return null;

    // حساب القيم المالية بناءً على بياناتك
    const subtotal = Number(invoice.amount) || 0;
    const isReturnDifference = invoice.sourceKind === "RETURN_ENTRY";
    const hasRawItems = !isReturnDifference && invoice.rawItems && invoice.rawItems.length > 0;
    const hasRawReturns = invoice.rawReturns && invoice.rawReturns.length > 0;

    const getProductName = (productId: any) => {
        const product = products?.find((p: any) => p.id === productId);
        return product ? product.name : `منتج رقم #${productId}`;
    };

    const formatCurrency = (value: any) => `ل.س${Number(value || 0).toLocaleString()}`;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white text-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl overflow-hidden my-8 cursor-default"
                    dir="rtl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* شريط الأدوات العلوي */}
                    <div className="bg-slate-50 p-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:items-center border-b no-print">
                        <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-200">
                            <Printer size={18} /> طباعة الفاتورة
                        </button>
                        <button onClick={onClose} className="self-end p-2 hover:bg-red-50 text-slate-600 rounded-full">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-4 sm:p-8 lg:p-12 bg-white" id="printable-area">
                        {/* الهيدر */}
                        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-start mb-8 sm:mb-12 border-b-2 border-slate-100 pb-6 sm:pb-10">
                            <div>
                                <h1 className="text-2xl sm:text-4xl font-black text-blue-600 mb-2 italic tracking-tighter">
                                    {isReturnDifference
                                        ? invoice.type === "REVENUE"
                                            ? "فاتورة مرتجع"
                                            : "فاتورة تبديل"
                                        : invoice.type === "REVENUE"
                                            ? "فاتورة مبيعات"
                                            : invoice.type === "EXPENSE"
                                                ? "فاتورة مشتريات"
                                                : "فاتورة أخرى"}
                                </h1>
                                <p className="text-slate-500 font-bold">رقم المرجع: <span className="font-mono text-slate-900">#{invoice.id.slice(-8)}</span></p>
                                <p className="text-slate-500 font-bold">التاريخ: <span className="text-slate-900">{invoice.date}</span></p>
                            </div>
                            <div className="text-right sm:text-left">
                                <div className="text-2xl font-black text-slate-900">قطنيات السلطان</div>
                            </div>
                        </div>

                        {/* معلومات العميل */}
                        <div className="mb-8 sm:mb-12 bg-slate-50 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                            <div>
                                <h3 className="text-[10px] font-black text-blue-500 uppercase mb-2 tracking-widest">
                                    {invoice.type === "REVENUE" ? "مشتري:" : invoice.type === "EXPENSE" ? "مورد:" : "الطرف:"}
                                </h3>
                                <p className="text-xl sm:text-2xl font-black text-slate-800 break-words">{invoice.party}</p>
                            </div>
                            <div className={`px-5 py-2 rounded-full text-xs font-black shadow-sm self-start sm:self-auto ${invoice.status === 'مدفوعة' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                الحالة: {invoice.status}
                            </div>
                        </div>

                        {/* جدول المنتجات الحقيقي */}
                        <div className="hidden md:block overflow-x-auto mb-10">
                            <table className="w-full min-w-[780px] text-right">
                                <thead>
                                    <tr className="bg-slate-900 text-white">
                                        <th className="px-6 py-4 rounded-r-2xl">{invoice.type === "OTHER" ? "البيان" : "المنتج"}</th>
                                        <th className="px-6 py-4 text-center">الكمية</th>
                                        <th className="px-6 py-4 text-center">سعر الوحدة</th>
                                        <th className="px-6 py-4 text-center">الخصم</th>
                                        <th className="px-6 py-4 text-center">الملاحظات</th>
                                        <th className="px-6 py-4 text-left rounded-l-2xl">الإجمالي</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hasRawItems ? (
                                        invoice.rawItems.map((item: any, idx: number) => (
                                            <tr key={idx} className="border-b border-slate-100 align-top">
                                                <td className="px-6 py-6 font-bold text-slate-700">
                                                    {invoice.type === "OTHER" ? (item.note || "بند أخرى") : getProductName(item.productId)}
                                                </td>
                                                <td className="px-6 py-6 text-center font-bold">{item.quantity}</td>
                                                <td className="px-6 py-6 text-center text-slate-500">{formatCurrency(item.unitPrice)}</td>
                                                <td className="px-6 py-6 text-center font-bold text-red-500">{formatCurrency(item.discount)}</td>
                                                <td className="px-6 py-6 text-center text-slate-500 max-w-[220px] break-words">{item.note || "-"}</td>
                                                <td className="px-6 py-6 text-left font-black italic">{formatCurrency(item.subTotal)}</td>
                                            </tr>
                                        ))
                                    ) : isReturnDifference && hasRawReturns ? (
                                        invoice.rawReturns.map((ret: any) => (
                                            <tr key={ret.id} className="border-b border-slate-100">
                                                <td className="px-6 py-6 font-bold text-slate-700">
                                                    {ret.type === "EXCHANGE"
                                                        ? `${ret.returnedProduct?.name || "-"} -> ${ret.exchangedProduct?.name || "-"}`
                                                        : ret.returnedProduct?.name || "-"}
                                                </td>
                                                <td className="px-6 py-6 text-center font-bold">{ret.quantity}</td>
                                                <td className="px-6 py-6 text-center text-slate-500">{formatCurrency(Math.abs(Number(ret.priceDifference || 0)))}</td>
                                                <td className="px-6 py-6 text-center font-bold text-red-500">-</td>
                                                <td className="px-6 py-6 text-center text-slate-500">{ret.note || "-"}</td>
                                                <td className="px-6 py-6 text-left font-black italic">{formatCurrency(Math.abs(Number(ret.priceDifference || 0)))}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="border-b border-slate-100">
                                            <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-bold">لا توجد تفاصيل للمواد</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden space-y-4 mb-10">
                            {hasRawItems ? (
                                invoice.rawItems.map((item: any, idx: number) => (
                                    <div key={idx} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                                        <div>
                                            <p className="text-[11px] font-black text-slate-400 mb-1">{invoice.type === "OTHER" ? "البيان" : "المنتج"}</p>
                                            <p className="font-black text-slate-800 break-words">{invoice.type === "OTHER" ? (item.note || "بند أخرى") : getProductName(item.productId)}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="rounded-2xl bg-white p-3">
                                                <p className="text-[11px] font-black text-slate-400 mb-1">الكمية</p>
                                                <p className="font-black text-slate-800">{item.quantity}</p>
                                            </div>
                                            <div className="rounded-2xl bg-white p-3">
                                                <p className="text-[11px] font-black text-slate-400 mb-1">سعر الوحدة</p>
                                                <p className="font-black text-slate-800">{formatCurrency(item.unitPrice)}</p>
                                            </div>
                                            <div className="rounded-2xl bg-red-50 p-3 border border-red-100">
                                                <p className="text-[11px] font-black text-red-400 mb-1">الخصم</p>
                                                <p className="font-black text-red-500">{formatCurrency(item.discount)}</p>
                                            </div>
                                            <div className="rounded-2xl bg-blue-50 p-3 border border-blue-100">
                                                <p className="text-[11px] font-black text-blue-500 mb-1">الإجمالي</p>
                                                <p className="font-black text-blue-600">{formatCurrency(item.subTotal)}</p>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl bg-white p-3">
                                            <p className="text-[11px] font-black text-slate-400 mb-1">ملاحظات المنتج</p>
                                            <p className="text-sm font-bold text-slate-700 break-words">{item.note || "لا توجد ملاحظات"}</p>
                                        </div>
                                    </div>
                                ))
                            ) : isReturnDifference && hasRawReturns ? (
                                invoice.rawReturns.map((ret: any) => (
                                    <div key={ret.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                                        <div>
                                            <p className="text-[11px] font-black text-slate-400 mb-1">العنصر</p>
                                            <p className="font-black text-slate-800 break-words">
                                                {ret.type === "EXCHANGE"
                                                    ? `${ret.returnedProduct?.name || "-"} -> ${ret.exchangedProduct?.name || "-"}`
                                                    : ret.returnedProduct?.name || "-"}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="rounded-2xl bg-white p-3">
                                                <p className="text-[11px] font-black text-slate-400 mb-1">الكمية</p>
                                                <p className="font-black text-slate-800">{ret.quantity}</p>
                                            </div>
                                            <div className="rounded-2xl bg-blue-50 p-3 border border-blue-100">
                                                <p className="text-[11px] font-black text-blue-500 mb-1">فرق السعر</p>
                                                <p className="font-black text-blue-600">{formatCurrency(Math.abs(Number(ret.priceDifference || 0)))}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-slate-400 font-bold">لا توجد تفاصيل للمواد</div>
                            )}
                        </div>

                        <div className="mb-10">
                            <h3 className="text-lg font-black text-slate-800 mb-4">المرتجعات المرتبطة بهذه الفاتورة</h3>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full min-w-[640px] text-right border border-slate-100 rounded-2xl overflow-hidden">
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
                                        {hasRawReturns ? (
                                            invoice.rawReturns.map((ret: any) => (
                                                <tr key={ret.id} className="border-t border-slate-100">
                                                    <td className="px-4 py-3 font-bold">{ret.type === "EXCHANGE" ? "تبديل" : "ترجيع"}</td>
                                                    <td className="px-4 py-3">{ret.returnedProduct?.name || "-"}</td>
                                                    <td className="px-4 py-3">{ret.exchangedProduct?.name || "-"}</td>
                                                    <td className="px-4 py-3 font-bold">{ret.quantity}</td>
                                                    <td className="px-4 py-3 font-bold">{formatCurrency(ret.priceDifference)}</td>
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
                            <div className="md:hidden space-y-3">
                                {hasRawReturns ? (
                                    invoice.rawReturns.map((ret: any) => (
                                        <div key={ret.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-sm font-black text-slate-800">{ret.type === "EXCHANGE" ? "تبديل" : "ترجيع"}</span>
                                                <span className="text-sm font-black text-blue-600">{formatCurrency(ret.priceDifference)}</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-700">المنتج المرتجع: {ret.returnedProduct?.name || "-"}</p>
                                            <p className="text-sm font-bold text-slate-700">المنتج البديل: {ret.exchangedProduct?.name || "-"}</p>
                                            <p className="text-sm font-bold text-slate-700">الكمية: {ret.quantity}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-5 text-center text-slate-400">لا توجد مرتجعات مرتبطة</div>
                                )}
                            </div>
                        </div>

                        {/* ملخص الحسابات */}
                        <div className="flex justify-end">
                            <div className="w-full sm:w-80 space-y-3 bg-slate-50 p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100">

                                <div className="flex justify-between text-2xl font-black text-blue-600 pt-3 border-t border-slate-200">
                                    <span>الإجمالي:</span>
                                    <span className="italic font-sans">{formatCurrency(subtotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}