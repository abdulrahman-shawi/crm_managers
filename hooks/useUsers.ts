// hooks/useUsers.ts
"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export const useUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toastType, setToastType] = useState<"add" | "delete" | "edit" | null>(null);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);

    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        role: "",
        isActive: true, // تأكدنا من تسميتها isActive لتطابق الـ Backend
        password: "",
    });

    const fetchUsers = async () => {
        try {
            const res = await axios.get("/api/users");
            setUsers(res.data.users || []);
        } catch (err) {
            console.error("فشل جلب البيانات", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // --- دالة الإضافة الجديدة ---
    const handleAddUser = async (newUser: any) => {
        try {
            const res = await axios.post("/api/users/signup", newUser);
            if (res.status === 201) {
                // نأخذ المستخدم الجديد من استجابة السيرفر
                const createdUser = res.data.user || res.data; 
                setUsers((prev) => [...prev, createdUser]);
                showToast("add");
                setIsModalOpen(false); // إغلاق المودال تلقائياً
            }
        } catch (err) {
            console.error("فشل إضافة المستخدم", err);
        }
    };

    const handleEditClick = (user: any) => {
        setEditingUserId(user.id);
        setEditForm({
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            password: "",
        });
    };

    const handleSaveEdit = async (id: number) => {
        try {
            // حل مشكلة الـ 500 Error باستخدام التشفير للرابط
            const safeEmail = encodeURIComponent(editForm.email);
            const res = await axios.put(`/api/users/${safeEmail}`, {
                ...editForm
            });

            if (res.status === 200) {
                setUsers((prev) =>
                    prev.map((u) => u.id === id ? { ...u, ...editForm } : u)
                );
                setEditingUserId(null);
                showToast("edit");
            }
        } catch (error) {
            console.error("خطأ في التحديث", error);
        }
    };

    const handleDeleteUser = async (email: string) => {
        if (confirm("هل أنت متأكد من الحذف؟")) {
            try {
                const safeEmail = encodeURIComponent(email);
                const res = await axios.delete(`/api/users/${safeEmail}`);
                if (res.status === 200) {
                    setUsers((prev) => prev.filter((u) => u.email !== email));
                    showToast("delete");
                }
            } catch (err) {
                console.error("فشل الحذف", err);
            }
        }
    };

    const showToast = (type: "add" | "delete" | "edit") => {
        setToastType(type);
        setTimeout(() => setToastType(null), 3000);
    };

    const filteredUsers = users.filter((u) =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        users, filteredUsers, searchQuery, setSearchQuery,
        isModalOpen, setIsModalOpen, toastType, setToastType,
        editingUserId, setEditingUserId, editForm, setEditForm,
        handleEditClick, handleSaveEdit, handleDeleteUser, handleAddUser, showToast
    };
};