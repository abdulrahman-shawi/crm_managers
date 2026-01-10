"use client";
import { useMemo, useState } from "react";
import { 
  Package, Plus, Search, ChevronRight, ChevronLeft, 
  PackageSearch 
} from "lucide-react";
import { UltraDropdown } from "@/components/UltraDropdown";
import { AddProductModal } from "@/components/AddProductModal";
import { AnimatePresence, motion } from "framer-motion";
import { useCategories } from "@/hooks/categories";
import { useProductForm } from "@/hooks/products";
import { ToastAdd, ToastDELETE, ToastEdit } from "@/components/system/toast";
import { useAuth } from "@/context/AuthContext";

export default function Productslayout({current}:any) {
  const { categories } = useCategories();
  const { user } = useAuth();
  
  // إعداد الهوك الخاص بالمنتجات
  const productForm = useProductForm(() => productForm.setIsModalOpen(false));
  
  // فك متغيرات الهوك
  const {
    products, clickEdit, isModalOpen,
    setIsModalOpen, resetForm, handleDeleteProduct,
     toastType, setToastType , islowOpen , setIslowOpen ,
      productslow , setProductslow
  } = productForm;

  // --- حالات البحث والترقيم ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- منطق التصفية والبحث (useMemo للأداء العالي) ---
  const filteredProducts = useMemo(() => {
    // 1. التصفية حسب المستخدم (userId من السكيما)
    const userOwned = products.filter(p => Number(p.userId) === Number(user?.id));

    // 2. التصفية حسب الاسم أو رقم الموديل
    if (!searchTerm.trim()) return userOwned;

    const lowerTerm = searchTerm.toLowerCase();
    return userOwned.filter(p => 
      p.name.toLowerCase().includes(lowerTerm) || 
      (p.modelNumber && p.modelNumber.toLowerCase().includes(lowerTerm))
    );
  }, [products, searchTerm, user?.id]);

  // --- حسابات الترقيم ---
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handleViewProduct = (product: any) => {
    alert(`عرض تفاصيل: ${product.name}`);
  };

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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">الصورة</th>
                <th className="px-6 py-4">المنتج</th>
                <th className="px-6 py-4">القسم</th>
                <th className="px-6 py-4">السعر</th>
                <th className="px-6 py-4">المخزون</th>
                <th className="px-6 py-4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <AnimatePresence mode="popLayout">
                {currentItems.length > 0 ? (
                  currentItems.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-12 w-12 object-contain rounded-lg" />
                        ) : (
                          <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                            {product.name.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 dark:text-white">{product.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">#{product.modelNumber || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{product.category?.name || "بدون قسم"}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">{current === "SAR" ? "ل.س"  : current ==="USD"? "$" : "€"} {product.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'}`}>
                          {product.stock > 0 ? `في المخزن (${product.stock})` : "نفذت الكمية"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <UltraDropdown
                          onDelete={() => handleDeleteProduct(product.id)}
                          onEdit={() => clickEdit(product)}
                          onView={() => handleViewProduct(product)}
                        />
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <PackageSearch size={48} strokeWidth={1} />
                        <p className="text-sm">لم يتم العثور على أي منتجات تطابق بحثك</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* أزرار الترقيم (Pagination) */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-slate-500">
              عرض {indexOfFirstItem + 1} إلى {Math.min(indexOfLastItem, filteredProducts.length)} من إجمالي {filteredProducts.length} منتج
            </span>
            
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400"
              >
                <ChevronRight size={18} />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // عرض أول صفحة، آخر صفحة، والصفحات القريبة من الحالية فقط إذا كان العدد كبيراً
                  if (totalPages > 5 && Math.abs(currentPage - pageNum) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                    if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="px-1 text-slate-400">...</span>;
                    return null;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                        currentPage === pageNum 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" 
                        : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* المودال والتوستات */}
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        oncloseLow= {() => setIslowOpen(false)}
        categories={categories} 
        productForm={productForm} 
        islow = {islowOpen}
      />

      {toastType === "add" && <ToastAdd message="تمت إضافة المنتج بنجاح" onClose={() => setToastType(null)} />}
      {toastType === "delete" && <ToastDELETE message="تم حذف المنتج" onClose={() => setToastType(null)} />}
      {toastType === "edit" && <ToastEdit message="تم تحديث بيانات المنتج" onClose={() => setToastType(null)} />}
    </div>
  );
}