"use client";
import { useState } from "react";
import { MessageSquareQuote, Star, Plus, Quote, Trash2, User, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomerRecommendationsPage() {
  const [testimonials, setTestimonials] = useState([
    { id: 1, name: "محمد جاسم", role: "عميل وفيّ", text: "خدمة رائعة جداً، المنتج وصل في وقت قياسي وبجودة ممتازة!", rating: 5 },
    { id: 2, name: "سارة أحمد", role: "مصممة ديكور", text: "الأثاث المنزلي لديكم ذو جودة عالمية، سأقوم بالشراء مرة أخرى بالتأكيد.", rating: 4 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteTestimonial = (id: number) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* الرأس */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <MessageSquareQuote className="text-blue-600" /> توصيات العملاء
          </h1>
          <p className="text-sm text-slate-500 mt-1">إدارة آراء العملاء التي تظهر في واجهة الموقع</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus size={20} /> إضافة توصية جديدة
        </button>
      </div>

      {/* شبكة التوصيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {testimonials.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative group"
            >
              <Quote className="absolute top-6 left-6 text-blue-100 dark:text-blue-900/20" size={50} />
              
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < item.rating ? "currentColor" : "none"} stroke="currentColor" />
                ))}
              </div>

              <p className="text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed relative z-10">
                "{item.text}"
              </p>

              <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-400">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-[11px] text-slate-500 uppercase tracking-wider">{item.role}</p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteTestimonial(item.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* المودال الخاص بإضافة التوصية */}
      <AddTestimonialModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={(newT: any) => setTestimonials([newT, ...testimonials])}
      />
    </div>
  );
}

// مكون المودال
function AddTestimonialModal({ isOpen, onClose, onAdd }: any) {
  const [rating, setRating] = useState(5);
  const [formData, setFormData] = useState({ name: "", role: "", text: "" });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800"
        dir="rtl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">أضف رأي عميل</h2>
        
        <div className="space-y-4">
          {/* نظام التقييم بالنجوم */}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold px-1">اسم العميل</label>
              <input 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="مثال: خالد محمد" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold px-1">المسمى الوظيفي</label>
              <input 
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="مثال: مصور فوتوغرافي" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold px-1">نص التوصية</label>
            <textarea 
              onChange={(e) => setFormData({...formData, text: e.target.value})}
              rows={4} 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" 
              placeholder="ماذا قال العميل عن خدماتكم؟" 
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => {
                onAdd({ ...formData, rating, id: Date.now() });
                onClose();
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all"
            >
              حفظ التوصية
            </button>
            <button onClick={onClose} className="px-6 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold">إلغاء</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}