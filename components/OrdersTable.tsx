// components/OrdersTable.tsx
export const OrdersTable = () => {
  const orders = [
    { id: "#1254", customer: "سارة أحمد", date: "2023-10-01", amount: "$120.00", status: "مكتمل" },
    { id: "#1255", customer: "خالد علي", date: "2023-10-02", amount: "$85.50", status: "قيد المعالجة" },
  ];

  return (
    <div className="mt-8 bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
      <h2 className="text-lg font-bold mb-4">أحدث الطلبات</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-sm">
              <th className="pb-3 pr-2">رقم الطلب</th>
              <th className="pb-3">العميل</th>
              <th className="pb-3">التاريخ</th>
              <th className="pb-3">المبلغ</th>
              <th className="pb-3">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
            {orders.map((order) => (
              <tr key={order.id} className="text-sm text-slate-600 dark:text-slate-300">
                <td className="py-4 pr-2 font-medium text-blue-600">{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>{order.amount}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-[10px] ${
                    order.status === "مكتمل" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};