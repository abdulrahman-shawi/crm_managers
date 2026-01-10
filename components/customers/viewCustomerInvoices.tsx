import { motion } from 'framer-motion';
import { Mail, MapPin, Phone , History, X } from 'lucide-react';
import * as React from 'react';

interface IViewCustomerInvoicesProps {
    customerdata:any
}

const ViewCustomerInvoices: React.FunctionComponent<IViewCustomerInvoicesProps> = (props) => {
    const {
    viewingCustomer, setViewingCustomer,

  } = props.customerdata;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 dark:shadow-none">
                    {viewingCustomer.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold dark:text-white">{viewingCustomer.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Mail size={12}/> {viewingCustomer.email}</p>
                  </div>
                </div>
                <button onClick={() => setViewingCustomer(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <Phone size={18} className="text-blue-500" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">الهاتف</p>
                      <p className="text-sm font-bold dark:text-white">{viewingCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <MapPin size={18} className="text-red-500" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">العنوان</p>
                      <p className="text-sm font-bold dark:text-white truncate">{viewingCustomer.address || "غير محدد"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold flex items-center gap-2 dark:text-white"><History size={18} className="text-blue-600"/> سجل الفواتير</h4>
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-lg font-bold">
                      {viewingCustomer.invoices?.length || 0} عملية
                    </span>
                  </div>

                  <div className="max-h-[250px] overflow-y-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                    <table className="w-full text-right text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-slate-500 font-bold">التاريخ</th>
                          <th className="px-4 py-3 text-slate-500 font-bold">الحالة</th>
                          <th className="px-4 py-3 text-slate-500 font-bold">المبلغ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {viewingCustomer.invoices && viewingCustomer.invoices.length > 0 ? (
                          viewingCustomer.invoices.map((inv: any) => (
                            <tr key={inv.id} className="dark:text-slate-300">
                              <td className="px-4 py-3">{new Date(inv.date).toLocaleDateString("ar-EG")}</td>
                              <td className="px-4 py-3">
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">مكتملة</span>
                              </td>
                              <td className="px-4 py-3 font-bold">{inv.totalAmount.toLocaleString()} ر.س</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="px-4 py-10 text-center text-slate-400 italic">لا توجد فواتير</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                <button onClick={() => setViewingCustomer(null)} className="px-6 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold dark:text-white hover:bg-slate-50 transition-all">إغلاق</button>
              </div>
            </motion.div>
          </div>
  );
};

export default ViewCustomerInvoices;
