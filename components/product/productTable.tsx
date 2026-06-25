import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { UltraDropdown } from '../UltraDropdown';
import { ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react';

interface IProductTableProps {
    productForm : any;
    current:any
}

const ProductTable: React.FunctionComponent<IProductTableProps> = (props) => {
    const {
    products, clickEdit, isModalOpen,
    setIsModalOpen, resetForm, handleDeleteProduct,
     toastType, setToastType , islowOpen , setIslowOpen ,
      productslow , setProductslow , searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        currentItems,
        totalPages,
          canManageProducts,
        filteredProducts,
        indexOfFirstItem,
        indexOfLastItem,
        handleViewProduct
  } = props.productForm;
  const current = props.current
    return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">الصورة</th>
                <th className="px-6 py-4">المنتج</th>
                <th className="px-6 py-4">القسم</th>
                <th className="px-6 py-4">السعر الأصلي / المحسوب</th>
                <th className="px-6 py-4">المخزون</th>
                <th className="px-6 py-4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <AnimatePresence mode="popLayout">
                {currentItems.length > 0 ? (
                  currentItems.map((product:any) => (
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
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`font-bold ${product.pricingCurrency === 'USD' ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-200'}`}>
                            {Number(product.sourcePrice ?? product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {product.pricingCurrency === 'USD' ? '$' : 'ل.س'}
                          </span>
                          <span className="text-xs font-bold text-blue-600">
                            {Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ل.س
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'}`}>
                          {product.stock > 0 ? `في المخزن (${product.stock})` : "نفذت الكمية"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left">
                        {canManageProducts ? (
                          <UltraDropdown
                            onDelete={() => handleDeleteProduct(product.id)}
                            onEdit={() => clickEdit(product)}
                            onView={() => handleViewProduct(product)}
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-400">ADMIN فقط</span>
                        )}
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
                onClick={() => setCurrentPage((prev:any) => prev - 1)}
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
                onClick={() => setCurrentPage((prev:any) => prev + 1)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
  );
};

export default ProductTable;
