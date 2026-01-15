// components/shared/DataTable.tsx
'use client';

import React from 'react';
import { UltraDropdown } from '../UltraDropdown';

// تعريف الأعمدة بشكل ديناميكي
export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}


interface DataTableProps<T extends { id: string | number; email:string ; item:any }> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  error?: string | null;
  onRowClick?: (item: T) => void;
  onEdit?: (id: T['item']) => void;
  onDelete?: (email: T['email']) => void;
}

export default function DataTable<T extends { id: string | number; email:string ; item:any }>({
  data,
  columns,
  isLoading,
  emptyMessage = 'لا توجد بيانات لعرضها',
  error,
  onRowClick,
  onEdit,
  onDelete
}: DataTableProps<T>) {

  // 1. حالة التحميل
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center animate-pulse bg-gray-50 rounded-lg">
        <p className="text-gray-500">جاري تحميل البيانات...</p>
      </div>
    );
  }

  // 2. حالة الخطأ
  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  // 3. الحالة الفارغة
  if (data.length === 0) {
    return (
      <div className="text-center p-12 border-2 border-dashed rounded-lg text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-4 font-bold">
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-4 font-bold text-left">
                الإجراءات
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${onRowClick ? 'cursor-pointer' : ''
                  }`}
              >
                {columns.map((col, idx) => (
                  <td key={idx} className="p-4 text-sm text-gray-600">
                    {typeof col.accessor === 'function'
                      ? col.accessor(item)
                      : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}

                  <td
                    className="p-4 text-sm space-x-reverse space-x-2"
                    onClick={(e) => e.stopPropagation()} // مهم جدًا
                  >
                    <UltraDropdown
                      texttrue={false}
                      onEdit={
                        onEdit
                          ? () => onEdit?.(item)
                          : undefined
                      }
                      onDelete={
                        onDelete
                          ? () => onDelete?.(item.email)
                          : () => { }
                      }
                    />
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
