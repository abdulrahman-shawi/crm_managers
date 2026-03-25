"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, RotateCcw } from "lucide-react";

type ReturnType = "REFUND" | "EXCHANGE";

type ProductLite = {
  id: number;
  name: string;
  modelNumber?: string | null;
  stock: number;
};

type InvoiceLite = {
  id: string;
  customer?: { name?: string | null } | null;
  date: string;
};

type ReturnRecord = {
  id: string;
  type: ReturnType;
  quantity: number;
  exchangedQuantity?: number | null;
  priceDifference: number;
  createdAt: string;
  invoice?: { id: string; customer?: { name?: string | null } | null } | null;
  returnedProduct: { id: number; name: string; modelNumber?: string | null };
  exchangedProduct?: { id: number; name: string; modelNumber?: string | null } | null;
};

const initialForm = {
  invoiceId: "",
  type: "REFUND" as ReturnType,
  returnedProductId: "",
  exchangedProductId: "",
  quantity: 1,
  exchangedQuantity: 1,
  priceDifference: 0,
  note: "",
};

export default function ReturnsPage() {
  const [products, setProducts] = useState<ProductLite[]>([]);
  const [invoices, setInvoices] = useState<InvoiceLite[]>([]);
  const [records, setRecords] = useState<ReturnRecord[]>([]);
  const [form, setForm] = useState(initialForm);
  const [returnedProductSearch, setReturnedProductSearch] = useState("");
  const [exchangedProductSearch, setExchangedProductSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productsRes, invoicesRes, returnsRes] = await Promise.all([
        fetch("/api/dashboard/products"),
        fetch("/api/dashboard/invoices?from=2000-01-01&to=2100-01-01"),
        fetch("/api/dashboard/returns"),
      ]);

      if (!productsRes.ok || !invoicesRes.ok || !returnsRes.ok) {
        throw new Error("فشل في تحميل بيانات صفحة المرتجعات");
      }

      const productsData = await productsRes.json();
      const invoicesData = await invoicesRes.json();
      const returnsData = await returnsRes.json();

      setProducts(productsData || []);
      setInvoices((invoicesData || []).filter((inv: any) => inv.type === "REVENUE"));
      setRecords(returnsData || []);
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchableReturnedProducts = useMemo(() => {
    const query = returnedProductSearch.trim().toLowerCase();
    if (!query) return products;

    return products.filter((p) => {
      const productName = p.name?.toLowerCase() || "";
      const modelNumber = p.modelNumber?.toLowerCase() || "";
      return productName.includes(query) || modelNumber.includes(query);
    });
  }, [products, returnedProductSearch]);

  const selectableReplacementProducts = useMemo(() => {
    const query = exchangedProductSearch.trim().toLowerCase();
    const replacementProducts = products.filter((p) => String(p.id) !== form.returnedProductId);

    if (!query) return replacementProducts;

    return replacementProducts.filter((p) => {
      const productName = p.name?.toLowerCase() || "";
      const modelNumber = p.modelNumber?.toLowerCase() || "";
      return productName.includes(query) || modelNumber.includes(query);
    });
  }, [products, form.returnedProductId, exchangedProductSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.returnedProductId) {
      setError("يرجى اختيار المنتج المرتجع");
      return;
    }

    if (form.type === "EXCHANGE" && !form.exchangedProductId) {
      setError("يرجى اختيار المنتج البديل عند التبديل");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        invoiceId: form.invoiceId || undefined,
        type: form.type,
        returnedProductId: Number(form.returnedProductId),
        exchangedProductId: form.type === "EXCHANGE" ? Number(form.exchangedProductId) : undefined,
        quantity: Number(form.quantity),
        exchangedQuantity: form.type === "EXCHANGE" ? Number(form.exchangedQuantity || 1) : undefined,
        priceDifference: form.type === "EXCHANGE" ? Number(form.priceDifference || 0) : 0,
        note: form.note || undefined,
      };

      const res = await fetch("/api/dashboard/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "تعذر حفظ المرتجع");
      }

      setRecords((prev) => [data, ...prev]);
      setForm(initialForm);
      setReturnedProductSearch("");
      setExchangedProductSearch("");

      // تحديث بيانات المنتجات مباشرة بعد تعديل المخزون
      const productsRes = await fetch("/api/dashboard/products");
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData || []);
      }
    } catch (err: any) {
      setError(err.message || "فشل في إنشاء المرتجع");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8" dir="rtl">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
          <RotateCcw size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">إدارة المرتجعات</h1>
          <p className="text-slate-500 text-sm">تسجيل ترجيع أو تبديل مع تحديث المخزون تلقائيا.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-lg font-black mb-5">إضافة مرتجع</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">رقم الفاتورة (اختياري)</label>
            <select
              value={form.invoiceId}
              onChange={(e) => setForm((prev) => ({ ...prev, invoiceId: e.target.value }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl"
            >
              <option value="">بدون ربط</option>
              {invoices.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.id.slice(-8)} - {invoice.customer?.name || "عميل"}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">نوع المرتجع</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  type: e.target.value as ReturnType,
                  exchangedProductId: "",
                  exchangedQuantity: 1,
                  priceDifference: 0,
                }))
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl"
            >
              <option value="REFUND">ترجيع</option>
              <option value="EXCHANGE">تبديل</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">المنتج المرتجع</label>
            <input
              type="text"
              value={returnedProductSearch}
              onChange={(e) => setReturnedProductSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl"
              placeholder="ابحث بالاسم أو رقم الموديل"
            />
            <select
              value={form.returnedProductId}
              onChange={(e) => {
                const selectedId = e.target.value;
                const selected = products.find((p) => String(p.id) === selectedId);
                setForm((prev) => ({ ...prev, returnedProductId: selectedId }));
                setReturnedProductSearch(selected?.name || "");
              }}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl"
              required
            >
              <option value="">اختر المنتج</option>
              {searchableReturnedProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.modelNumber || "-"}) - مخزون: {product.stock}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">الكمية</label>
            <input
              type="number"
              min={1}
              value={form.quantity}
              onChange={(e) => setForm((prev) => ({ ...prev, quantity: Number(e.target.value || 1) }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl"
              required
            />
          </div>

          {form.type === "EXCHANGE" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">المنتج البديل</label>
                <input
                  type="text"
                  value={exchangedProductSearch}
                  onChange={(e) => setExchangedProductSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl"
                  placeholder="ابحث بالاسم أو رقم الموديل"
                />
                <select
                  value={form.exchangedProductId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selected = products.find((p) => String(p.id) === selectedId);
                    setForm((prev) => ({ ...prev, exchangedProductId: selectedId }));
                    setExchangedProductSearch(selected?.name || "");
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl"
                  required
                >
                  <option value="">اختر المنتج البديل</option>
                  {selectableReplacementProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.modelNumber || "-"}) - مخزون: {product.stock}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">سعر الفرق</label>
                <input
                  type="number"
                  value={form.priceDifference}
                  onChange={(e) => setForm((prev) => ({ ...prev, priceDifference: Number(e.target.value || 0) }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">الكمية المبدلة</label>
                <input
                  type="number"
                  min={1}
                  value={form.exchangedQuantity}
                  onChange={(e) => setForm((prev) => ({ ...prev, exchangedQuantity: Number(e.target.value || 1) }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl"
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-2 md:col-span-2 xl:col-span-3">
            <label className="text-sm font-bold text-slate-600">ملاحظة</label>
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl"
              placeholder="ملاحظة اختيارية"
            />
          </div>

          {error && (
            <p className="md:col-span-2 xl:col-span-3 text-sm font-bold text-red-600">{error}</p>
          )}

          <div className="md:col-span-2 xl:col-span-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? "جاري الحفظ..." : "إضافة المرتجع"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-black">سجل المرتجعات</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">النوع</th>
                <th className="px-6 py-4">المنتج المرتجع</th>
                <th className="px-6 py-4">المنتج البديل</th>
                <th className="px-6 py-4">الكمية</th>
                <th className="px-6 py-4">الكمية المبدلة</th>
                <th className="px-6 py-4">فرق السعر</th>
                <th className="px-6 py-4">الفاتورة</th>
                <th className="px-6 py-4">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-400">جاري التحميل...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-400">لا توجد مرتجعات بعد</td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${
                          record.type === "EXCHANGE"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {record.type === "EXCHANGE" ? "تبديل" : "ترجيع"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">{record.returnedProduct?.name}</td>
                    <td className="px-6 py-4">
                      {record.exchangedProduct ? (
                        <span className="inline-flex items-center gap-2 font-bold text-blue-700">
                          <ArrowRightLeft size={15} /> {record.exchangedProduct.name}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-black">{record.quantity}</td>
                    <td className="px-6 py-4 font-black">{record.type === "EXCHANGE" ? (record.exchangedQuantity || 0) : "-"}</td>
                    <td className="px-6 py-4 font-black">ل.س{Number(record.priceDifference || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-xs">{record.invoice?.id?.slice(-8) || "-"}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(record.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
