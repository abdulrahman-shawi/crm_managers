import axios from "axios";
import { useEffect, useState } from "react";

// 1. التعريفات (Interfaces)
interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    categoryId: number;
    createdAt: string;
}

interface CategoryData {
    id: number;
    name: string;
    description: string | null;
    products: Product[];
}
export function useCategories() {

    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true); // حالة التحميل
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [toastType, setToastType] = useState<"add" | "delete" | "edit" | null>(null);
    const [currentCat, setCurrentCat] = useState<CategoryData>({
        id: 0,
        name: "",
        description: "",
        products: [],
    });

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get("/api/dashboard/categories");
            setCategories(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("فشل جلب الأقسام", err);
        } finally {
            setIsLoading(false); // إيقاف التحميل سواء نجح أو فشل
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openAddModal = () => {
        setCurrentCat({ id: 0, name: "", description: "", products: [] });
        setIsEditing(false);
        setIsOpen(true);
    };

    const openEditModal = (cat: CategoryData) => {
        setCurrentCat(cat);
        setIsEditing(true);
        setIsOpen(true);
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                setCategories(categories.map(c =>
                    c.id === currentCat.id ? { ...c, name: currentCat.name, description: currentCat.description } : c
                ));
                const res = await axios.put(`/api/dashboard/categories/${currentCat.id}`, {
                    name: currentCat.name,
                    description: currentCat.description
                });
                if (res.status === 200) {
                    setCategories(categories.map(c =>
                        c.id === currentCat.id ? { ...c, name: currentCat.name, description: currentCat.description } : c
                    ));
                    showToast("edit");
                }
            } else {
                const res = await axios.post("/api/dashboard/categories", {
                    name: currentCat.name,
                    description: currentCat.description
                });
                if (res.status === 201 || res.status === 200) {
                    const newCat: CategoryData = {
                        id: res.data.id || Date.now(),
                        name: currentCat.name,
                        description: currentCat.description,
                        products: []
                    };
                    setCategories([...categories, newCat]);
                    showToast("add");
                }
            }
            setIsOpen(false);
        } catch (error) {
            console.error("خطأ في الحفظ", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("هل أنت متأكد من حذف هذا القسم؟")) {
            const res = await axios.delete(`/api/dashboard/categories/${id}`);
            if (res.status === 204) {
                setCategories(categories.filter(c => c.id !== id));
                showToast("delete");
            }
        }
    };

    const showToast = (type: "add" | "delete" | "edit") => {
        setToastType(type);
        setTimeout(() => setToastType(null), 3000);
    };
    return {
        categories,
        isLoading,
        isOpen,
        setIsOpen,
        isEditing,
        currentCat,
        setCurrentCat,
        openAddModal,
        openEditModal,
        handleSave,
        handleDelete,
        toastType,
        setToastType
    };
}