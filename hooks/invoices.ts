"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

/* ========= Types ========= */
export interface Invoice {
  id: string;
  party: string;
  category: string;
  amount: number;
  date: string;
  status: "مدفوعة" | "معلقة";
  type: "REVENUE" | "EXPENSE" | "OTHER";
  sourceKind?: "INVOICE" | "RETURN_ENTRY";
  sourceLabel?: string;
  rawItems?: InvoiceItemRaw[];
  rawReturns?: InvoiceReturnRaw[];
}

interface InvoiceItemRaw {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  subTotal: number;
  product?: {
    id: number;
    name: string;
    modelNumber?: string | null;
    priceLow?: number | null;
    price?: number | null;
  } | null;
}

interface InvoiceReturnRaw {
  id: string;
  type: "REFUND" | "EXCHANGE";
  quantity: number;
  priceDifference: number;
  note?: string | null;
  createdAt: string;
  returnedProduct?: { id: number; name: string } | null;
  exchangedProduct?: { id: number; name: string } | null;
}

interface ReturnListEntry extends InvoiceReturnRaw {
  invoice?: {
    id: string;
    customer?: { name?: string | null } | null;
  } | null;
}

export interface ProductProfitRow {
  productId: number;
  productName: string;
  modelNumber: string;
  soldQuantity: number;
  wholesaleTotal: number;
  salesTotal: number;
  netProfit: number;
}

export type InvoiceDateFilter = "this_month" | "last_month" | "last_7_days" | "today" | "custom";

interface DateRange {
  from: string;
  to: string;
}

const initialInvoiceItem = {
  productId: "",
  name: "",
  price: 0,
  quantity: 1,
  discount: 0,
  note: "",
  total: 0,
  modelNumber: "",
};

const toDateOnly = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateRangeByFilter = (
  filter: InvoiceDateFilter,
  customFrom: string,
  customTo: string
): DateRange => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (filter === "today") {
    const value = toDateOnly(today);
    return { from: value, to: value };
  }

  if (filter === "last_7_days") {
    const fromDate = new Date(today);
    fromDate.setDate(fromDate.getDate() - 6);
    return { from: toDateOnly(fromDate), to: toDateOnly(today) };
  }

  if (filter === "last_month") {
    const firstOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstOfLastMonth = new Date(firstOfThisMonth);
    firstOfLastMonth.setMonth(firstOfLastMonth.getMonth() - 1);
    const lastOfLastMonth = new Date(firstOfThisMonth);
    lastOfLastMonth.setDate(0);

    return { from: toDateOnly(firstOfLastMonth), to: toDateOnly(lastOfLastMonth) };
  }

  if (filter === "custom") {
    if (customFrom && customTo) {
      return { from: customFrom, to: customTo };
    }

    const fallbackFrom = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: toDateOnly(fallbackFrom), to: toDateOnly(today) };
  }

  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return { from: toDateOnly(firstOfMonth), to: toDateOnly(today) };
};

const WHATSAPP_NUMBER = "963944692928";

const invoiceTypeLabel = (type: string) =>
  type === "revenue" ? "فاتورة مقبوضات" : type === "expenses" ? "فاتورة مدفوعات" : "بند أخرى";

const buildInvoiceWhatsAppMessage = (data: {
  type: string;
  clientName: string;
  status: string;
  items: any[];
  subTotal: number;
  overallDiscount: number;
  grandTotal: number;
  date: string;
}) => {
  const lines: string[] = [
    `🧾 ${invoiceTypeLabel(data.type)}`,
    `👤 العميل: ${data.clientName}`,
    `📌 الحالة: ${data.status}`,
    `📅 التاريخ: ${new Date(data.date).toLocaleString("ar-SY")}`,
    "",
    "📦 المواد:",
  ];

  data.items.forEach((item, i) => {
    const name = item.name || item.note || "بند";
    const model = item.modelNumber ? ` (${item.modelNumber})` : "";
    lines.push(`${i + 1}. ${name}${model}`);
    lines.push(`   الكمية: ${item.quantity} × السعر: ${Number(item.price).toLocaleString()} ل.س`);
    if (Number(item.discount) > 0) {
      lines.push(`   الخصم: ${Number(item.discount).toLocaleString()} ل.س`);
    }
    if (item.note && item.name) {
      lines.push(`   ملاحظة: ${item.note}`);
    }
    lines.push(`   الإجمالي: ${Number(item.total).toLocaleString()} ل.س`);
  });

  lines.push("");
  lines.push(`المجموع الفرعي: ${Number(data.subTotal).toLocaleString()} ل.س`);
  if (Number(data.overallDiscount) > 0) {
    lines.push(`خصم الفاتورة: ${Number(data.overallDiscount).toLocaleString()} ل.س`);
  }
  lines.push(`💰 الإجمالي النهائي: ${Number(data.grandTotal).toLocaleString()} ل.س`);

  return lines.join("\n");
};

/* ========= Hook ========= */
export function useInvoices() {
  const { user } = useAuth();
  const canViewProfit = user?.role?.toUpperCase() === "ADMIN";

  /* ===== UI State ===== */
  const [activeTab, setActiveTab] = useState<"revenue" | "expenses" | "other">("revenue");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  /* ===== Form State ===== */
  const [client, setClient] = useState("");
  const [status, setStatus] = useState<"مدفوعة" | "معلقة">("مدفوعة");
  const [overallDiscount, setOverallDiscount] = useState(0);
  const [items, setItems] = useState([initialInvoiceItem]);

  const [searchQueries, setSearchQueries] = useState<Record<number, string>>({});
  const [showDropdown, setShowDropdown] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== Data ===== */
  const [revenues, setRevenues] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Invoice[]>([]);
  const [others, setOthers] = useState<Invoice[]>([]);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<InvoiceDateFilter>("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  /* ========= Fetch Invoices ========= */
  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const range = getDateRangeByFilter(dateFilter, customFrom, customTo);
      const params = new URLSearchParams({
        from: range.from,
        to: range.to,
      });
      const filterFromDate = new Date(range.from);
      const filterToDate = new Date(range.to);
      filterToDate.setHours(23, 59, 59, 999);

      const [invoicesRes, returnsRes] = await Promise.all([
        fetch(`/api/dashboard/invoices?${params.toString()}`),
        fetch("/api/dashboard/returns", { cache: "no-store" }),
      ]);

      if (!invoicesRes.ok || !returnsRes.ok) throw new Error("Fetch failed");

      const [data, returnsData] = await Promise.all([invoicesRes.json(), returnsRes.json()]);

      const formattedInvoices = data.map((inv: any) => ({
        sortTime: new Date(inv.createdAt || inv.date).getTime(),
        invoice: {
          id: inv.id,
          rawItems: inv.items,
          rawReturns: inv.returns || [],
          party: inv.customer?.name || "غير معروف",
          category:
            inv.type === "OTHER"
              ? inv.items?.[0]?.note || "بند أخرى"
              : inv.items?.[0]?.product?.name || (inv.items?.[0] ? `منتج: ${inv.items[0].productId}` : "عام"),
          amount: Number(inv.totalAmount),
          date: new Date(inv.date).toLocaleDateString("ar-EG"),
          status: inv.status === "PENDING" ? "معلقة" : "مدفوعة",
          type: inv.type,
          sourceKind: "INVOICE",
          sourceLabel: inv.type === "REVENUE" ? "فاتورة" : "فاتورة",
        } satisfies Invoice,
      }));

      const formattedReturnDifferences = (returnsData as ReturnListEntry[])
        .filter((ret) => {
          const createdAt = new Date(ret.createdAt);
          return createdAt >= filterFromDate && createdAt <= filterToDate;
        })
        .map((ret) => {
          const difference = Number(ret.priceDifference || 0);
          const returnedName = ret.returnedProduct?.name || "منتج مرتجع";
          const exchangedName = ret.exchangedProduct?.name || "-";
          const isRevenue = ret.type === "REFUND";

          return {
            sortTime: new Date(ret.createdAt).getTime(),
            invoice: {
              id: ret.invoice?.id ? `${ret.invoice.id}-return-${ret.id}` : `return-${ret.id}`,
              party: ret.invoice?.customer?.name || "غير معروف",
              category:
                ret.type === "EXCHANGE"
                  ? `تبديل: ${returnedName} -> ${exchangedName}`
                  : `مرتجع: ${returnedName}`,
              amount: Math.abs(difference),
              date: new Date(ret.createdAt).toLocaleDateString("ar-EG"),
              status: "مدفوعة",
              type: isRevenue ? "REVENUE" : "EXPENSE",
              sourceKind: "RETURN_ENTRY",
              sourceLabel: ret.type === "REFUND" ? "مرتجع" : "تبديل",
              rawItems: [],
              rawReturns: [ret],
            } satisfies Invoice,
          };
        });

      const formatted = [...formattedInvoices, ...formattedReturnDifferences]
        .sort((a, b) => b.sortTime - a.sortTime)
        .map((entry) => entry.invoice);

      setRevenues(formatted.filter(i => i.type === "REVENUE"));
      setExpenses(formatted.filter(i => i.type === "EXPENSE"));
      setOthers(formatted.filter(i => i.type === "OTHER"));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOpeningBalance = async () => {
    try {
      const res = await fetch("/api/dashboard/general-settings", { cache: "no-store" });
      if (!res.ok) throw new Error("Fetch settings failed");

      const data = await res.json();
      setOpeningBalance(Number(data?.openingBalance ?? 0));
    } catch (error) {
      console.error(error);
      setOpeningBalance(0);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [dateFilter, customFrom, customTo]);

  useEffect(() => {
    fetchOpeningBalance();
  }, []);

  /* ========= Calculations ========= */
  const subTotal = items.reduce((sum, i) => sum + i.total, 0);
  const grandTotal = subTotal - overallDiscount;

  const totalRevenues = revenues.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, i) => s + i.amount, 0);
  const totalOthers = others.reduce((s, i) => s + i.amount, 0);
  const netBalance = openingBalance + totalRevenues - totalExpenses + totalOthers;

  const productProfitAnalysis = useMemo<ProductProfitRow[]>(() => {
    if (!canViewProfit) {
      return [];
    }

    const rows = new Map<number, ProductProfitRow>();

    revenues.forEach((invoice) => {
      (invoice.rawItems || []).forEach((item) => {
        const key = item.productId;
        const salesTotal = Number(item.subTotal ?? item.unitPrice * item.quantity);
        const wholesalePrice = Number(item.product?.priceLow ?? 0);
        const wholesaleTotal = wholesalePrice * Number(item.quantity || 0);

        const existing = rows.get(key);
        if (!existing) {
          rows.set(key, {
            productId: key,
            productName: item.product?.name || `منتج #${key}`,
            modelNumber: item.product?.modelNumber || "-",
            soldQuantity: Number(item.quantity || 0),
            wholesaleTotal,
            salesTotal,
            netProfit: salesTotal - wholesaleTotal,
          });
          return;
        }

        existing.soldQuantity += Number(item.quantity || 0);
        existing.wholesaleTotal += wholesaleTotal;
        existing.salesTotal += salesTotal;
        existing.netProfit += salesTotal - wholesaleTotal;
      });
    });

    return Array.from(rows.values()).sort((a, b) => b.netProfit - a.netProfit);
  }, [canViewProfit, revenues]);

  const monthlySalesTotal = productProfitAnalysis.reduce((sum, row) => sum + row.salesTotal, 0);
  const monthlyWholesaleTotal = productProfitAnalysis.reduce((sum, row) => sum + row.wholesaleTotal, 0);
  const monthlyNetProfit = productProfitAnalysis.reduce((sum, row) => sum + row.netProfit, 0);

  /* ========= Actions ========= */
  const addNewItem = () => {
    setItems((prev) => [...prev, { ...initialInvoiceItem }]);
  };

  const updateItem = (index: number, field: string, value: any, products: any[]) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const current = newItems[index];
      if (!current) return prevItems;

      const item = { ...current } as any;

      if (field === "productId") {
        const product = products.find((p) => p.id === Number(value));
        item.productId = value;
        item.name = product?.name || "";
        item.modelNumber = product?.modelNumber || "";
        item.price = Math.round(Number(product?.price ?? 0));

        setSearchQueries((prev) => ({ ...prev, [index]: item.name }));
        setShowDropdown((prev) => ({ ...prev, [index]: false }));
      } else {
        item[field] = value;
      }

      item.total = item.price * item.quantity - item.discount;
      newItems[index] = item;
      return newItems;
    });
  };

  const handleSubmit = async () => {
    if (!client) return alert("البيانات ناقصة");
    if (activeTab !== "other" && !items.length) return alert("البيانات ناقصة");

    if (activeTab === "other") {
      const invalidItems = items.some(
        (item) => !(item.name || item.note) || Number(item.total || item.price || 0) <= 0
      );
      if (invalidItems) return alert("يرجى إدخال البيان والمبلغ لكل بند");
    }

    setIsSubmitting(true);

    const invoiceItems = activeTab === "other"
      ? items.map((item) => ({
          ...item,
          productId: item.productId || "",
          price: item.price || item.total || 0,
          quantity: item.quantity || 1,
          note: item.name || item.note || "بند أخرى",
        }))
      : items;

    const invoiceData = {
      type: activeTab,
      clientName: client,
      status,
      userId: user?.id,
      items: invoiceItems,
      subTotal,
      overallDiscount,
      grandTotal,
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/dashboard/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.details || errorData?.error || "فشل حفظ الفاتورة");
      }

      axios.post("https://kyzendev.app.n8n.cloud/webhook/e6f93672-158d-437b-84fc-fdda3b2a62b8", invoiceData)
        .catch(console.error);

      const whatsappMessage = buildInvoiceWhatsAppMessage(invoiceData);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`, "_blank");

      setClient("");
      setStatus("مدفوعة");
      setOverallDiscount(0);
      setItems([{ ...initialInvoiceItem }]);
      setSearchQueries({});
      setShowDropdown({});
      setIsModalOpen(false);
      fetchInvoices();
    } catch (e: any) {
      alert(e?.message || "فشل الحفظ");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ========= Helpers ========= */
  const getStatusStyle = (s: string) =>
    s === "مدفوعة"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-amber-50 text-amber-600";

  /* ========= Return ========= */
  return {
    activeTab,
    isModalOpen,
    isViewOpen,
    selectedInvoice,
    revenues,
    expenses,
    others,
    isLoading,
    client,
    items,
    status,
    overallDiscount,
    subTotal,
    grandTotal,
    openingBalance,
    totalRevenues,
    totalExpenses,
    totalOthers,
    netBalance,
    canViewProfit,
    productProfitAnalysis,
    monthlySalesTotal,
    monthlyWholesaleTotal,
    monthlyNetProfit,
    dateFilter,
    customFrom,
    customTo,
    isSubmitting,
    // ADD THESE LINES BELOW:
    searchQueries,
    setSearchQueries,
    showDropdown,
    setShowDropdown,
    setDateFilter,
    setCustomFrom,
    setCustomTo,

    setActiveTab,
    setIsModalOpen,
    setIsViewOpen,
    setSelectedInvoice,
    setClient,
    setStatus,
    setOverallDiscount,

    addNewItem,
    updateItem,
    handleSubmit,
    fetchInvoices,
    getStatusStyle,
    setItems // Also recommended to include this if you use it in the modal
  };
}
