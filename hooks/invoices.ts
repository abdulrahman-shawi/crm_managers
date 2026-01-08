"use client";

import { useEffect, useState } from "react";

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
  const [activeTab, setActiveTab] = useState<"revenue" | "expenses">("revenue");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [revenues, setRevenues] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ========= Fetch Invoices ========= */
  const fetchInvoices = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/dashboard/invoices");
      if (!response.ok) throw new Error("Failed to fetch invoices");

      const data = await response.json();

      const formatted: Invoice[] = data.map((inv: any) => ({
        id: inv.id,
        rawItems: inv.items,
        party: inv.customer?.name || "غير معروف",
        category: inv.items?.[0]
          ? `منتج: ${inv.items[0].productId}`
          : "عام",
        amount: Number(inv.totalAmount),
        date: new Date(inv.date).toLocaleDateString("ar-EG"),
        status: inv.status === "PENDING" ? "معلقة" : "مدفوعة",
        type: inv.type,
      }));

      setRevenues(formatted.filter((i) => i.type === "REVENUE"));
      setExpenses(formatted.filter((i) => i.type === "EXPENSE"));
    } catch (error) {
      console.error("Invoices Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /* ========= Effects ========= */
  useEffect(() => {
    fetchInvoices();
  }, []);

  /* ========= Calculations ========= */
  const totalRevenues = revenues.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, i) => sum + i.amount, 0);
  const netBalance = totalRevenues - totalExpenses;

  /* ========= Helpers ========= */
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "مدفوعة":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20";
      case "معلقة":
        return "bg-amber-50 text-amber-600 dark:bg-amber-900/20";
      default:
        return "bg-slate-50 text-slate-600 dark:bg-slate-800";
    }
  };

  /* ========= Return ========= */
  return {
    /* state */
    activeTab,
    isModalOpen,
    isViewOpen,
    selectedInvoice,
    revenues,
    expenses,
    isLoading,

    /* setters */
    setActiveTab,
    setIsModalOpen,
    setIsViewOpen,
    setSelectedInvoice,

    /* data */
    fetchInvoices,
    totalRevenues,
    totalExpenses,
    netBalance,
    getStatusStyle,
  };
}