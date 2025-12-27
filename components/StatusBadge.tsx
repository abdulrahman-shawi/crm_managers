// components/StatusBadge.tsx
export const StatusBadge = ({ isActive }: { isActive: true | false }) => {
  const styles = {
    true: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    false: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[isActive.toString() as "true" | "false"]}}`}>
      {isActive === true ? "نشط" : "محظور"}
    </span>
  );
};