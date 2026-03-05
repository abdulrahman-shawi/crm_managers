import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import * as React from 'react';
interface Category {
  id: number;
  name: string;
  userId: number;
  products?: any[];
}


interface ICategoriesTableProps {
    usecategories:any
}

const CategoriesTable: React.FunctionComponent<ICategoriesTableProps> = (props) => {
  const {
    categories,   
    openEditModal,
    handleDelete
  } = props.usecategories;
  const {user} = useAuth()
  const visibleCategories = user?.id
    ? categories.filter((e: Category) => Number(e.userId) === Number(user.id))
    : categories;
    return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCategories.map((cat:any) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-blue-500 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {(cat.products?.length || 0)} منتج مرتبط
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
    </div>
  );
};

export default CategoriesTable;
