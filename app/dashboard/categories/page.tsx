import * as React from 'react';
// تأكد أن هذا المكون يحتوي على "use client"
import { Metadata } from "next";
import CategoriesPage2 from './page2';

// هذا الجزء يعمل في الـ Server Component فقط (وهو المطلوب للـ SEO)
export const metadata: Metadata = {
  title: "إدارة الفئات",
  description: "عرض وتعديل بيانات الفئات في النظام",
};


export default function CategoriesPage() {
  return (
    <div className="w-full">
       {/* استدعاء مكون الـ Client الذي يحتوي على الـ Logic والجدول */}
      <CategoriesPage2 />
    </div>
  );
}