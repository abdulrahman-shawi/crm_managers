import { useAuth } from "@/context/AuthContext";
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
    priceLow: number;
    // الحقول الجديدة
    modelNumber: string;
    status: 'avilable' | 'unavilable' | 'instock';
    userId: number;
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
    const [isEditing, setIsEditing] = useState(false);
    const [toastType, setToastType] = useState<"add" | "delete" | "edit" | null>(null);
    const [currentProductId, setCurrentProductId] = useState<number | null>(null);
    
    // الحصول على بيانات المستخدم من السياق
    const { user } = useAuth();

    const initialData = {
        id: 0,
        name: "",
        categoryId: "",
        price: "",
        stock: "",
        priceLow: "",
        // الحقول الجديدة في الحالة الأولية
        modelNumber: "",
        status: "avilable",
        userid:0 // القيمة الافتراضية
    };

    const [formData, setFormData] = useState(initialData);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("/api/dashboard/products");
            setProducts(res.data.products || res.data);
            
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        return () => {
            if (selectedImage && selectedImage.startsWith("blob:")) {
                URL.revokeObjectURL(selectedImage);
            }
        };
    }, [selectedImage]);

    useEffect(() => {
        fetchProducts();
    }, []);

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

    const clickEdit = (product: Product) => {
        setIsEditing(true);
        setCurrentProductId(product.id);
        setFormData({
            id: product.id,
            name: product.name,
            categoryId: String(product.categoryId),
            price: String(product.price),
            stock: String(product.stock),
            priceLow: String(product.priceLow),
            // تعبئة البيانات الجديدة عند التعديل
            modelNumber: product.modelNumber || "",
            status: product.status || "avilable",
            userid:Number(user?.id)
        });
        setSelectedImage(product.image || null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // if (!isEditing) {
        //     alert("الرجاء اختيار صورة أولاً");
        //     return;
        // }

        setLoading(true);
        const data = new FormData();
        if (file) data.append("file", file);
        
        data.append("name", formData.name);
        data.append("categoryId", formData.categoryId);
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        data.append("priceLow", formData.priceLow);
        
        // إرسال البيانات الجديدة
        data.append("modelNumber", formData.modelNumber);
        data.append("status", formData.status);
        
        // إرسال معرف المستخدم (مهم جداً للعلاقة في قاعدة البيانات)
        if (user?.id) {
            data.append("userid", String(user.id));
        }

        try {
            let res;
            if (isEditing) {
                res = await axios.put(`/api/dashboard/products/${currentProductId}`, data);
            } else {
                res = await axios.post("/api/dashboard/products", data);
            }

            if (res.data.success) {
                const newOrUpdatedProduct = res.data.product;
                if (isEditing) {
                    setProducts((prev) =>
                        prev.map((prod) => prod.id === currentProductId ? newOrUpdatedProduct : prod)
                    );
                    showToast("edit");
                } else {
                    setProducts((prev) => [newOrUpdatedProduct, ...prev]);
                    showToast("add");
                }
                resetForm();
                onSuccess();
                setIsModalOpen(false); // إغلاق المودال عند النجاح
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
            if (res.status === 200 || res.data.success) {
                setProducts((prev) => prev.filter((p) => p.id !== id));
                showToast("delete");
            }
        } catch (error) {
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