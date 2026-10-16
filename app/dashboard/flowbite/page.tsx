"use client";

import { useState } from "react";
import {
  AccountOverview,
  CustomerCareCard,
  DiscountBanner,
  DiscountPopup,
  EcommerceOrdersTable,
  OrderConfirmationCard,
  OrderSummary,
  OrderTracking,
  PaymentMethods,
  ProductCard,
  ProductCategoryGrid,
  ProductDetails,
  ProductGrid,
  ProductReviews,
  RefundRequestForm,
  RefundStatusCard,
  ReviewsHistory,
  sampleProducts,
  ServiceRepairForm,
  ShoppingCart,
  StorefrontFooter,
  StorefrontHero,
  StorefrontNavbar,
  WarrantyCard,
} from "@/components/flowbite/ecommerce";
import { PricingCards, PricingComparison } from "@/components/flowbite/pricing";
import {
  FlowbiteDataTable,
  TableFooter,
  TableHeader,
} from "@/components/flowbite/tables";

const demoRows: Record<string, string | number>[] = [
  { id: "PR-101", product: "سماعات لاسلكية", category: "إلكترونيات", stock: 42, price: 249 },
  { id: "PR-102", product: "ساعة ذكية", category: "إلكترونيات", stock: 18, price: 399 },
  { id: "PR-103", product: "حقيبة يومية", category: "إكسسوارات", stock: 27, price: 179 },
  { id: "PR-104", product: "لوحة مفاتيح", category: "إلكترونيات", stock: 9, price: 220 },
  { id: "PR-105", product: "حامل مكتبي", category: "إكسسوارات", stock: 31, price: 89 },
  { id: "PR-106", product: "مصباح ذكي", category: "المنزل", stock: 14, price: 135 },
];

const demoColumns = [
  { key: "id", label: "الرمز" },
  { key: "product", label: "المنتج" },
  { key: "category", label: "التصنيف" },
  { key: "stock", label: "المخزون" },
  {
    key: "price",
    label: "السعر",
    render: (row: Record<string, string | number>) => `${row.price} ر.س`,
  },
];

function ShowcaseSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-24 space-y-5" id={id}>
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export default function FlowbiteShowcasePage() {
  const [footerPage, setFooterPage] = useState(1);

  return (
    <div className="mx-auto max-w-6xl space-y-12 pb-12" dir="rtl">
      <header className="rounded-3xl bg-gradient-to-l from-blue-700 to-indigo-800 p-7 text-white sm:p-10">
        <p className="text-sm font-bold text-blue-200">مكتبة المكونات</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">معاينة بلوكات المتجر والجداول والأسعار</h1>
        <p className="mt-3 max-w-3xl leading-7 text-blue-100">
          صفحة تجمع المكوّنات التي أُنشئت داخل المشروع، مع بيانات تجريبية لتسهيل معاينتها.
        </p>
        <nav aria-label="أقسام صفحة المعاينة" className="mt-6 flex flex-wrap gap-2">
          {[
            ["store", "المتجر"],
            ["orders", "الطلبات"],
            ["account", "الحساب والخدمات"],
            ["tables", "الجداول"],
            ["pricing", "الأسعار"],
          ].map(([id, label]) => (
            <a className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20" href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <ShowcaseSection id="store" title="واجهة المتجر والمنتجات" description="التنقل، واجهة البداية، التصنيفات وعرض تفاصيل المنتجات.">
        <div className="space-y-6">
          <StorefrontNavbar storeName="متجر Flowbite" cartCount={2} />
          <StorefrontHero />
          <ProductCategoryGrid />
          <ProductCard product={sampleProducts[0]} />
          <ProductGrid />
          <ProductDetails />
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="checkout" title="السلة والدفع" description="بلوكات السلة، ملخص الطلب، بيانات التوصيل وخيارات الدفع.">
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <ShoppingCart />
          <div className="space-y-5">
            <OrderSummary />
            <PaymentMethods />
            <CheckoutForm />
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="orders" title="الطلبات والاسترجاع" description="عرض الطلبات وحالتها، تأكيد الطلب، وتتبع الشحن والاسترجاع.">
        <div className="space-y-5">
          <EcommerceOrdersTable />
          <div className="grid items-start gap-5 lg:grid-cols-2">
            <OrderTracking />
            <OrderConfirmationCard />
            <RefundRequestForm />
            <ServiceRepairForm />
            <RefundStatusCard />
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="account" title="الحساب والتقييمات والخدمات" description="ملخص الحساب، سجل التقييمات، الدعم والضمان والعروض.">
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <AccountOverview />
          <ReviewsHistory />
          <ProductReviews />
          <CustomerCareCard />
          <WarrantyCard />
          <DiscountBanner />
          <DiscountPopup />
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="tables" title="مكوّنات الجداول" description="رأس الجدول والتذييل، وجدول قابل للبحث والترتيب والتنقل بين الصفحات.">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <TableHeader
            description="بيانات تجريبية للمخزون"
            title="معاينة رأس الجدول"
          />
          <TableFooter onPageChange={setFooterPage} page={footerPage} pageCount={3} />
        </div>
        <FlowbiteDataTable
          columns={demoColumns}
          description="ابحث في البيانات، أو اضغط عنوان عمود للترتيب."
          pageSize={4}
          rows={demoRows}
          title="جدول المنتجات"
        />
      </ShowcaseSection>

      <ShowcaseSection id="pricing" title="خطط الأسعار" description="بطاقات الاشتراك ومقارنة مزايا الخطط.">
        <div className="space-y-8">
          <PricingCards />
          <PricingComparison />
        </div>
      </ShowcaseSection>

      <StorefrontFooter storeName="متجر Flowbite" />
    </div>
  );
}
