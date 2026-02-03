// app/dashboard/layout.tsx
"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { Heart, Phone, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {


  return (
    <div 
      className="" 
      dir="rtl"
    >
      <header className="w-full font-sans">
      {/* 1. Top Bar - شريط علوي للمعلومات */}
      <div className="bg-[#333] text-white text-xs py-2 px-4 md:px-10 flex justify-between items-center border-b border-gray-700">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <Phone size={14} className="text-[#c96]" /> 
            Call: +0123 456 789
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/wishlist" className="hover:text-[#c96] transition">Wishlist</Link>
          <Link href="/about" className="hover:text-[#c96] transition">About Us</Link>
          <Link href="/login" className="hover:text-[#c96] transition flex items-center gap-1">
            <User size={14} /> Login
          </Link>
        </div>
      </div>

      {/* 2. Middle Bar - الشعار والبحث والسلة */}
      <div className="bg-white py-6 px-4 md:px-10 flex justify-between items-center border-b">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <h1 className="text-3xl font-bold text-[#333]">MOLLA</h1>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-10 relative">
          <input 
            type="text" 
            placeholder="Search product ..." 
            className="w-full bg-white border-2 border-[#c96] rounded-full py-2 px-5 outline-none text-sm"
          />
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c96]">
            <Search size={20} />
          </button>
        </div>

        {/* Icons Area */}
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer group">
             <Heart size={26} className="text-[#333] group-hover:text-[#c96]" />
             <span className="absolute -top-2 -right-2 bg-[#c96] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">0</span>
          </div>
          
          <div className="relative cursor-pointer group">
             <ShoppingCart size={26} className="text-[#333] group-hover:text-[#c96]" />
             <span className="absolute -top-2 -right-2 bg-[#c96] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">2</span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar - قائمة التنقل الرئيسية */}
      <nav className="bg-white py-6 px-4 md:px-10 flex items-center justify-center shadow-sm">

        <ul className="hidden lg:flex gap-8 text-sm font-bold text-[#333] uppercase tracking-wide">
          <li><Link href="/" className="text-[#c96]">Home</Link></li>
          <li className="hover:text-[#c96] transition cursor-pointer">Shop</li>
          <li className="hover:text-[#c96] transition cursor-pointer">Product</li>
          <li className="hover:text-[#c96] transition cursor-pointer">Pages</li>
          <li className="hover:text-[#c96] transition cursor-pointer">Blog</li>
        </ul>
      </nav>
    </header>
      {children}
    </div>
  );
}