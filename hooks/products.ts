import { useState } from "react";

// 1. تحديث الواجهة لتدعم الملف الاختياري
interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    categoryId: number;
    createdAt: string;
    imageFile?: File | null; // أضفنا علامة الاستفهام لأنه قد لا يوجد ملف في البداية
    imageUrl?: string;      // يفضل إضافة حقل للرابط الراجع من السيرفر
}

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [toastType, setToastType] = useState<"add" | "delete" | "edit" | null>(null);

    // 2. تحديث الحالة الابتدائية لتطابق الواجهة
    const initialProductState: Product = {
        id: 0,
        name: "",
        price: 0,
        stock: 0,
        categoryId: 0,
        createdAt: new Date().toISOString(), // قيمة ابتدائية للتاريخ
        imageFile: null,
    };

    const [currentProd, setCurrentProd] = useState<Product>(initialProductState);

    // 3. دالة لتصفير المنتج (تحتاجها عند إغلاق المودال أو بعد الإضافة)
    const resetCurrentProduct = () => {
        setCurrentProd(initialProductState);
    };

    return {
        products,
        setProducts,
        isLoading,
        setIsLoading,
        isOpen,
        setIsOpen,
        isEditing,
        setIsEditing,
        toastType,
        setToastType,
        currentProd,
        setCurrentProd,
        resetCurrentProduct
    };
}