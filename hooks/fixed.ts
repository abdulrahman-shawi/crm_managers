import { useState, useEffect } from "react";
import axios from "axios";

// تعريف النوع لضمان تناسق البيانات
export interface FixedExpense {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
}

export const useFixedExpenses = () => {
  const [expenses, setExpenses] = useState<FixedExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    amount: "", 
    category: "إداري", 
    date: "" 
  });

  // حساب الإجمالي
  const totalFixed = expenses.reduce((sum, item) => sum + item.amount, 0);

  // جلب البيانات
  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/dashboard/fixed-expenses");
      if (res.status === 200) {
        setExpenses(res.data);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // حفظ (إضافة أو تعديل)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.name,
      amount: parseFloat(formData.amount),
      date: formData.date || "01 كل شهر"
    };

    try {
      if (editingId) {
        // حالة التعديل
        const res = await axios.put(`/api/dashboard/fixed-expenses/${editingId}`, payload);
        if (res.status === 200) {
          setExpenses(prev => 
            prev.map(item => item.id === editingId ? { ...item, ...formData, amount: payload.amount } : item)
          );
        }
      } else {
        // حالة الإضافة
        const res = await axios.post('/api/dashboard/fixed-expenses', payload);
        if (res.status === 201) {
          // يفضل استخدام res.data العائد من السيرفر للحصول على الـ ID الحقيقي
          setExpenses(prev => [...prev, res.data]);
        }
      }
      closeModal();
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("حدث خطأ أثناء حفظ البيانات");
    }
  };

  // الحذف
  const deleteExpense = async (id: number) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا المصروف؟")) return;

    try {
      const res = await axios.delete(`/api/dashboard/fixed-expenses/${id}`);
      if (res.status === 200) {
        setExpenses(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("فشل الحذف، يرجى المحاولة لاحقاً");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", amount: "", category: "إداري", date: "" });
  };

  const openEditModal = (item: FixedExpense) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      amount: item.amount.toString(),
      category: item.category,
      date: item.date
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    totalFixed,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    editingId,
    handleSave,
    deleteExpense,
    closeModal,
    openEditModal
  };
};