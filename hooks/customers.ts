"use client";
import { db } from "@/lib/db";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";

interface Invoice {
  id: string;
  type: "REVENUE" | "EXPENSE";
  status: string;
  totalAmount: number;
  date: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  activities: { id: number; text: string; date: string }[];
  invoices: Invoice[];
}

export function useCustomers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [toastType, setToastType] = useState<"add" | "delete" | "edit" | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });

  // --- 1. دالة المزامنة (رفع البيانات المعلقة للسيرفر) ---
  const syncOfflineData = useCallback(async () => {
    if (!navigator.onLine) return;

    try {
      const pendingActions = await db.customers.where("syncStatus").anyOf(["pending_add", "pending_edit"]).toArray();

      for (const item of pendingActions) {
        if (item.syncStatus === "pending_add") {
          const res = await axios.post("/api/dashboard/customers", {
            name: item.name, email: item.email, phone: item.phone, address: item.address
          });
          // تحديث السجل المحلي ليصبح متزامناً مع الـ ID الحقيقي
          await db.customers.update(item.id!, { syncStatus: "synced", originalId: res.data.id });
        } 
        else if (item.syncStatus === "pending_edit" && item.originalId) {
          await axios.put(`/api/dashboard/customers/${item.originalId}`, item);
          await db.customers.update(item.id!, { syncStatus: "synced" });
        }
      }
      // إعادة جلب البيانات لتحديث الواجهة بالـ IDs الصحيحة
      const res = await axios.get('/api/dashboard/customers');
      setCustomers(res.data);
    } catch (error) {
      console.error("Sync failed:", error);
    }
  }, []);

  // --- 2. جلب البيانات وإعداد المراقبين ---
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('/api/dashboard/customers');
        setCustomers(res.data);
        await db.customers.clear();
        await db.customers.bulkAdd(res.data.map((c: any) => ({ ...c, syncStatus: 'synced', originalId: c.id })));
      } catch (error) {
        const offlineData = await db.customers.toArray();
        setCustomers(offlineData as any);
      }
    };

    fetchCustomers();
    window.addEventListener("online", syncOfflineData);
    return () => window.removeEventListener("online", syncOfflineData);
  }, [syncOfflineData]);

  const showToast = (type: "add" | "delete" | "edit") => {
    setToastType(type);
    setTimeout(() => setToastType(null), 3000);
  };

  // --- 3. الحفظ أوفلاين ---
  const handleOfflineSave = async () => {
    const now = new Date().toLocaleString('ar-EG', { hour12: true });
    try {
      if (editingId) {
        await db.customers.update(editingId, { ...formData, syncStatus: 'pending_edit' });
      } else {
        await db.customers.add({ 
          ...formData, 
          syncStatus: 'pending_add', 
          invoices: [],
          // نضع ID مؤقت للواجهة فقط
        });
      }

      // تحديث الواجهة فوراً
      setCustomers(prev => editingId 
        ? prev.map(c => c.id === editingId ? { ...c, ...formData } : c)
        : [...prev, { ...formData, id: Date.now(), invoices: [], activities: [] } as any]
      );

      showToast(editingId ? "edit" : "add");
      closeModal();
      alert("⚠️ تم الحفظ محلياً. ستتم المزامنة تلقائياً عند توفر الإنترنت.");
    } catch (err) {
      console.error("Offline Save Error:", err);
    }
  };

  // --- 4. الحفظ الرئيسي ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toLocaleString('ar-EG', { hour12: true });

    if (!navigator.onLine) {
      await handleOfflineSave();
      return;
    }

    try {
      if (editingId) {
        const res = await axios.put(`/api/dashboard/customers/${editingId}`, formData);
        if (res.status === 200) {
          setCustomers(prev => prev.map(c => c.id === editingId ? { ...c, ...formData } : c));
          showToast("edit");
          closeModal();
        }
      } else {
        const res = await axios.post('/api/dashboard/customers', formData);
        if (res.status === 201 || res.status === 200) {
          setCustomers(prev => [...prev, res.data]);
          await db.customers.add({ ...formData, syncStatus: 'synced', originalId: res.data.id, invoices: [] });
          showToast("add");
          closeModal();
        }
      }
    } catch (error) {
      await handleOfflineSave();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await axios.delete(`/api/dashboard/customers/${id}`);
      setCustomers(prev => prev.filter(c => c.id !== id));
      await db.customers.where("originalId").equals(id).delete();
      showToast("delete");
    } catch (error) {
      alert("لا يمكن الحذف أوفلاين في النسخة الحالية لضمان سلامة البيانات.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
  };

  const openEditModal = (customer: Customer) => {
    setEditingId(customer.id);
    setFormData({ name: customer.name, email: customer.email, phone: customer.phone, address: customer.address });
    setIsModalOpen(true);
  };

  return {
    customers, isModalOpen, setIsModalOpen, viewingCustomer, setViewingCustomer,
    editingId, formData, setFormData, handleSave, handleDelete, openEditModal, closeModal,
    toastType, setToastType
  };
}