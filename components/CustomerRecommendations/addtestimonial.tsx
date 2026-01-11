import axios from "axios";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState } from "react";


export function AddTestimonialModal({ isOpen, onClose, onAdd, customers, customerRecommendations }: any) {

    const {
        rating, setRating,
        formData, setFormData,
        loading,
        handleSubmit
    } = customerRecommendations

    if (!isOpen) return null;



    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800"
                dir="rtl"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">أضف رأي عميل</h2>

                <div className="space-y-4">
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <span className="text-sm text-slate-500 font-medium">تقييم العميل</span>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setRating(num)}
                                    className={`transition-transform hover:scale-125 ${num <= rating ? "text-amber-400" : "text-slate-300"}`}
                                >
                                    <Star size={32} fill={num <= rating ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold px-1">اختر العميل</label>
                            <select
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                            >
                                <option value="">-- اختر من القائمة --</option>
                                {customers.map((c: any) => (
                                    <option key={c.id} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold px-1">المسمى الوظيفي</label>
                            <input
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="مثال: مدير تنفيذي"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold px-1">نص التوصية</label>
                        <textarea
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                            placeholder="ماذا قال العميل عن خدماتكم؟"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            // التعديل هنا: أضفنا () => قبل استدعاء handleSubmit
                            onClick={() => handleSubmit(onAdd, onClose)}
                            disabled={loading || !formData.name || !formData.text}
                            className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg transition-all ${(loading || !formData.name || !formData.text) ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? "جاري الحفظ..." : "حفظ التوصية"}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}