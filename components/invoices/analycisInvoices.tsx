import { ArrowDownLeft, ArrowUpRight, CircleDollarSign } from 'lucide-react';
import * as React from 'react';



const AnalycisInvoices = ({ openingBalance, netBalance, totalRevenues, totalExpenses, totalOthers, monthlyNetProfit, canViewProfit }: any) => {
  const formatCurrency = (value: number) => `ل.س${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* رصيد الحساب الحالي */}
                <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl overflow-hidden">
                    <p className="text-blue-100 text-sm font-medium leading-6">رصيد الحساب الحالي = مبلغ الافتتاح + المقبوضات - المدفوعات + أخرى</p>
                    <h2 className="text-2xl sm:text-4xl font-black mt-2 font-sans break-words leading-tight">
                        {formatCurrency(netBalance)}
                    </h2>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center gap-4 justify-between shadow-sm overflow-hidden">
                    <div className="min-w-0 flex-1">
                        <p className="text-slate-500 text-sm font-medium">مبلغ فتح الحساب</p>
                        <h3 className="text-xl sm:text-2xl font-black text-blue-600 font-sans break-words leading-tight">
                            {formatCurrency(openingBalance)}
                        </h3>
                    </div>
                    <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 shrink-0">
                        <ArrowDownLeft size={26} />
                    </div>
                </div>

                {/* إجمالي المقبوضات */}
                <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center gap-4 justify-between shadow-sm overflow-hidden">
                    <div className="min-w-0 flex-1">
                        <p className="text-slate-500 text-sm font-medium">إجمالي المقبوضات (حسب الفلتر)</p>
                        <h3 className="text-xl sm:text-2xl font-black text-emerald-600 font-sans break-words leading-tight">
                            {formatCurrency(totalRevenues)}
                        </h3>
                    </div>
                    <div className="p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600 shrink-0">
                        <ArrowDownLeft size={26} />
                    </div>
                </div>

                {/* إجمالي المدفوعات */}
                <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center gap-4 justify-between shadow-sm overflow-hidden">
                    <div className="min-w-0 flex-1">
                        <p className="text-slate-500 text-sm font-medium">إجمالي المدفوعات (حسب الفلتر)</p>
                        <h3 className="text-xl sm:text-2xl font-black text-red-600 font-sans break-words leading-tight">
                            {formatCurrency(totalExpenses)}
                        </h3>
                    </div>
                    <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 shrink-0">
                        <ArrowUpRight size={26} />
                    </div>
                </div>

                {/* إجمالي أخرى */}
                <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center gap-4 justify-between shadow-sm overflow-hidden">
                    <div className="min-w-0 flex-1">
                        <p className="text-slate-500 text-sm font-medium">إجمالي أخرى (حسب الفلتر)</p>
                        <h3 className="text-xl sm:text-2xl font-black text-amber-600 font-sans break-words leading-tight">
                            {formatCurrency(totalOthers || 0)}
                        </h3>
                    </div>
                    <div className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl text-amber-600 shrink-0">
                        <CircleDollarSign size={26} />
                    </div>
                </div>

                {canViewProfit && (
                    <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center gap-4 justify-between shadow-sm overflow-hidden">
                        <div className="min-w-0 flex-1">
                            <p className="text-slate-500 text-sm font-medium">صافي ربح المبيعات (حسب الفلتر)</p>
                            <h3 className={`text-xl sm:text-2xl font-black font-sans break-words leading-tight ${monthlyNetProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                {formatCurrency(monthlyNetProfit)}
                            </h3>
                        </div>
                        <div className={`p-3 sm:p-4 rounded-2xl shrink-0 ${monthlyNetProfit >= 0 ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-red-50 dark:bg-red-900/20 text-red-600"}`}>
                            <ArrowDownLeft size={26} />
                        </div>
                    </div>
                )}
            </div>
  );
};

export default AnalycisInvoices;
