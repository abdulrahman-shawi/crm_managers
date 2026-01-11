"use client";
import {
  Package, Plus, Search
} from "lucide-react";
import { AddProductModal } from "@/components/AddProductModal";
import { useCategories } from "@/hooks/categories";
import { useProductForm } from "@/hooks/products";
import { ToastAdd, ToastDELETE, ToastEdit } from "@/components/system/toast";
import { useAuth } from "@/context/AuthContext";
import ProductTable from "@/components/product/productTable";

export default function Productslayout({ current }: any) {
  const { categories } = useCategories();
  const { user } = useAuth();

  // إعداد الهوك الخاص بالمنتجات
  const productForm = useProductForm(() => productForm.setIsModalOpen(false));

  // فك متغيرات الهوك
  const {
    isModalOpen,
    setIsModalOpen, resetForm, handleDeleteProduct,
    toastType, setToastType, islowOpen, setIslowOpen,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
  } = productForm;

  // --- منطق التصفية والبحث (useMemo للأداء العالي) ---




  return (
    <div className="space-y-6" dir="rtl">
      {/* الرأس: العنوان + البحث + زر الإضافة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white shrink-0">
          <Package className="text-blue-600" /> إدارة المنتجات
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          {/* حقل البحث */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="ابحث بالاسم أو رقم الموديل..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // العودة للصفحة الأولى عند البحث
              }}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm shadow-sm"
            />
          </div>

          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 shrink-0"
          >
            <Plus size={18} /> إضافة منتج
          </button>
          <button
            onClick={() => {
              resetForm();
              setIslowOpen(true);
            }}
            className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 shrink-0"
          >
            <Plus size={18} /> عرض المنتجات المنخفضة
          </button>
        </div>
      </div>

      {/* الجدول والترقيم */}
      <ProductTable current={current} productForm={productForm} />
      {/* المودال والتوستات */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        oncloseLow={() => setIslowOpen(false)}
        categories={categories}
        productForm={productForm}
        islow={islowOpen}
      />

      {toastType === "add" && <ToastAdd message="تمت إضافة المنتج بنجاح" onClose={() => setToastType(null)} />}
      {toastType === "delete" && <ToastDELETE message="تم حذف المنتج" onClose={() => setToastType(null)} />}
      {toastType === "edit" && <ToastEdit message="تم تحديث بيانات المنتج" onClose={() => setToastType(null)} />}
    </div>
  );
}