import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import * as React from 'react';



const AnalycisInvoices = ({netBalance , totalRevenues , totalExpenses}:any) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* صافي الرصيد */}
                <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl">
                    <p className="text-blue-100 text-sm font-medium">صافي الرصيد الحالي</p>
                    <h2 className="text-4xl font-black mt-2 font-sans">
                        ل.س{netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h2>
                </div>

                {/* إجمالي المقبوضات */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">إجمالي المقبوضات</p>
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
                        <p className="text-slate-500 text-sm font-medium">إجمالي المدفوعات</p>
                        <h3 className="text-2xl font-black text-red-600 font-sans">
                            ل.س{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600">
                        <ArrowUpRight size={30} />
                    </div>
                </div>
            </div>
  );
};

export default AnalycisInvoices;
