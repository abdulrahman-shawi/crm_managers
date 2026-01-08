"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Receipt, Trash2, Save } from "lucide-react";

export const AddInvoiceModal =({ isOpen, onClose, manager, customers, products, type  }: any) => {
const {
        client, setClient, status, setStatus,
        items, setItems, addNewItem, updateItem,
        overallDiscount, setOverallDiscount,
        subTotal, grandTotal, handleSubmit, isSubmitting,
        searchQueries, showDropdown, setShowDropdown , setSearchQueries
    } = manager;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800 my-8" dir="rtl">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 className="text-2xl font-black flex items-center gap-3">
                        <Receipt className={type === 'revenue' ? 'text-emerald-500' : 'text-red-500'} />
                        إصدار فاتورة جديدة
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 px-1">العميل / المورد</label>
                        <select value={client} onChange={(e) => setClient(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                            <option value="">اختر من القائمة...</option>
                            {customers?.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 px-1">حالة الدفع</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                            <option value="مدفوعة">مدفوعة</option>
                            <option value="معلقة">معلقة</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    {items.map((item : any, index : number) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 items-center">
                            <div className="md:col-span-3 relative"> {/* تم إضافة relative هنا لضبط القائمة المنسدلة */}
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
                                <AnimatePresence>
                                    {showDropdown[index] && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-[210] w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                                            {products?.filter((p: any) => p.name.toLowerCase().includes((searchQueries[index] || "").toLowerCase())).map((product: any) => (
                                                <div key={product.id} onClick={() => updateItem(index, "productId", product.id.toString() , products)} className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-sm font-bold border-b border-slate-50 dark:border-slate-700 last:border-0">
                                                    {product.name} <span className="text-blue-500 mr-2 text-xs">ل.س{product.price}</span>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="md:col-span-1">
                                <label className="text-[10px] font-bold text-slate-400 mb-1">الكمية</label>
                                <input type="number" value={item.quantity} onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0 , products)} className="w-full bg-white dark:bg-slate-900 p-3 rounded-xl text-center font-bold outline-none text-sm shadow-sm" />
                            </div>
                            <div className="md:col-span-1 text-center">
                                <label className="text-[10px] font-bold text-slate-400 mb-1">السعر</label>
                                <div className="p-3 text-sm font-bold">ل.س{item.price}</div>
                            </div>
                            <div className="md:col-span-1">
                                <label className="text-[10px] font-bold text-red-400 mb-1">الخصم</label>
                                <input type="number" value={item.discount} onChange={(e) => updateItem(index, "discount", e.target.value , products)} className="w-full bg-red-50 dark:bg-red-900/10 p-3 rounded-xl text-center font-bold text-red-600 outline-none text-sm border border-red-100 dark:border-red-900/20" />
                            </div>
                            <div className="md:col-span-4">
                                <label className="text-[10px] font-bold text-slate-400 mb-1">ملاحظات المنتج</label>
                                <input type="text" value={item.note} onChange={(e) => updateItem(index, "note", e.target.value , products)} className="w-full bg-white dark:bg-slate-900 p-3 rounded-xl outline-none text-xs shadow-sm" placeholder="إضافة ملاحظة..." />
                            </div>
                            <div className="md:col-span-1 text-center font-black text-blue-600 italic">ل.س{item.total}</div>
                            <div className="md:col-span-1 flex justify-center">
                                <button onClick={() => setItems(items.filter((_ : any, i : number) => i !== index))} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                    <button onClick={addNewItem} className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 font-bold text-xs hover:border-blue-500 hover:text-blue-500 transition-all">+ إضافة بند جديد</button>
                </div>

                {/* قسم الإجمالي والخصم الكلي */}
                <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-6 items-center">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-red-500 uppercase px-1">خصم إضافي (كلي)</label>
                            <div className="relative">
                                <input type="number" value={overallDiscount} onChange={(e) => setOverallDiscount(Number(e.target.value))} className="w-32 bg-red-50 dark:bg-red-900/10 p-3 rounded-2xl border border-red-100 dark:border-red-900/20 outline-none font-bold text-red-600 text-center" placeholder="0" />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400">ل.س</span>
                            </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 px-8 py-4 rounded-3xl">
                            <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">الإجمالي النهائي</p>
                            <h3 className="text-3xl font-black font-sans text-blue-600 italic">ل.س{grandTotal.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`px-12 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">جاري الحفظ...</span>
                            ) : (
                                <>
                                    <Save size={20} /> حفظ الفاتورة
                                </>
                            )}
                        </button>
                        <button onClick={onClose} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold">إلغاء</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}