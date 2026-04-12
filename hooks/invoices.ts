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
  type: "REVENUE" | "EXPENSE";
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

/* ========= Hook ========= */
export function useInvoices() {
  const { user } = useAuth();

  /* ===== UI State ===== */
  const [activeTab, setActiveTab] = useState<"revenue" | "expenses">("revenue");
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
  const [openingBalance, setOpeningBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<InvoiceDateFilter>("this_month");
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

      const res = await fetch(`/api/dashboard/invoices?${params.toString()}`);
      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();

      const formatted: Invoice[] = data.map((inv: any) => ({
        id: inv.id,
        rawItems: inv.items,
        rawReturns: inv.returns || [],
        party: inv.customer?.name || "غير معروف",
        category: inv.items?.[0] ? `منتج: ${inv.items[0].productId}` : "عام",
        amount: Number(inv.totalAmount),
        date: new Date(inv.date).toLocaleDateString("ar-EG"),
        status: inv.status === "PENDING" ? "معلقة" : "مدفوعة",
        type: inv.type,
      }));

      setRevenues(formatted.filter(i => i.type === "REVENUE"));
      setExpenses(formatted.filter(i => i.type === "EXPENSE"));
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
  const netBalance = openingBalance + totalRevenues - totalExpenses;

  const productProfitAnalysis = useMemo<ProductProfitRow[]>(() => {
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
  }, [revenues]);

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
        item.price = product?.price || 0;

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
    if (!client || !items.length) return alert("البيانات ناقصة");

    setIsSubmitting(true);

    const invoiceData = {
      type: activeTab,
      clientName: client,
      status,
      userId: user?.id,
      items,
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
    netBalance,
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
