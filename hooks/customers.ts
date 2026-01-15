"use client";
import { db } from "@/lib/db";
import axios from "axios";
import { useEffect, useState } from "react";

// تعريف واجهة الفاتورة لتطابق الـ Prisma Model
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
  invoices: Invoice[]; // إضافة الفواتير هنا
}

export function useCustomers() {    
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [toastType, setToastType] = useState<"add" | "delete" | "edit" | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    const fetchCustomers = async () => {
    try {
      const res = await axios.get('/api/dashboard/customers');
      const data = res.data;
      setCustomers(data);
      // تحديث قاعدة بيانات المتصفح لتكون مطابقة للسيرفر (Cache)
      await db.customers.clear();
      await db.customers.bulkAdd(data.map((c: any) => ({ ...c, syncStatus: 'synced', originalId: c.id })));
    } catch (error) {
      if (!navigator.onLine) {
        const offlineData = await db.customers.toArray();
        setCustomers(offlineData as any);
      }
    }
  };
    fetchCustomers();
  }, []);

  const showToast = (type: "add" | "delete" | "edit") => {
    setToastType(type);
    setTimeout(() => setToastType(null), 3000);
  };

  const handleOfflineSave = async () => {
    const now = new Date().toLocaleString('ar-EG', { hour12: true });
    
    try {
      if (editingId) {
        // تحديث بيانات عميل موجود أصلاً في المتصفح
        await db.customers.update(editingId, { 
          ...formData, 
          syncStatus: 'pending_edit' 
        });
      } else {
        // إضافة عميل جديد تماماً في المتصفح
        await db.customers.add({ 
          ...formData, 
          syncStatus: 'pending_add',
          invoices: [],
        });
      }

      // تحديث الواجهة فوراً ليشعر المستخدم أن بياناته حُفظت
      setCustomers(prev => {
        if (editingId) {
          return prev.map(c => c.id === editingId ? { ...c, ...formData } : c);
        } else {
          return [...prev, { ...formData, id: Date.now(), invoices: [], activities: [] } as any];
        }
      });

      showToast(editingId ? "edit" : "add");
      closeModal();
      alert("⚠️ أنت غير متصل بالإنترنت. تم حفظ البيانات محلياً وسيتم رفعها تلقائياً عند عودة الاتصال.");
    } catch (err) {
      console.error("IndexedDB Error:", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toLocaleString('ar-EG', { hour12: true });

    // التحقق من حالة الإنترنت
    if (!navigator.onLine) {
      await handleOfflineSave();
      return;
    }

    try {
      if (editingId) {
        const res = await axios.put(`/api/dashboard/customers/${editingId}`, formData); 
        if (res.status === 200) {
          setCustomers(prev => prev.map(c => (
            c.id === editingId ? { 
              ...c, 
              ...formData, 
              activities: [...(c.activities || []), { id: Date.now(), text: "تم تحديث البيانات", date: now }] 
            } : c
          )));
          showToast("edit");
        }
      } else {
        const res = await axios.post('/api/dashboard/customers', formData); 
        if (res.status === 201 || res.status === 200) {
          const newCustomer: Customer = {
            ...res.data,
            // نضمن وجود مصفوفة فواتير فارغة للعميل الجديد
            invoices: [], 
            activities: [{ id: Date.now(), text: "إضافة عميل جديد", date: now }]
          };
          setCustomers(prev => [...prev, newCustomer]);
          showToast("add");
        }
      }
      closeModal();
    } catch (error) {
      alert("خطأ في الحفظ");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا العميل؟")) {
      try {   
        await axios.delete(`/api/dashboard/customers/${id}`);
        setCustomers(prev => prev.filter(c => c.id !== id));
        showToast("delete");
        // إذا كان المستخدم يشاهد تفاصيل العميل المحذوف، نغلق النافذة
        if (viewingCustomer?.id === id) setViewingCustomer(null);
      } catch (error) {
        console.error("Delete failed");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
  };

  const openEditModal = (customer: Customer) => {
    setEditingId(customer.id);
    setFormData({ 
        name: customer.name, 
        email: customer.email, 
        phone: customer.phone, 
        address: customer.address 
    });
    setIsModalOpen(true);
    setViewingCustomer(null); // إغلاق نافذة التفاصيل عند البدء في التعديل
  };

  return {
    customers, isModalOpen, setIsModalOpen,
    viewingCustomer, setViewingCustomer,
    editingId, formData, setFormData,
    handleSave, handleDelete, openEditModal, closeModal ,
    toastType, setToastType
  };
}