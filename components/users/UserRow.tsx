// components/users/UserRow.tsx
import { StatusBadge } from "@/components/StatusBadge";
import { UltraDropdown } from "@/components/UltraDropdown";

export const UserRow = ({ user, isEditing, editForm, setEditForm, onSave, onCancel, onEdit, onDelete }: any) => {
  if (isEditing) {
    return (
      <tr className="bg-blue-50/50 dark:bg-slate-800/40 transition-colors">
        <td className="px-6 py-4 space-y-2">
          <input
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            className="w-full px-2 py-1.5 text-sm rounded border dark:bg-slate-900"
            placeholder="الاسم"
          />
          <input
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            className="w-full px-2 py-1.5 text-sm rounded border dark:bg-slate-900"
            placeholder="الإيميل"
          />
        </td>
        <td className="px-6 py-4">
          <select
            value={editForm.role}
            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            className="w-full px-2 py-1.5 text-sm rounded border dark:bg-slate-900"
          >
            <option value="USER">مستخدم</option>
            <option value="MANAGER">محرر</option>
            <option value="ADMIN">مدير</option>
          </select>
        </td>
        <td className="px-6 py-4">
          <select
            value={editForm.isActive ? "true" : "false"}
            onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === "true" })}
            className="w-full px-2 py-1.5 text-sm rounded border dark:bg-slate-900"
          >
            <option value="true">نشط</option>
            <option value="false">غير نشط</option>
          </select>
        </td>
        <td className="px-6 py-4 text-left">
          <div className="flex gap-2 justify-end">
            <button onClick={() => onSave(user.id)} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">حفظ</button>
            <button onClick={onCancel} className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500">إلغاء</button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded italic">{user.role}</span>
      </td>
      <td className="px-6 py-4">
        <StatusBadge isActive={user.isActive} />
      </td>
      <td className="px-6 py-4 text-left">
        {/* هنا يظهر زر الحذف والتحرير */}
        <UltraDropdown 
        texttrue={false}
          onEdit={() => onEdit(user)} 
          onDelete={() => onDelete(user.email)} 
        />
      </td>
    </tr>
  );
};