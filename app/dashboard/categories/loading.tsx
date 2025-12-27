export default function Loading() {
  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-48"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl w-32"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-slate-100 dark:bg-slate-800 animate-pulse p-6 rounded-[2rem] h-32 w-full"></div>
        ))}
      </div>
    </div>
  );
}