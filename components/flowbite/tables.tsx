"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export interface FlowbiteTableColumn<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => ReactNode;
  searchable?: boolean;
  sortable?: boolean;
}

export function TableHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function TableFooter({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <nav aria-label="التنقل بين صفحات الجدول" className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm dark:border-slate-800">
      <span className="text-slate-500">صفحة {page} من {pageCount}</span>
      <div className="flex gap-2">
        <button
          aria-label="الصفحة السابقة"
          className="rounded-lg border border-slate-300 p-2 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          type="button"
        >
          <ChevronRight size={17} />
        </button>
        <button
          aria-label="الصفحة التالية"
          className="rounded-lg border border-slate-300 p-2 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          <ChevronLeft size={17} />
        </button>
      </div>
    </nav>
  );
}

export function FlowbiteDataTable<T extends Record<string, unknown>>({
  title,
  description,
  columns,
  rows,
  pageSize = 5,
  emptyMessage = "لا توجد بيانات مطابقة.",
}: {
  title: string;
  description?: string;
  columns: FlowbiteTableColumn<T>[];
  rows: T[];
  pageSize?: number;
  emptyMessage?: string;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortAscending, setSortAscending] = useState(true);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const filtered = normalizedQuery
      ? rows.filter((row) =>
          columns.some((column) => {
            if (column.searchable === false) return false;
            const value = row[column.key];
            return value !== null && value !== undefined &&
              String(value).toLocaleLowerCase().includes(normalizedQuery);
          }),
        )
      : rows;

    if (sortKey === null) return filtered;
    return [...filtered].sort((left, right) => {
      const leftValue = left[sortKey];
      const rightValue = right[sortKey];
      const result = String(leftValue ?? "").localeCompare(String(rightValue ?? ""), undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return sortAscending ? result : -result;
    });
  }, [columns, query, rows, sortAscending, sortKey]);

  const safePageSize = Math.max(1, Math.floor(pageSize));
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / safePageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleRows = filteredRows.slice((currentPage - 1) * safePageSize, currentPage * safePageSize);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortAscending((ascending) => !ascending);
    } else {
      setSortKey(key);
      setSortAscending(true);
    }
    setPage(1);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <TableHeader
        actions={
          <label className="flex min-w-56 items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-slate-500 dark:border-slate-700">
            <Search aria-hidden="true" size={17} />
            <input
              aria-label="البحث في الجدول"
              className="w-full bg-transparent text-sm text-slate-900 outline-none dark:text-white"
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="بحث..."
              value={query}
            />
          </label>
        }
        description={description}
        title={title}
      />
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
            <tr>
              {columns.map((column) => (
                <th className="whitespace-nowrap px-5 py-3 font-bold" key={String(column.key)} scope="col">
                  {column.sortable === false ? column.label : (
                    <button
                      className="inline-flex items-center gap-1"
                      onClick={() => handleSort(column.key)}
                      type="button"
                    >
                      {column.label}
                      {sortKey === column.key && <span aria-hidden="true">{sortAscending ? "↑" : "↓"}</span>}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {visibleRows.map((row, rowIndex) => (
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50" key={rowIndex}>
                {columns.map((column) => (
                  <td className="whitespace-nowrap px-5 py-4 text-slate-700 dark:text-slate-200" key={String(column.key)}>
                    {column.render ? column.render(row) : String(row[column.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
            {visibleRows.length === 0 && (
              <tr><td className="px-5 py-12 text-center text-slate-500" colSpan={columns.length}>{emptyMessage}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <TableFooter onPageChange={setPage} page={currentPage} pageCount={pageCount} />
    </section>
  );
}
