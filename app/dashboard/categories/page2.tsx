"use client";
import { FolderPlus, Edit, Trash2, Layers, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastAdd, ToastDELETE, ToastEdit } from "@/components/system/toast";
import { useCategories } from "@/hooks/categories";
import { useAuth } from '../../../context/AuthContext';

// 1. التعريفات (Interfaces)


// مكون الهيكل العظمي (Skeleton) للتحميل
const CategorySkeleton = () => (
  <div className="bg-slate-100 dark:bg-slate-800 animate-pulse p-6 rounded-[2rem] border border-transparent h-32 w-full">
    <div className="flex justify-between items-start">
      <div className="space-y-3 w-2/3">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
      </div>
    </div>
  </div>
);

export default function CategoriesPage2() {
  const {
    categories,
    isLoading,  
    isOpen,
    isEditing,
    currentCat,
    openAddModal,   
    openEditModal,
    handleSave,
    handleDelete,
    toastType,  
    setToastType,
    setIsOpen,
    setCurrentCat
  } = useCategories();
  const {user} = useAuth()

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* الرأس - يظهر دائماً فوراً */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Layers className="text-blue-600" /> إدارة الأقسام
        </h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95"
        >
          <FolderPlus size={18} /> إضافة قسم جديد
        </button>
      </div>

      {/* منطقة المحتوى */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // عرض الهيكل العظمي أثناء التحميل
          <>
            <CategorySkeleton />
            <CategorySkeleton />
            <CategorySkeleton />
          </>
        ) : (
          <AnimatePresence>
            {categories.filter(e => Number(e.userId) === Number(user?.id)).map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-blue-500 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {(cat.products?.length || 0)} منتج مرتبط
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* مودال الإضافة والتعديل */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{isEditing ? "تعديل القسم" : "إضافة قسم جديد"}</h2>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-900"><X /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold px-1 text-slate-700 dark:text-slate-300">اسم القسم</label>
                  <input
                    type="text"
                    value={currentCat.name}
                    onChange={(e) => setCurrentCat({ ...currentCat, name: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                    placeholder="مثال: إلكترونيات..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold px-1 text-slate-700 dark:text-slate-300">الوصف</label>
                  <input
                    type="text"
                    value={currentCat.description || ""}
                    onChange={(e) => setCurrentCat({ ...currentCat, description: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                    placeholder="وصف مختصر للقسم..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                  >
                    <Check size={20} />
                    {isEditing ? "حفظ التغييرات" : "إضافة الآن"}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold text-slate-600 dark:text-slate-300"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* التنبيهات */}
                {toastType === "add" && <ToastAdd message="تمت الإضافة" onClose={() => setToastType(null)} />}
                {toastType === "delete" && <ToastDELETE message="تم الحذف" onClose={() => setToastType(null)} />}
                {toastType === "edit" && <ToastEdit message="تم التحديث" onClose={() => setToastType(null)} />}

      </AnimatePresence>
    </div>
  );
}