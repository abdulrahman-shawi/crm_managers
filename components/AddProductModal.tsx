"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Tag, Euro, Database, Image as ImageIcon, CheckCircle2, Loader2, Hash, Activity } from "lucide-react";
import axios from "axios";
import { useProductForm } from "@/hooks/products";

export const AddProductModal = ({ isOpen, onClose, oncloseLow , categories, productForm , islow }: any) => {

    const {
        formData, setFormData, fileInputRef, selectedImage,
        loading, handleFileChange, handleSubmit, isEditing , productslow
    } = productForm;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-200 dark:border-slate-800" dir="rtl">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <div className="p-2 bg-blue-600 rounded-lg text-white"><Package size={22} /></div>
                                    {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* منطقة رفع الصورة */}
                                <div className="md:col-span-2">
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                    <div onClick={() => fileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${selectedImage ? "border-blue-500 bg-blue-50/50" : "border-slate-200 dark:border-slate-800"}`}>
                                        {selectedImage ? (
                                            <img src={selectedImage} alt="Preview" className="h-32 object-contain" />
                                        ) : (
                                            <><ImageIcon size={40} className="text-slate-400 mb-2" /><p className="text-sm text-slate-500">اضغط لرفع صورة المنتج</p></>
                                        )}
                                    </div>
                                </div>

                                {/* اسم المنتج */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">اسم المنتج</label>
                                    <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="مثال: آيفون 15" />
                                </div>

                                {/* رقم الموديل (الجديد) */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">رقم الموديل (Model Number)</label>
                                    <div className="relative">
                                        <Hash className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input required type="text" value={formData.modelNumber} onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })} className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="A2846" />
                                    </div>
                                </div>

                                {/* القسم */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">القسم</label>
                                    <select required value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                        <option value="">اختر قسماً...</option>
                                        {categories?.map((cat: any) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* حالة المنتج (الجديد) */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">حالة التوفر</label>
                                    <div className="relative">
                                        <Activity className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <select required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                            <option value="">اختر الحالة </option>
                                            <option value="available">متوفر (Available)</option>
                                            <option value="unavailable">غير متوفر (Unavailable)</option>
                                            <option value="instock">في المخزن (In Stock)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* السعر */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">السعر المفرق</label>
                                    <div className="relative">
                                        <Euro className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
                                    </div>
                                </div>

                                {/* السعر الجملة */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">سعر الجملة</label>
                                    <div className="relative">
                                        <Euro className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input required type="number" value={formData.priceLow} onChange={(e) => setFormData({ ...formData, priceLow: e.target.value })} className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
                                    </div>
                                </div>

                                {/* المخزون */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold">كمية المخزون الإجمالية</label>
                                    <div className="relative">
                                        <Database className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input required type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="مثال: 100" />
                                    </div>
                                </div>

                                <button disabled={loading} type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50 mt-4">
                                    {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                                    {isEditing ? "حفظ التغييرات" : "تأكيد إضافة المنتج"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
            {islow && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    {/* الخلفية المعتمة */}
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={onClose} 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
                    />

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800" 
                        dir="rtl"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <div className="p-2 bg-amber-500 rounded-lg text-white">
                                        <Activity size={22} />
                                    </div>
                                    تنبيهات المخزون المنخفض
                                    <span className="text-sm font-normal bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                        {productslow.length} منتجات
                                    </span>
                                </h2>
                                <button onClick={oncloseLow} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={20} /></button>
                            </div>

                            <div className="overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                                <div className="grid gap-4">
                                    {productslow.length > 0 ? (
                                        productslow.map((product:any) => (
                                            <div 
                                                key={product.id} 
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-colors ${
                                                    Number(product.stock) === 0 
                                                    ? "bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30" 
                                                    : "bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30"
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-slate-100 overflow-hidden">
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.name} className="object-contain" />
                                                        ) : (
                                                            <ImageIcon className="text-slate-300" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800 dark:text-white">{product.name}</h3>
                                                        <p className="text-sm text-slate-500">{product.modelNumber}</p>
                                                    </div>
                                                </div>

                                                <div className="text-left">
                                                    <div className={`text-lg font-black ${Number(product.stock) === 0 ? "text-red-600" : "text-amber-600"}`}>
                                                        الكمية: {product.stock}
                                                    </div>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                                                        Number(product.stock) === 0 ? "bg-red-200 text-red-700" : "bg-amber-200 text-amber-700"
                                                    }`}>
                                                        {Number(product.stock) === 0 ? "نفد من المخزن" : "مخزون حرج"}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-slate-500">
                                            <CheckCircle2 size={48} className="mx-auto mb-3 text-green-500 opacity-20" />
                                            <p>كل المنتجات متوفرة بشكل جيد!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button 
                                onClick={oncloseLow}
                                className="w-full mt-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 py-3 rounded-xl font-bold transition-colors"
                            >
                                إغلاق النافذة
                            </button>
                        </div>
                    </motion.div>
                </div>

            )}
        </AnimatePresence>
    );
};