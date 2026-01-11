"use client";
import { FolderPlus, Edit, Trash2, Layers, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastAdd, ToastDELETE, ToastEdit } from "@/components/system/toast";
import { useCategories } from "@/hooks/categories";
import { useAuth } from '../../../context/AuthContext';
import CategoriesTable from "@/components/categories/categoryTable";
import AddCategories from "@/components/categories/addCategories";

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
  const useCat = useCategories();
  const {
    isLoading,
    isOpen,
    openAddModal,
    toastType,
    setToastType,
  } = useCat;
  const { user } = useAuth()

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
      <div className="">
        {isLoading ? (
          // عرض الهيكل العظمي أثناء التحميل
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CategorySkeleton />
              <CategorySkeleton />
              <CategorySkeleton />
            </div>
          </>
        ) : (
          <AnimatePresence>
            <CategoriesTable usecategories={useCat} />
          </AnimatePresence>
        )}
      </div>

      {/* مودال الإضافة والتعديل */}
      <AnimatePresence>
        {isOpen && (
          <AddCategories useCategories={useCat} />
        )}

        {/* التنبيهات */}
        {toastType === "add" && <ToastAdd message="تمت الإضافة" onClose={() => setToastType(null)} />}
        {toastType === "delete" && <ToastDELETE message="تم الحذف" onClose={() => setToastType(null)} />}
        {toastType === "edit" && <ToastEdit message="تم التحديث" onClose={() => setToastType(null)} />}

      </AnimatePresence>
    </div>
  );
}