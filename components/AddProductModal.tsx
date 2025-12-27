"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Tag, Euro, Database, Image as ImageIcon, CheckCircle2, Loader2 } from "lucide-react";
import axios from "axios";

export const AddProductModal = ({ isOpen, onClose, categories }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // حقول النموذج
    const [formData, setFormData] = useState({
        name: "",
        categoryId: "",
        price: "",
        stock: "",
        imageUrl: ""
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setSelectedImage(URL.createObjectURL(selectedFile));
        }
    };

    // ... داخل مكون AddProductModal ...

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
        alert("الرجاء اختيار صورة أولاً");
        return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("name", formData.name);
    data.append("categoryId", formData.categoryId);
    data.append("price", formData.price);
    data.append("stock", formData.stock);

    try {
        const res = await axios.post("/api/dashboard/products", data);
        
        if (res.data.success) {
            alert("✅ تم إضافة المنتج بنجاح!");
            // تصفير النموذج
            setFormData({ name: "", categoryId: "", price: "", stock: "", imageUrl: "" });
            setSelectedImage(null);
            setFile(null);
            onClose();
        }
    } catch (error: any) {
        // استخراج رسالة الخطأ من السيرفر إذا وجدت، وإلا إظهار رسالة عامة
        const errorMessage = error.response?.data?.message || "حدث خطأ أثناء الاتصال بالسيرفر";
        console.error("Upload Error:", error);
        alert(`❌ فشل الرفع: ${errorMessage}`);
    } finally {
        setLoading(false);
    }
};

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800" dir="rtl">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <div className="p-2 bg-blue-600 rounded-lg text-white"><Package size={22} /></div>
                                    إضافة منتج جديد
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* منطقة رفع الصورة */}
                                <div className="md:col-span-2">
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                    <div onClick={() => fileInputRef.current?.click()} 
                                         className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${selectedImage ? "border-blue-500 bg-blue-50/50" : "border-slate-200 dark:border-slate-800"}`}>
                                        {selectedImage ? (
                                            <img src={selectedImage} alt="Preview" className="h-32 object-contain" />
                                        ) : (
                                            <><ImageIcon size={40} className="text-slate-400 mb-2" /><p className="text-sm text-slate-500">اضغط لرفع صورة</p></>
                                        )}
                                    </div>
                                </div>

                                {/* اسم المنتج */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">اسم المنتج</label>
                                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>

                                {/* القسم */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">القسم</label>
                                    <select required value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                        <option value="">اختر قسماً...</option>
                                        {categories?.map((cat: any) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* السعر */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">السعر</label>
                                    <div className="relative">
                                        <Euro className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
                                    </div>
                                </div>

                                {/* المخزون */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">الكمية</label>
                                    <div className="relative">
                                        <Database className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input required type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="100" />
                                    </div>
                                </div>

                                <button disabled={loading} type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50">
                                    {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                                    نشر المنتج
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};