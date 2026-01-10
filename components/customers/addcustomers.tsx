import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import * as React from 'react';

interface IAddCustomersProps {
    customerdata : any
}

const AddCustomers: React.FunctionComponent<IAddCustomersProps> = (props) => {
    const {
    customers, isModalOpen, setIsModalOpen,
    viewingCustomer, setViewingCustomer,
    editingId, formData, setFormData,
    openEditModal, closeModal,
    handleSave, handleDelete,
    toastType, setToastType
  } = props.customerdata;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold dark:text-white">
                  {editingId ? "تحديث بيانات العميل" : "إضافة عميل جديد"}
                </h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-red-500">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 mr-2 uppercase">الاسم بالكامل</label>
                  <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:border-blue-500 transition-all" placeholder="مثال: محمد أحمد" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 mr-2 uppercase">البريد الإلكتروني</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:border-blue-500 transition-all" placeholder="mail@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 mr-2 uppercase">رقم الهاتف</label>
                    <input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:border-blue-500 transition-all" placeholder="05xxxxxxxx" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 mr-2 uppercase">العنوان بالتفصيل</label>
                  <input required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl dark:text-white outline-none focus:border-blue-500 transition-all" placeholder="المدينة، الحي، الشارع" />
                </div>

                <button type="submit" className="w-full mt-4 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2">
                  <Save size={20} /> {editingId ? "حفظ التغييرات" : "تأكيد الإضافة"}
                </button>
              </form>
            </motion.div>
          </div>
  );
};

export default AddCustomers;
