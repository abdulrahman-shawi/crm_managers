"use client";
import { db } from "@/lib/db";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";

// واجهات البيانات
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

  // --- 1. دالة المزامنة المحسنة ---
  const syncOfflineData = useCallback(async () => {
    if (!navigator.onLine) return;

    try {
      // جلب البيانات التي لم يتم مزامنتها بعد
      const pendingActions = await db.customers
        .where("syncStatus")
        .anyOf(["pending_add", "pending_edit"])
        .toArray();

      if (pendingActions.length === 0) return;

      console.log("جارٍ مزامنة البيانات العالقة...");

      for (const item of pendingActions) {
        try {
          if (item.syncStatus === "pending_add") {
            const res = await axios.post("/api/dashboard/customers", {
              name: item.name, email: item.email, phone: item.phone, address: item.address
            });
            // حذف السجل المؤقت وإضافة السجل الحقيقي من السيرفر
            await db.customers.delete(item.id!);
            await db.customers.add({ ...res.data, syncStatus: 'synced', originalId: res.data.id });
          } 
          else if (item.syncStatus === "pending_edit" && item.originalId) {
            await axios.put(`/api/dashboard/customers/${item.originalId}`, item);
            await db.customers.update(item.id!, { syncStatus: "synced" });
          }
        } catch (innerError) {
          console.error("فشلت مزامنة هذا السجل:", item.name);
        }
      }

      // تحديث القائمة النهائية من السيرفر بعد انتهاء المزامنة
      const finalRes = await axios.get('/api/dashboard/customers');
      setCustomers(finalRes.data);
    } catch (error) {
      console.error("Sync process failed:", error);
    }
  }, []);

  // --- 2. التحكم في الجلب والمزامنة ---
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('/api/dashboard/customers');
        setCustomers(res.data);
        
        // تحديث الكاش المحلي
        await db.customers.clear();
        await db.customers.bulkAdd(res.data.map((c: any) => ({ 
          ...c, 
          syncStatus: 'synced', 
          originalId: c.id 
        })));
      } catch (error) {
        // في حال فشل الإنترنت، نعرض المخزن محلياً
        const offlineData = await db.customers.toArray();
        setCustomers(offlineData as any);
      }
    };

    fetchCustomers();

    // تشغيل المزامنة فوراً عند فتح التطبيق إذا كان الإنترنت متوفراً
    if (navigator.onLine) {
      syncOfflineData();
    }

    // الاستماع لعودة الإنترنت
    window.addEventListener("online", syncOfflineData);
    return () => window.removeEventListener("online", syncOfflineData);
  }, [syncOfflineData]);

  // --- 3. وظائف التوست والمودال ---
  const showToast = (type: "add" | "delete" | "edit") => {
    setToastType(type);
    setTimeout(() => setToastType(null), 3000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
  };

  // --- 4. معالجة الحفظ (Offline & Online) ---
  const handleOfflineSave = async () => {
    try {
      if (editingId) {
        await db.customers.update(editingId, { ...formData, syncStatus: 'pending_edit' });
      } else {
        await db.customers.add({ 
          ...formData, 
          syncStatus: 'pending_add', 
          invoices: []
        });
      }

      // تحديث الواجهة فوراً برقم ID وهمي (Timestamp)
      setCustomers(prev => editingId 
        ? prev.map(c => c.id === editingId ? { ...c, ...formData } : c)
        : [...prev, { ...formData, id: Date.now(), invoices: [], activities: [] } as any]
      );

      showToast(editingId ? "edit" : "add");
      closeModal();
      alert("⚠️ تم الحفظ محلياً. ستتم المزامنة فور توفر الإنترنت.");
    } catch (err) {
      console.error("Offline Save Error:", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

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
          // إضافة للسجل المحلي كـ Synced
          await db.customers.add({ ...formData, syncStatus: 'synced', originalId: res.data.id, invoices: [] });
          showToast("add");
          closeModal();
        }
      }
    } catch (error) {
      // في حال فشل السيرفر فجأة
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
      alert("عذراً، يجب توفر الإنترنت لحذف البيانات بشكل نهائي.");
    }
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