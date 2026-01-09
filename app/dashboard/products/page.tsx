import * as React from 'react';
// تأكد أن هذا المكون يحتوي على "use client"
import { Metadata } from "next";
import Productslayout from './productlayout';
import { getGeneralSettings } from '@/lib/settings';

// هذا الجزء يعمل في الـ Server Component فقط (وهو المطلوب للـ SEO)
export const metadata: Metadata = {
  title: "إدارة المنتجات و المخزون",
  description: "عرض وتعديل بيانات الفئات في النظام",
};


export default async function ProductPage() {
    const settings = await getGeneralSettings();
  return (
    <div className="w-full">
       {/* استدعاء مكون الـ Client الذي يحتوي على الـ Logic والجدول */}
      <Productslayout current={settings?.currency} />
    </div>
  );
}