import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import * as React from 'react';



const AnalycisInvoices = ({ openingBalance, netBalance, totalRevenues, totalExpenses, monthlyNetProfit }: any) => {
  return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* رصيد الحساب الحالي */}
                <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl">
                    <p className="text-blue-100 text-sm font-medium">رصيد الحساب الحالي = مبلغ الافتتاح + المقبوضات - المدفوعات</p>
                    <h2 className="text-4xl font-black mt-2 font-sans">
                        ل.س{netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h2>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">مبلغ فتح الحساب</p>
                        <h3 className="text-2xl font-black text-blue-600 font-sans">
                            ل.س{openingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600">
                        <ArrowDownLeft size={30} />
                    </div>
                </div>

                {/* إجمالي المقبوضات */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">إجمالي المقبوضات (حسب الفلتر)</p>
                        <h3 className="text-2xl font-black text-emerald-600 font-sans">
                            ل.س{totalRevenues.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600">
                        <ArrowDownLeft size={30} />
                    </div>
                </div>

                {/* إجمالي المدفوعات */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">إجمالي المدفوعات (حسب الفلتر)</p>
                        <h3 className="text-2xl font-black text-red-600 font-sans">
                            ل.س{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600">
                        <ArrowUpRight size={30} />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">صافي ربح المبيعات (حسب الفلتر)</p>
                        <h3 className={`text-2xl font-black font-sans ${monthlyNetProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                            ل.س{monthlyNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className={`p-4 rounded-2xl ${monthlyNetProfit >= 0 ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-red-50 dark:bg-red-900/20 text-red-600"}`}>
                        <ArrowDownLeft size={30} />
                    </div>
                </div>
            </div>
  );
};

export default AnalycisInvoices;
