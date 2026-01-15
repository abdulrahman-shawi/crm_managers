"use client";

import { AnimatePresence } from "framer-motion";
import { ToastAdd, ToastDELETE, ToastEdit } from "@/components/system/toast";
import { AddUserModal } from "@/components/AddUserModal";
import { UserRow } from "@/components/users/UserRow";
import { useUsers } from "@/hooks/useUsers"; // استيراد الهوك
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersSearch } from "@/components/users/UsersSearch";


export default function UsersPage2() {
  // جلب كل المتغيرات والدوال من الهوك
  const {
    filteredUsers, searchQuery, setSearchQuery,
    isModalOpen, setIsModalOpen, toastType, setToastType,
    editingUserId, setEditingUserId, editForm, setEditForm,
    handleEditClick, handleSaveEdit, handleDeleteUser, handleAddUser
  } = useUsers();

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* الهيدر */}
      <UsersHeader onAdd={() => setIsModalOpen(true)} />

      {/* شريط البحث */}
      <UsersSearch value={searchQuery} onChange={setSearchQuery} />


      {/* الجدول */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">المستخدم</th>
                <th className="px-6 py-4 font-bold">الدور الوظيفي</th>
                <th className="px-6 py-4 font-bold">الحالة</th>
                <th className="px-6 py-4 font-bold text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isEditing={editingUserId === user.id}
                  editForm={editForm}
                  setEditForm={setEditForm}
                  onSave={handleSaveEdit}
                  onCancel={() => setEditingUserId(null)}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteUser}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* التنبيهات */}
      <AnimatePresence mode="wait">
        {toastType === "add" && <ToastAdd message="تمت الإضافة" onClose={() => setToastType(null)} />}
        {toastType === "delete" && <ToastDELETE message="تم الحذف" onClose={() => setToastType(null)} />}
        {toastType === "edit" && <ToastEdit message="تم التحديث" onClose={() => setToastType(null)} />}
      </AnimatePresence>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddUser} // نمرر الدالة مباشرة من الـ Hook
      />
    </div>
  );
}