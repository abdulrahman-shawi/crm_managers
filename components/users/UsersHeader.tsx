import { Users2, UserPlus } from "lucide-react";

export const UsersHeader = ({ onAdd }: { onAdd: () => void }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Users2 className="text-blue-600" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">إدارة المستخدمين</h1>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg active:scale-95 transition-all"
        >
          <UserPlus size={18} />
          <span className="font-medium">إضافة مستخدم جديد</span>
        </button>
      </div>
);
