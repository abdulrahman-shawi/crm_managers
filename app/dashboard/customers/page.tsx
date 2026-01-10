import * as React from 'react';
import CustomerDashboard from './customerDashboard';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "إدارة العملاء",
  description: "عرض وتعديل بيانات الفئات في النظام",
};

const CustomerPage = () => {
  return (
    <CustomerDashboard />
  );
};

export default CustomerPage;
