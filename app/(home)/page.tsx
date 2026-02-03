'use client'
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const allProducts = [
    { id: 1, name: 'تيشيرت رياضي', size: 'XL' },
    { id: 2, name: 'قميص كاجوال', size: 'L' },
    { id: 3, name: 'هودي قطني', size: 'M' },
    { id: 4, name: 'جاكيت رسمي', size: 'XL' },
    { id: 5, name: 'سروال مريح', size: 'S' },
    { id: 6, name: 'قميص صيفي', size: 'L' },
  ];
  const [selectedSizes, setSelectedSizes] = useState<any>([]);
  const handleCheckboxChange = (size:any) => {
    if (selectedSizes.includes(size)) {
      // إذا كان المقاس موجوداً، نقوم بإزالته
      setSelectedSizes(selectedSizes?.filter(s => s !== size));
    } else {
      // إذا لم يكن موجوداً، نقوم بإضافته
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const filteredProducts = selectedSizes.length === 0
    ? allProducts // إذا لم يتم اختيار شيء، اعرض الكل
    : allProducts.filter(product => selectedSizes.includes(product.size));
  return (
<div className="">
      <section className="relative w-full h-[500px] md:h-[600px] bg-[#f4f4f4] flex items-center overflow-hidden">
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-xl space-y-4 md:space-y-6">
          {/* Subtitle */}
          <p className="text-[#c96] font-medium uppercase tracking-[0.2em] text-sm md:text-base animate-in fade-in slide-in-from-left duration-700">
            Season Web Discovery
          </p>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-[#333] leading-tight animate-in fade-in slide-in-from-left duration-1000 delay-200">
            New Arrivals <br /> 
            <span className="text-[#c96]">Spring Collection</span>
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-base md:text-lg max-w-md animate-in fade-in slide-in-from-left duration-1000 delay-300">
            Discover our latest collection with unique designs and premium materials. Up to 30% off on selected items.
          </p>

          {/* Call to Action Button */}
          <div className="pt-4 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
            <a 
              href="/shop" 
              className="group inline-flex items-center gap-3 bg-transparent border-2 border-[#c96] text-[#c96] px-8 py-3 font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:bg-[#c96] hover:text-white"
            >
              Shop Now
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Element (Optional) */}
      <div className="absolute bottom-10 right-10 hidden lg:block opacity-20">
        <span className="text-8xl font-bold text-gray-400 select-none">2024</span>
      </div>
    </section>
    <div className="">
      <div className="flex gap-4 mb-8 p-4 bg-gray-100 rounded-lg">
        {['S', 'M', 'L', 'XL'].map((size) => (
          <label key={size} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={selectedSizes.includes(size)}
              onChange={() => handleCheckboxChange(size)}
            />
            <span className="font-medium text-lg">{size}</span>
          </label>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="border p-4 rounded shadow-sm flex justify-between">
              <span>{product.name}</span>
              <span className="font-bold text-blue-600">{product.size}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">لا توجد منتجات تطابق هذا الاختيار.</p>
        )}
      </div>
    </div>
</div>
  );
};

export default Hero;