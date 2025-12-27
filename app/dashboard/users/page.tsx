import * as React from 'react';
import UsersPage2 from './userpage'; // تأكد أن هذا المكون يحتوي على "use client"
import { Metadata } from "next";

// هذا الجزء يعمل في الـ Server Component فقط (وهو المطلوب للـ SEO)
export const metadata: Metadata = {
  title: "إدارة المستخدمين",
  description: "عرض وتعديل بيانات المستخدمين في النظام",
};


export default function UsersPage() {
  return (
    <div className="w-full">
       {/* استدعاء مكون الـ Client الذي يحتوي على الـ Logic والجدول */}
      <UsersPage2 />
    </div>
  );
}