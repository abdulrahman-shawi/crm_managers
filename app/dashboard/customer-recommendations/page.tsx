"use client";
import { MessageSquareQuote, Plus } from "lucide-react";

import { useCustomers } from "@/hooks/customers";
import { useCustomerRecommendations } from "@/hooks/customer-recommendations";
import CustomerRecommendationsTable from "@/components/CustomerRecommendations/tableCustomerRecommendations";
import { AddTestimonialModal } from "@/components/CustomerRecommendations/addtestimonial";



export default function CustomerRecommendationsPage() {
  const customerRecommendations = useCustomerRecommendations()
  const {
    testimonials, setTestimonials,
    isModalOpen, setIsModalOpen, } = customerRecommendations
  const { customers } = useCustomers()

  return (
    <div className="space-y-8" dir="rtl">
      {/* الرأس */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <MessageSquareQuote className="text-blue-600" /> توصيات العملاء
          </h1>
          <p className="text-sm text-slate-500 mt-1">إدارة آراء العملاء التي تظهر في واجهة الموقع</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus size={20} /> إضافة توصية جديدة
        </button>
      </div>

      {/* شبكة التوصيات */}
      <CustomerRecommendationsTable useCustomerRecommendations={customerRecommendations} />

      {/* المودال الخاص بإضافة التوصية */}
      <AddTestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(newT: any) => setTestimonials([newT, ...testimonials])}
        customers={customers}
        customerRecommendations = {customerRecommendations}
      />
    </div>
  );
}