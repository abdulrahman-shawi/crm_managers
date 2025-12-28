import axios from "axios";
import { useEffect, useState } from "react";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  activities: { id: number; text: string; date: string }[];
}

export function useCustomers() {    
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [toastType, setToastType] = useState<"add" | "delete" | "edit" | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {  
        const res = await axios.get('/api/dashboard/customers');
        const data = Array.isArray(res.data) ? res.data : [];
        setCustomers(data.map((c: any) => ({
          ...c,
          activities: Array.isArray(c.activities) ? c.activities : []
        })));
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const showToast = (type: "add" | "delete" | "edit") => {
        setToastType(type);
        setTimeout(() => setToastType(null), 3000);
    };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toLocaleString('ar-EG', { hour12: true });

    try {
      if (editingId) {
        const res = await axios.put(`/api/dashboard/customers/${editingId}`, formData); 
        if (res.status === 200) {
          setCustomers(prev => prev.map(c => (
            c.id === editingId ? { 
              ...c, ...formData, 
              activities: [...(c.activities || []), { id: Date.now(), text: "تم تحديث البيانات", date: now }] 
            } : c
          )));
          showToast("edit");
        }
      } else {
        const res = await axios.post('/api/dashboard/customers', formData); 
        if (res.status === 201 || res.status === 200) {
          // ملاحظة: تأكد أن res.data تحتوي على الـ id
          const newCustomer: Customer = {
            ...res.data,
            name: formData.name,
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
    if (confirm("هل أنت متأكد؟")) {
      try {   
        await axios.delete(`/api/dashboard/customers/${id}`);
        setCustomers(prev => prev.filter(c => c.id !== id));
        showToast("delete");
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
    setFormData({ name: customer.name, email: customer.email, phone: customer.phone, address: customer.address });
    setIsModalOpen(true);
    setViewingCustomer(null);
  };

  return {
    customers, isModalOpen, setIsModalOpen,
    viewingCustomer, setViewingCustomer,
    editingId, formData, setFormData,
    handleSave, handleDelete, openEditModal, closeModal ,
    toastType, setToastType
  };
}