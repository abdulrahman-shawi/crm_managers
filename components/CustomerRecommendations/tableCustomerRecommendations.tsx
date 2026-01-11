import { AnimatePresence, motion } from 'framer-motion';
import { Quote, Star, Trash2, User } from 'lucide-react';
import * as React from 'react';

interface ICustomerRecommendationsTableProps {
    useCustomerRecommendations : any
}

const CustomerRecommendationsTable: React.FunctionComponent<ICustomerRecommendationsTableProps> = (props) => {
   const {
    testimonials,
    deleteTestimonial } = props.useCustomerRecommendations
    return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {testimonials.map((item : any) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative group"
            >
              <Quote className="absolute top-6 left-6 text-blue-100 dark:text-blue-900/20" size={50} />
              
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < item.rating ? "currentColor" : "none"} stroke="currentColor" />
                ))}
              </div>

              <p className="text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed relative z-10">
                "{item.text}"
              </p>

              <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-400">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-[11px] text-slate-500 uppercase tracking-wider">{item.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteTestimonial(item.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
  );
};

export default CustomerRecommendationsTable;
