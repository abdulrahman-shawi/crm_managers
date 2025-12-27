"use client";
import { useState } from "react";
import { Package, Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { UltraDropdown } from "@/components/UltraDropdown"; // تأكد من وجود المكون
import { AddProductModal } from "@/components/AddProductModal";
import { AnimatePresence, motion } from "framer-motion";
import { useCategories } from "@/hooks/categories";
import { useProductForm } from "@/hooks/products";

export default function ProductsPage() {
  const { categories } = useCategories()
  
  const productForm = useProductForm(() => productForm.setIsModalOpen(false));
  
  const { 
    products, setProducts, clickEdit, isModalOpen, 
    setIsModalOpen, resetForm 
  } = productForm;
  // الحالة الخاصة بالمنتجات
 

  // دالة الحذف
  const handleDeleteProduct = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // دالة العرض (يمكنك ربطها بصفحة تفاصيل أو مودال عرض)
  const handleViewProduct = (product: any) => {
    alert(`عرض تفاصيل: ${product.name}`);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* الرأس */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          <Package className="text-blue-600" /> إدارة المنتجات
        </h1>
        <button 
          onClick={() => {
            resetForm(); // تصفير الحقول قبل فتح المودال للإضافة
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Plus size={18} /> إضافة منتج
        </button>
      </div>

      {/* الجدول */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">المنتج</th>
                <th className="px-6 py-4">القسم</th>
                <th className="px-6 py-4">السعر</th>
                <th className="px-6 py-4">المخزون</th>
                <th className="px-6 py-4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <AnimatePresence>
                {products.map((product) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{product.name}</td>
                    <td className="px-6 py-4 text-slate-500">{product.category?.name}</td>
                    <td className="px-6 py-4 font-bold text-blue-600">€{product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'}`}>
                        {product.stock > 0 ? `متوفر (${product.stock})` : "نفذت الكمية"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left">
                      {/* استخدام الـ Dropdown وتمرير الدوال المطلوبة */}
                      <UltraDropdown 
                        onDelete={() => handleDeleteProduct(product.id)} 
                        onEdit={() => clickEdit(product)} 
                        onView={() => handleViewProduct(product)}
                      />
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        categories={categories} // مرر الأقسام هنا
        productForm={productForm} // تمرير الهوك
      />
    </div>
  );
}