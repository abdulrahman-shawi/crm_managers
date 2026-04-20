import { Eye } from "lucide-react";

export default function InvoicesTable({invoices} : any) {
    const {
        activeTab,
        setActiveTab,
        isModalOpen,
        setIsModalOpen,
        isViewOpen,
        setIsViewOpen,
        selectedInvoice,
        setSelectedInvoice,
        revenues,
        expenses,
        isLoading,
        totalRevenues,
        totalExpenses,
        netBalance,
        getStatusStyle,
    } = invoices;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-x-auto border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-right">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="px-8 py-5">الرقم المرجعي</th>
                            <th className="px-8 py-5">{activeTab === "revenue" ? "العميل" : "المورد"}</th>
                            <th className="px-8 py-5">البيان</th>
                            <th className="px-8 py-5">الحالة</th>
                            <th className="px-8 py-5">المبلغ الكلي</th>
                            <th className="px-8 py-5 text-left">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* حالة التحميل */}
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-400">جاري تحميل البيانات...</td>
                            </tr>
                        ) : (activeTab === "revenue" ? revenues : expenses).length === 0 ? (
                            /* حالة عدم وجود بيانات */
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-400">لا توجد فواتير لعرضها</td>
                            </tr>
                        ) : (
                            /* عرض البيانات */
                            (activeTab === "revenue" ? revenues : expenses).map((item:any) => (
                                <tr key={item.id} className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-8 py-5 font-mono text-sm font-bold text-blue-600">{item.id}</td>
                                    <td className="px-8 py-5 font-bold">{item.party}</td>
                                    <td className="px-8 py-5 text-sm font-bold text-slate-600">{item.category}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${getStatusStyle(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className={`px-8 py-5 font-black font-sans ${activeTab === "revenue" ? "text-emerald-600" : "text-red-600"}`}>
                                        ل.س{item.amount}
                                    </td>
                                    <td className="px-8 py-5 text-left">
                                        <button
                                            onClick={() => { setSelectedInvoice(item); setIsViewOpen(true); }}
                                            className="p-2 text-slate-400 hover:text-blue-600 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl"
                                        >
                                            <Eye size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
  );
}