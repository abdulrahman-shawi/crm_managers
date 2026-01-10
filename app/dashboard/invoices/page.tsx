import * as React from 'react';
// تأكد أن هذا المكون يحتوي على "use client"
import { Metadata } from "next";
import InvoicesDashboard from './invoicesDashboard';

// هذا الجزء يعمل في الـ Server Component فقط (وهو المطلوب للـ SEO)
export const metadata: Metadata = {
  title: "إدارة الفواتير",
  description: "عرض وتعديل بيانات الفئات في النظام",
};


export default function InvoicesPage() {
  return (
    <div className="w-full">
       {/* استدعاء مكون الـ Client الذي يحتوي على الـ Logic والجدول */}
      <InvoicesDashboard />
    </div>
  );
}