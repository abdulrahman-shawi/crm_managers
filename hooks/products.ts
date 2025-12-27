import axios from "axios";
import { useEffect, useRef, useState } from "react";

export function useProductForm(onSuccess: () => void) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const initialData = {
        name: "",
        categoryId: "",
        price: "",
        stock: ""
    };
    const [formData, setFormData] = useState(initialData);

    // تنظيف الذاكرة عند تغيير الصورة أو إغلاق الهوك
    useEffect(() => {
        return () => {
            if (selectedImage) URL.revokeObjectURL(selectedImage);
        };
    }, [selectedImage]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedImage) URL.revokeObjectURL(selectedImage); // حذف القديمة
            setFile(selectedFile);
            setSelectedImage(URL.createObjectURL(selectedFile));
        }
    };

    const resetForm = () => {
        setFormData(initialData);
        setFile(null);
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert("الرجاء اختيار صورة أولاً");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("name", formData.name);
        data.append("categoryId", formData.categoryId);
        data.append("price", formData.price);
        data.append("stock", formData.stock);

        try {
            const res = await axios.post("/api/dashboard/products", data);
            if (res.data.success) {
                alert("✅ تم إضافة المنتج بنجاح!");
                resetForm();
                onSuccess(); // استدعاء دالة الإغلاق أو التحديث
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "حدث خطأ في الرفع";
            alert(`❌ فشل: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        setFormData,
        fileInputRef,
        selectedImage,
        loading,
        handleFileChange,
        handleSubmit,
        resetForm
    };
}