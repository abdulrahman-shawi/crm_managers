"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
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
  rawItems?: any[];
}

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
  const [items, setItems] = useState([
        { productId: "", name: "", price: 0, quantity: 1, discount: 0, note: "", total: 0 , modelNumber : "" }
    ]);

  const [searchQueries, setSearchQueries] = useState<Record<number, string>>({});
  const [showDropdown, setShowDropdown] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== Data ===== */
  const [revenues, setRevenues] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ========= Fetch Invoices ========= */
  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/dashboard/invoices");
      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();

      const formatted: Invoice[] = data.map((inv: any) => ({
        id: inv.id,
        rawItems: inv.items,
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

  useEffect(() => {
    fetchInvoices();
  }, []);

  /* ========= Calculations ========= */
  const subTotal = items.reduce((sum, i) => sum + i.total, 0);
  const grandTotal = subTotal - overallDiscount;

  const totalRevenues = revenues.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, i) => s + i.amount, 0);
  const netBalance = totalRevenues - totalExpenses;

  /* ========= Actions ========= */
  const addNewItem = () => {
    setItems([...items, { productId: "", name: "", price: 0, quantity: 1, discount: 0, note: "", total: 0 , modelNumber:"" }]);
  };

  const updateItem = (index: number, field: string, value: any, products: any[]) => {
    const newItems = [...items];
    const item = newItems[index];

    if (field === "productId") {
      const product = products.find(p => p.id === Number(value));
      item.productId = value;
      item.name = product?.name || "";
      item.modelNumber = product?.modelNumber || "";
      item.price = product?.price || 0;
      setSearchQueries({ ...searchQueries, [index]: item.name });
      setShowDropdown({ ...showDropdown, [index]: false });
    } else {
      (item as any)[field] = value;
    }

    item.total = item.price * item.quantity - item.discount;
    setItems(newItems);
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
      await fetch("/api/dashboard/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });

      axios.post("https://kyzendev.app.n8n.cloud/webhook/e6f93672-158d-437b-84fc-fdda3b2a62b8", invoiceData)
        .catch(console.error);

      setIsModalOpen(false);
      fetchInvoices();
    } catch (e) {
      alert("فشل الحفظ");
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
    totalRevenues,
    totalExpenses,
    netBalance,
    isSubmitting,
    // ADD THESE LINES BELOW:
    searchQueries,
    setSearchQueries,
    showDropdown,
    setShowDropdown,

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
