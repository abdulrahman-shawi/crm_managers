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
        others,
        isLoading,
        totalRevenues,
        totalExpenses,
        totalOthers,
        netBalance,
        getStatusStyle,
    } = invoices;
        const currentItems = activeTab === "revenue" ? revenues : activeTab === "expenses" ? expenses : others;
  return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-right min-w-[760px]">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="px-8 py-5">الرقم المرجعي</th>
                            <th className="px-8 py-5">{activeTab === "revenue" ? "العميل" : activeTab === "expenses" ? "المورد" : "الطرف"}</th>
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
                        ) : currentItems.length === 0 ? (
                            /* حالة عدم وجود بيانات */
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-400">لا توجد فواتير لعرضها</td>
                            </tr>
                        ) : (
                            /* عرض البيانات */
                            currentItems.map((item:any) => (
                                <tr key={item.id} className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-8 py-5 font-mono text-sm font-bold text-blue-600">{item.id}</td>
                                    <td className="px-8 py-5 font-bold">{item.party}</td>
                                    <td className="px-8 py-5 text-sm font-bold text-slate-600">{item.category}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${getStatusStyle(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className={`px-8 py-5 font-black font-sans ${activeTab === "revenue" ? "text-emerald-600" : activeTab === "expenses" ? "text-red-600" : "text-amber-600"}`}>
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

                <div className="md:hidden p-3 space-y-3">
                    {isLoading ? (
                        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 px-4 py-8 text-center text-slate-400">جاري تحميل البيانات...</div>
                    ) : currentItems.length === 0 ? (
                        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 px-4 py-8 text-center text-slate-400">لا توجد فواتير لعرضها</div>
                    ) : (
                        currentItems.map((item: any) => (
                            <div key={item.id} className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-4 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-black text-slate-400 mb-1">الرقم المرجعي</p>
                                        <p className="font-mono text-sm font-black text-blue-600 break-all">{item.id}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black shrink-0 ${getStatusStyle(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-3 text-sm">
                                    <div className="rounded-2xl bg-white dark:bg-slate-900 px-4 py-3">
                                        <p className="text-[11px] font-black text-slate-400 mb-1">{activeTab === "revenue" ? "العميل" : activeTab === "expenses" ? "المورد" : "الطرف"}</p>
                                        <p className="font-bold text-slate-800 dark:text-slate-100 break-words">{item.party}</p>
                                    </div>
                                    <div className="rounded-2xl bg-white dark:bg-slate-900 px-4 py-3">
                                        <p className="text-[11px] font-black text-slate-400 mb-1">البيان</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-200 break-words">{item.category}</p>
                                    </div>
                                    <div className="rounded-2xl bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-black text-slate-400 mb-1">المبلغ الكلي</p>
                                            <p className={`font-black font-sans ${activeTab === "revenue" ? "text-emerald-600" : activeTab === "expenses" ? "text-red-600" : "text-amber-600"}`}>
                                                ل.س{item.amount}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => { setSelectedInvoice(item); setIsViewOpen(true); }}
                                            className="p-3 text-slate-400 hover:text-blue-600 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl shrink-0"
                                        >
                                            <Eye size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
  );
}