import axios from "axios";
import { useEffect, useRef, useState } from "react";

export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    image: string | null;
    categoryId: number;
    createdAt: string;
    // إذا كان الـ API يعيد كائن القسم كاملاً في العرض
    category?: {
        id: number;
        name: string;
    };
}
export function useProductForm(onSuccess: () => void) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // حالة التعديل ومعرف المنتج الحالي
    const [isEditing, setIsEditing] = useState(false);
    const [toastType, setToastType] = useState<"add" | "delete" | "edit" | null>(null);
    const [currentProductId, setCurrentProductId] = useState<number | null>(null);

    const initialData = {
        id: 0,
        name: "",
        categoryId: "",
        price: "",
        stock: ""
    };
    const [formData, setFormData] = useState(initialData);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("/api/dashboard/products");
            // تأكد من مسار البيانات في res.data
            setProducts(res.data.products || res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    // تنظيف الذاكرة للصور المعاينة
    useEffect(() => {
        return () => {
            if (selectedImage && selectedImage.startsWith("blob:")) {
                URL.revokeObjectURL(selectedImage);
            }
        };
    }, [selectedImage]);

    useEffect(() => {
        fetchProducts()
    }, [])

    const showToast = (type: "add" | "delete" | "edit") => {
        setToastType(type);
        setTimeout(() => setToastType(null), 3000);
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedImage && selectedImage.startsWith("blob:")) URL.revokeObjectURL(selectedImage);
            setFile(selectedFile);
            setSelectedImage(URL.createObjectURL(selectedFile));
        }
    };

    const resetForm = () => {
        setFormData(initialData);
        setFile(null);
        setSelectedImage(null);
        setIsEditing(false);
        setCurrentProductId(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // دالة لتجهيز البيانات عند الرغبة في التعديل
    const clickEdit = (product: Product) => {
        setIsEditing(true);
        setCurrentProductId(product.id);
        setFormData({
            id: product.id,
            name: product.name,
            categoryId: String(product.categoryId), // تحويل الرقم لنص ليتناسب مع الـ Select
            price: String(product.price),
            stock: String(product.stock)
        });
        setSelectedImage(product.image || null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // في حالة الإضافة فقط الصورة إجبارية، أما في التعديل قد لا يغير المستخدم الصورة
        if (!isEditing && !file) {
            alert("الرجاء اختيار صورة أولاً");
            return;
        }
        if (isEditing && !currentProductId) {
            alert("معرف المنتج غير موجود للتعديل");
            return;
        }

        setLoading(true);
        const data = new FormData();
        if (file) data.append("file", file); // نرسل الملف فقط إذا وُجد
        data.append("name", formData.name);
        data.append("categoryId", formData.categoryId);
        data.append("price", formData.price);
        data.append("stock", formData.stock);

        try {
            let res;
            if (isEditing) {
                console.log("Editing product with ID:", currentProductId, data);
                // عملية التحديث (Update)
                res = await axios.put(`/api/dashboard/products/${currentProductId}`, data);
                
            } else {
                // عملية الإضافة (Create)
                res = await axios.post("/api/dashboard/products", data);
            }

            if (res.data.success) {
                const newOrUpdatedProduct = res.data.product;

                if (isEditing) {
                    // حالة التعديل
                    setProducts((prev) =>
                        prev.map((prod) => prod.id === currentProductId ? newOrUpdatedProduct : prod)
                    );
                    showToast("edit");
                } else {
                    // حالة الإضافة: نضع المنتج الجديد في بداية أو نهاية القائمة
                    setProducts((prev) => [...prev, newOrUpdatedProduct]);
                    showToast("add");
                }

                resetForm();
                onSuccess();
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "حدث خطأ في العملية";
            alert(`❌ فشل: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) return;

        try {
            const res = await axios.delete(`/api/dashboard/products/${id}`);

            // نتحقق من res.data.success لأننا نرسلها الآن من الباك-إند
            if (res.status === 200 || res.status === 204 || res.data.success) {
                setProducts((prev) => prev.filter((p) => p.id !== id));
                // لا تضع alert نجاح هنا إلا إذا أردت، لكن الكود لن يذهب للـ catch
                showToast("delete");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            alert("❌ فشل الحذف، تأكد من الاتصال بالسيرفر");
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
        resetForm,
        isEditing,
        clickEdit,
        setIsEditing,
        isModalOpen,
        setIsModalOpen,
        products,
        setProducts,
        handleDeleteProduct,
        toastType,
        setToastType
    };
}