"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Tag, Euro, Database, Image as ImageIcon, CheckCircle2 } from "lucide-react";

export const AddProductModal = ({ isOpen, onClose, categories }: any) => {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null); // مرجع لمدخل الملفات
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click(); // عند الضغط على المربع، يفتح نافذة الملفات
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // لعرض الصورة فور اختيارها (معاينة)
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                        dir="rtl"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <div className="p-2 bg-blue-600 rounded-lg text-white"><Package size={22} /></div>
                                    إضافة منتج جديد للـمتجر
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={20} /></button>
                            </div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* رفع الصور */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold mb-3 text-slate-700 dark:text-slate-300">صور المنتج</label>

                                    {/* مدخل ملفات مخفي */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />

                                    <div
                                        onClick={handleImageClick} // إضافة وظيفة الضغط
                                        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 ${selectedImage ? "border-blue-500 bg-blue-50" : "border-slate-200 dark:border-slate-800"
                                            }`}
                                    >
                                        {selectedImage ? (
                                            <div className="relative w-full h-32">
                                                <img src={selectedImage} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                                <p className="text-xs text-blue-600 font-bold mt-2 text-center">اضغط لتغيير الصورة</p>
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon size={40} className="text-slate-400 mb-2" />
                                                <p className="text-sm text-slate-500 text-center">اضغط هنا لرفع صور المنتج</p>
                                                <p className="text-[10px] text-slate-400 mt-1 text-center">يدعم JPG, PNG (حد أقصى 5MB)</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* اسم المنتج */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">اسم المنتج</label>
                                    <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="مثال: iPhone 15 Pro" />
                                </div>

                                {/* اختيار القسم (الربط) */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">القسم</label>
                                    <div className="relative">
                                        <Tag className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <select className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                                            <option value="">اختر قسماً...</option>
                                            {categories.map((cat: any) => (
                                                <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* السعر */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">السعر</label>
                                    <div className="relative">
                                        <Euro className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input type="number" className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
                                    </div>
                                </div>

                                {/* المخزون */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">الكمية المتوفرة</label>
                                    <div className="relative">
                                        <Database className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input type="number" className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="100" />
                                    </div>
                                </div>

                                <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 text-lg">
                                    <CheckCircle2 size={20} />
                                    نشر المنتج في المتجر
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};