import { Edit3, Trash2 } from 'lucide-react';
import * as React from 'react';

interface ICustomerTableProps {
    customerdata:any
}

const CustomerTable: React.FunctionComponent<ICustomerTableProps> = (props) => {
    const {
    customers,
    setViewingCustomer,
    openEditModal,
    handleDelete,
  } = props.customerdata;
  return (
    <div className="">
        <table className="w-full text-right">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-bold uppercase">
                      <tr>
                        <th className="px-6 py-4">العميل</th>
                        <th className="px-6 py-4">رقم الهاتف</th>
                        <th className="px-6 py-4 text-left">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {customers.length > 0 ? (
                        customers.map((customer:any) => (
                          <tr 
                            key={customer.id} 
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer group transition-colors"
                            onClick={() => setViewingCustomer(customer)}
                          >
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                {customer.name}
                              </div>
                              <div className="text-xs text-slate-500">{customer.email}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-sm">
                              {customer.phone}
                            </td>
                            <td className="px-6 py-4 text-left flex justify-end gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); openEditModal(customer); }} 
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                title="تعديل"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(customer.id); }} 
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                title="حذف"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                            لا يوجد عملاء مسجلين حالياً
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
    </div>
  );
};

export default CustomerTable;
