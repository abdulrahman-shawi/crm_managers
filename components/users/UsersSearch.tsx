import { Search } from "lucide-react";

export const UsersSearch = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="bg-white dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="ابحث عن طريق الاسم أو البريد الإلكتروني..."
            className="w-full pr-10 pl-4 py-2.5 bg-transparent outline-none text-sm"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
);
