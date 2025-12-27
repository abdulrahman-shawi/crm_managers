"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, User, Shield, Trash, ExternalLink, Eye, Edit, Trash2 } from "lucide-react";

interface DropdownProps {
  onDelete: () => void;
  onEdit?: () => void;
  onView?: () => void;
  textview?:string;
  texttrue?:boolean;
}

export const UltraDropdown = ({ onDelete, onEdit, onView, textview , texttrue = true }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // ... (كود الـ ref والـ AnimatePresence)

  return (
    <div className="relative inline-block text-right">
       <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
         <MoreHorizontal size={20} />
       </button>

       {isOpen && (
         <motion.div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="p-1.5 space-y-1">
              {/* زر العرض */}
{ textview && (
              <button onClick={() => { onView?.(); setIsOpen(false); }} className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <Eye size={16} className="text-green-500" /> {textview}
              </button>
              )}

              {/* زر التعديل */}
              <button onClick={() => { onEdit?.(); setIsOpen(false); }} className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <Edit size={16} className="text-amber-500" /> تعديل البيانات
              </button>

              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

              {/* زر الحذف */}
              <button onClick={() => { onDelete(); setIsOpen(false); }} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium">
                <Trash2 size={16} /> حذف نهائي
              </button>
            </div>
         </motion.div>
       )}
    </div>
  );
}

// مكون داخلي للعنصر لتقليل تكرار الكود
const DropdownItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-200 hover:translate-x-[-4px]">
    <span className="text-slate-400 group-hover:text-blue-500">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);