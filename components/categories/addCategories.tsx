import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import * as React from 'react';

interface IAddCategoriesProps {
    useCategories:any
}

const AddCategories: React.FunctionComponent<IAddCategoriesProps> = (props) => {
    const {
    isEditing,
    currentCat,
    handleSave,
    setIsOpen,
    setCurrentCat
  } = props.useCategories;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{isEditing ? "تعديل القسم" : "إضافة قسم جديد"}</h2>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-900"><X /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold px-1 text-slate-700 dark:text-slate-300">اسم القسم</label>
                  <input
                    type="text"
                    value={currentCat.name}
                    onChange={(e) => setCurrentCat({ ...currentCat, name: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                    placeholder="مثال: إلكترونيات..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold px-1 text-slate-700 dark:text-slate-300">الوصف</label>
                  <input
                    type="text"
                    value={currentCat.description || ""}
                    onChange={(e) => setCurrentCat({ ...currentCat, description: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                    placeholder="وصف مختصر للقسم..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                  >
                    <Check size={20} />
                    {isEditing ? "حفظ التغييرات" : "إضافة الآن"}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold text-slate-600 dark:text-slate-300"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
  ) ;
};

export default AddCategories;
