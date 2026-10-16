import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Headset,
  Heart,
  MapPin,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";

export interface StoreProduct {
  id: string | number;
  name: string;
  category: string;
  price: number;
  previousPrice?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
  color?: string;
}

export const sampleProducts: StoreProduct[] = [
  {
    id: 1,
    name: "سماعات لاسلكية",
    category: "الإلكترونيات",
    price: 249,
    previousPrice: 299,
    rating: 4.8,
    reviews: 128,
    badge: "الأكثر مبيعًا",
    color: "from-indigo-100 to-violet-200",
  },
  {
    id: 2,
    name: "ساعة ذكية",
    category: "الإلكترونيات",
    price: 399,
    rating: 4.6,
    reviews: 86,
    color: "from-amber-100 to-orange-200",
  },
  {
    id: 3,
    name: "حقيبة يومية",
    category: "الإكسسوارات",
    price: 179,
    rating: 4.9,
    reviews: 54,
    badge: "جديد",
    color: "from-emerald-100 to-teal-200",
  },
];

const formatPrice = (amount: number, currency = "ر.س") =>
  `${new Intl.NumberFormat("ar-SA").format(amount)} ${currency}`;

const cardClass =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900";

export function StorefrontNavbar({
  storeName = "متجري",
  cartCount = 2,
}: {
  storeName?: string;
  cartCount?: number;
}) {
  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 sm:px-6">
        <a className="shrink-0 text-xl font-black text-slate-900 dark:text-white" href="#">
          {storeName}
        </a>
        <nav className="hidden items-center gap-5 text-sm text-slate-600 dark:text-slate-300 md:flex">
          <a href="#">الرئيسية</a>
          <a href="#">المنتجات</a>
          <a href="#">العروض</a>
          <a href="#">تواصل معنا</a>
        </nav>
        <label className="ml-auto hidden min-w-40 flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-500 dark:bg-slate-800 sm:flex">
          <Search aria-hidden="true" size={17} />
          <input
            aria-label="ابحث في المتجر"
            className="w-full bg-transparent text-sm outline-none"
            placeholder="ابحث عن منتج..."
          />
        </label>
        <button
          aria-label="المفضلة"
          className="hidden rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:inline-flex"
          type="button"
        >
          <Heart size={20} />
        </button>
        <button
          aria-label={`سلة التسوق، ${cartCount} منتجات`}
          className="relative rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          type="button"
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

export function StorefrontHero() {
  return (
    <section className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <span className="inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-sm font-semibold text-blue-200">
            تشكيلة الموسم الجديد
          </span>
          <h1 className="mt-5 max-w-xl text-4xl font-black leading-tight sm:text-5xl">
            منتجات مختارة
            <span className="block text-blue-300">لتجربة أفضل كل يوم</span>
          </h1>
          <p className="mt-4 max-w-lg leading-7 text-slate-300">
            اكتشف منتجات تجمع بين الجودة والتصميم، مع توصيل سريع وخيارات دفع آمنة.
          </p>
          <a
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
            href="#products"
          >
            تسوق الآن <ArrowLeft aria-hidden="true" size={18} />
          </a>
        </div>
        <div className="flex min-h-56 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-fuchsia-500/30 p-8">
          <ShoppingBag aria-hidden="true" className="text-blue-200" size={112} strokeWidth={1} />
        </div>
      </div>
    </section>
  );
}

export function ProductCategoryGrid({
  categories = ["الإلكترونيات", "الأزياء", "المنزل", "الإكسسوارات"],
}: {
  categories?: string[];
}) {
  return (
    <section aria-label="تصنيفات المنتجات" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {categories.map((category, index) => (
        <a
          className="rounded-2xl border border-slate-200 bg-white p-5 text-center font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          href="#products"
          key={category}
        >
          <span className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-blue-50 text-lg text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {index + 1}
          </span>
          {category}
        </a>
      ))}
    </section>
  );
}

export function ProductCard({ product }: { product: StoreProduct }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`relative grid aspect-[4/3] place-items-center bg-gradient-to-br ${product.color ?? "from-slate-100 to-slate-200"} dark:from-slate-800 dark:to-slate-700`}
      >
        <ShoppingBag aria-hidden="true" className="text-slate-500/70" size={58} strokeWidth={1.2} />
        {product.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-800 shadow-sm">
            {product.badge}
          </span>
        )}
        <button
          aria-label={`أضف ${product.name} إلى المفضلة`}
          className="absolute left-3 top-3 rounded-full bg-white p-2 text-slate-600 shadow-sm hover:text-rose-600"
          type="button"
        >
          <Heart size={17} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">{product.category}</p>
        <h3 className="mt-1 font-bold text-slate-900 dark:text-white">{product.name}</h3>
        {product.rating !== undefined && (
          <p className="mt-2 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <Star aria-hidden="true" className="fill-amber-400 text-amber-400" size={15} />
            {product.rating}
            {product.reviews !== undefined && <span>({product.reviews} تقييم)</span>}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-slate-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.previousPrice !== undefined && (
              <del className="text-xs text-slate-400">{formatPrice(product.previousPrice)}</del>
            )}
          </div>
          <button
            aria-label={`أضف ${product.name} إلى السلة`}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            type="button"
          >
            أضف للسلة
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({
  products = sampleProducts,
  title = "منتجات مميزة",
}: {
  products?: StoreProduct[];
  title?: string;
}) {
  return (
    <section id="products">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">اختيارات تناسب احتياجاتك</p>
        </div>
        <a className="text-sm font-bold text-blue-700 dark:text-blue-300" href="#">
          عرض الكل
        </a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}

export function ProductDetails({ product = sampleProducts[0] }: { product?: StoreProduct }) {
  return (
    <article className={`${cardClass} grid gap-7 md:grid-cols-2`}>
      <div className={`grid min-h-64 place-items-center rounded-2xl bg-gradient-to-br ${product.color ?? "from-slate-100 to-slate-200"} dark:from-slate-800 dark:to-slate-700`}>
        <ShoppingBag aria-hidden="true" className="text-slate-500/70" size={84} strokeWidth={1} />
      </div>
      <div className="flex flex-col items-start">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {product.category}
        </span>
        <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">{product.name}</h2>
        <p className="mt-3 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <Star className="fill-amber-400 text-amber-400" size={16} />
          {product.rating ?? 4.8} ({product.reviews ?? 32} تقييم)
        </p>
        <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
          تصميم عملي وجودة موثوقة للاستخدام اليومي. يتضمن المنتج ضمانًا وخدمة دعم بعد الشراء.
        </p>
        <p className="mt-5 text-2xl font-black text-slate-900 dark:text-white">{formatPrice(product.price)}</p>
        <button className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700" type="button">
          أضف إلى السلة
        </button>
      </div>
    </article>
  );
}

export interface CartItem extends StoreProduct {
  quantity: number;
}

export function ShoppingCart({
  items = [{ ...sampleProducts[0], quantity: 1 }, { ...sampleProducts[2], quantity: 2 }],
}: {
  items?: CartItem[];
}) {
  return (
    <section className={cardClass}>
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">سلة التسوق</h2>
      <ul className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
        {items.map((item) => (
          <li className="flex items-center gap-4 py-4" key={item.id}>
            <div className={`grid size-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${item.color ?? "from-slate-100 to-slate-200"}`}>
              <ShoppingBag aria-hidden="true" className="text-slate-500" size={25} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-bold text-slate-900 dark:text-white">{item.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.quantity} × {formatPrice(item.price)}</p>
            </div>
            <strong className="text-sm text-slate-900 dark:text-white">
              {formatPrice(item.quantity * item.price)}
            </strong>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-between border-t border-slate-100 pt-4 font-bold dark:border-slate-800">
        <span className="text-slate-600 dark:text-slate-300">الإجمالي</span>
        <span className="text-slate-900 dark:text-white">
          {formatPrice(items.reduce((sum, item) => sum + item.quantity * item.price, 0))}
        </span>
      </div>
    </section>
  );
}

export function OrderSummary({
  subtotal = 648,
  shipping = 25,
  discount = 50,
}: {
  subtotal?: number;
  shipping?: number;
  discount?: number;
}) {
  return (
    <aside className={cardClass}>
      <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">ملخص الطلب</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between"><dt className="text-slate-500">المجموع الفرعي</dt><dd>{formatPrice(subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-slate-500">التوصيل</dt><dd>{formatPrice(shipping)}</dd></div>
        <div className="flex justify-between text-emerald-700 dark:text-emerald-400"><dt>الخصم</dt><dd>−{formatPrice(discount)}</dd></div>
        <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-extrabold dark:border-slate-800">
          <dt>الإجمالي</dt><dd>{formatPrice(subtotal + shipping - discount)}</dd>
        </div>
      </dl>
      <button className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700" type="button">
        إتمام الشراء
      </button>
    </aside>
  );
}

export function CheckoutForm() {
  return (
    <form className={`${cardClass} space-y-5`}>
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">إتمام الطلب</h2>
        <p className="mt-1 text-sm text-slate-500">أدخل بيانات التوصيل لإكمال عملية الشراء.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          الاسم الكامل
          <input className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2.5 font-normal outline-none focus:border-blue-500" placeholder="الاسم الكامل" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          رقم الجوال
          <input className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2.5 font-normal outline-none focus:border-blue-500" placeholder="05xxxxxxxx" type="tel" />
        </label>
      </div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        عنوان التوصيل
        <textarea className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2.5 font-normal outline-none focus:border-blue-500" placeholder="المدينة، الحي، الشارع" rows={3} />
      </label>
      <label className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
        <input className="mt-1 accent-blue-600" type="checkbox" />
        حفظ العنوان لاستخدامه في الطلبات القادمة
      </label>
      <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700" type="button">
        متابعة إلى الدفع
      </button>
    </form>
  );
}

export function PaymentMethods() {
  return (
    <section className={cardClass}>
      <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">طريقة الدفع</h2>
      <div className="mt-4 space-y-3">
        {["بطاقة بنكية", "الدفع عند الاستلام", "محفظة إلكترونية"].map((method, index) => (
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-semibold text-slate-700 hover:border-blue-400 dark:border-slate-700 dark:text-slate-200" key={method}>
            <input className="accent-blue-600" defaultChecked={index === 0} name="payment-method" type="radio" />
            {index === 0 ? <CreditCard aria-hidden="true" size={19} /> : <span className="size-5" />}
            {method}
          </label>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck aria-hidden="true" className="text-emerald-600" size={16} />
        بيانات الدفع محمية ومشفرة.
      </p>
    </section>
  );
}

export function EcommerceOrdersTable() {
  const orders = [
    { id: "ORD-2048", date: "١٦ أكتوبر ٢٠٢٦", total: 648, status: "تم التوصيل" },
    { id: "ORD-2047", date: "١٢ أكتوبر ٢٠٢٦", total: 399, status: "قيد الشحن" },
    { id: "ORD-2046", date: "٠٨ أكتوبر ٢٠٢٦", total: 179, status: "قيد التجهيز" },
  ];
  return (
    <div className={`${cardClass} overflow-hidden p-0`}>
      <div className="p-5"><h2 className="text-lg font-extrabold text-slate-900 dark:text-white">طلباتي</h2></div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-right text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-800/70">
            <tr>{["رقم الطلب", "التاريخ", "الإجمالي", "الحالة", "التفاصيل"].map((heading) => <th className="px-5 py-3 font-semibold" key={heading}>{heading}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-5 py-4 font-bold text-blue-700 dark:text-blue-300">{order.id}</td>
                <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{order.date}</td>
                <td className="px-5 py-4 font-semibold">{formatPrice(order.total)}</td>
                <td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{order.status}</span></td>
                <td className="px-5 py-4"><a className="font-semibold text-blue-700 dark:text-blue-300" href="#">عرض الطلب</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OrderTracking() {
  const steps = [
    { label: "تم تأكيد الطلب", detail: "١٦ أكتوبر، ١٠:٣٠ ص", complete: true },
    { label: "تم تجهيز الطلب", detail: "١٦ أكتوبر، ١٢:١٥ م", complete: true },
    { label: "خرج للتوصيل", detail: "متوقع اليوم", complete: false },
    { label: "تم التسليم", detail: "بانتظار التوصيل", complete: false },
  ];
  return (
    <section className={cardClass}>
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-sm text-slate-500">طلب رقم ORD-2048</p><h2 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">تتبع الطلب</h2></div>
        <Truck aria-hidden="true" className="text-blue-600" size={28} />
      </div>
      <ol className="mt-6 space-y-5">
        {steps.map((step) => (
          <li className="flex items-start gap-3" key={step.label}>
            <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${step.complete ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400 dark:bg-slate-800"}`}>
              {step.complete ? <CheckCircle2 size={16} /> : <span className="size-2 rounded-full bg-current" />}
            </span>
            <div><p className={`font-bold ${step.complete ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>{step.label}</p><p className="mt-1 text-xs text-slate-500">{step.detail}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function OrderConfirmationCard({
  orderNumber = "ORD-2048",
  total = 648,
}: {
  orderNumber?: string;
  total?: number;
}) {
  return (
    <section className={`${cardClass} mx-auto max-w-xl text-center`}>
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        <CheckCircle2 aria-hidden="true" size={34} />
      </span>
      <h2 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">تم استلام طلبك</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">سنرسل تفاصيل الطلب إلى بريدك الإلكتروني.</p>
      <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
        <p className="text-slate-500">رقم الطلب</p>
        <p className="mt-1 font-extrabold text-slate-900 dark:text-white">{orderNumber}</p>
        <p className="mt-3 text-slate-500">الإجمالي</p>
        <p className="mt-1 font-extrabold text-slate-900 dark:text-white">{formatPrice(total)}</p>
      </div>
      <a className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700" href="#">
        متابعة الطلب
      </a>
    </section>
  );
}

export function RefundRequestForm() {
  return (
    <form className={`${cardClass} space-y-4`}>
      <div><h2 className="text-xl font-extrabold text-slate-900 dark:text-white">طلب استرجاع</h2><p className="mt-1 text-sm text-slate-500">اختر المنتج واذكر سبب طلب الاسترجاع.</p></div>
      <label className="block text-sm font-semibold">رقم الطلب<input className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2.5 font-normal dark:border-slate-700" placeholder="مثال: ORD-2048" /></label>
      <label className="block text-sm font-semibold">سبب الاسترجاع<select className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-normal dark:border-slate-700 dark:bg-slate-900"><option>اختر السبب</option><option>المنتج لا يطابق الوصف</option><option>وصل المنتج تالفًا</option><option>سبب آخر</option></select></label>
      <label className="block text-sm font-semibold">تفاصيل إضافية<textarea className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2.5 font-normal dark:border-slate-700" rows={3} /></label>
      <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700" type="button">إرسال طلب الاسترجاع</button>
    </form>
  );
}

export function ServiceRepairForm() {
  return (
    <form className={`${cardClass} space-y-4`}>
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">طلب صيانة</h2>
        <p className="mt-1 text-sm text-slate-500">أرسل بيانات المنتج ووصف المشكلة لفريق الصيانة.</p>
      </div>
      <label className="block text-sm font-semibold">
        رقم الطلب أو الرقم التسلسلي
        <input className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2.5 font-normal dark:border-slate-700" placeholder="أدخل رقم المنتج" />
      </label>
      <label className="block text-sm font-semibold">
        وصف المشكلة
        <textarea className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2.5 font-normal dark:border-slate-700" placeholder="اشرح المشكلة التي تواجهها" rows={4} />
      </label>
      <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700" type="button">
        إرسال طلب الصيانة
      </button>
    </form>
  );
}

export function RefundStatusCard({ status = "قيد المراجعة" }: { status?: string }) {
  return (
    <section className={`${cardClass} flex items-start gap-4`}>
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"><PackageCheck aria-hidden="true" size={22} /></span>
      <div className="flex-1">
        <p className="text-sm text-slate-500">طلب الاسترجاع RR-1032</p>
        <h2 className="mt-1 font-extrabold text-slate-900 dark:text-white">{status}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">سنرسل تحديثًا إلى بريدك الإلكتروني عند تغيير حالة الطلب.</p>
      </div>
    </section>
  );
}

export function ProductReviews() {
  return (
    <section className={cardClass}>
      <div className="flex items-center justify-between gap-4">
        <div><h2 className="text-xl font-extrabold text-slate-900 dark:text-white">تقييمات العملاء</h2><p className="mt-1 text-sm text-slate-500">آراء موثقة من مشترين</p></div>
        <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold dark:border-slate-700" type="button">أضف تقييمًا</button>
      </div>
      <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
        {[
          { name: "نورة", text: "جودة ممتازة والتوصيل كان سريعًا.", score: 5 },
          { name: "سلمان", text: "المنتج مطابق للوصف وتجربة الشراء سهلة.", score: 4 },
        ].map((review) => (
          <article className="py-4" key={review.name}>
            <div className="flex items-center justify-between"><h3 className="font-bold text-slate-900 dark:text-white">{review.name}</h3><span className="flex text-amber-400">{Array.from({ length: 5 }, (_, index) => <Star className={index < review.score ? "fill-current" : "text-slate-300"} key={index} size={14} />)}</span></div>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{review.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ReviewsHistory() {
  return (
    <section className={cardClass}>
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">سجل تقييماتي</h2>
      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {sampleProducts.slice(0, 2).map((product) => (
          <article className="flex items-center justify-between gap-4 py-4" key={product.id}>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{product.name}</h3>
              <p className="mt-1 text-sm text-slate-500">تم التقييم في ١٠ أكتوبر ٢٠٢٦</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">
              <Star aria-hidden="true" className="fill-amber-400 text-amber-400" size={15} />
              {product.rating ?? 5}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AccountOverview() {
  return (
    <section className={cardClass}>
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">حسابي</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { label: "الطلبات", value: "١٢", icon: ShoppingBag },
          { label: "العناوين", value: "٢", icon: MapPin },
          { label: "التقييمات", value: "٥", icon: Star },
        ].map(({ label, value, icon: Icon }) => (
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800" key={label}>
            <Icon aria-hidden="true" className="text-blue-600" size={20} />
            <p className="mt-3 text-sm text-slate-500">{label}</p><p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CustomerCareCard() {
  return (
    <section className={`${cardClass} flex items-center gap-4`}>
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><Headset aria-hidden="true" size={24} /></span>
      <div className="flex-1"><h2 className="font-extrabold text-slate-900 dark:text-white">كيف نساعدك؟</h2><p className="mt-1 text-sm text-slate-500">فريق الدعم متاح للإجابة عن استفساراتك.</p></div>
      <a className="shrink-0 text-sm font-bold text-blue-700 dark:text-blue-300" href="#">تواصل معنا</a>
    </section>
  );
}

export function WarrantyCard() {
  return (
    <section className={`${cardClass} flex items-center gap-4`}>
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><ShieldCheck aria-hidden="true" size={24} /></span>
      <div><h2 className="font-extrabold text-slate-900 dark:text-white">ضمان المنتج</h2><p className="mt-1 text-sm text-slate-500">يشمل هذا المنتج ضمانًا لمدة ١٢ شهرًا.</p></div>
    </section>
  );
}

export function DiscountBanner() {
  return (
    <aside className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-l from-blue-700 to-indigo-700 p-6 text-white sm:flex-row sm:items-center">
      <div><p className="text-sm font-bold text-blue-200">عرض لفترة محدودة</p><h2 className="mt-1 text-2xl font-black">خصم ٢٠٪ على طلبك القادم</h2><p className="mt-2 text-sm text-blue-100">استخدم الرمز <code className="rounded bg-white/15 px-2 py-1 font-bold">SAVE20</code></p></div>
      <a className="rounded-xl bg-white px-5 py-3 text-center font-bold text-blue-700 hover:bg-blue-50" href="#products">اكتشف العروض</a>
    </aside>
  );
}

export function DiscountPopup() {
  return (
    <aside className="relative max-w-md rounded-2xl border border-blue-200 bg-white p-6 shadow-xl dark:border-blue-900 dark:bg-slate-900">
      <p className="text-sm font-bold text-blue-700 dark:text-blue-300">هدية ترحيبية</p>
      <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">خصم ١٥٪ على أول طلب</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">استخدم الرمز WELCOME15 عند إتمام الشراء.</p>
      <a className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700" href="#products">
        تسوق الآن
      </a>
    </aside>
  );
}

export function StorefrontFooter({ storeName = "متجري" }: { storeName?: string }) {
  return (
    <footer className="rounded-2xl bg-slate-950 px-6 py-8 text-slate-300">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div><h2 className="text-lg font-black text-white">{storeName}</h2><p className="mt-3 text-sm leading-6">منتجات مختارة وخدمة موثوقة لتجربة تسوق أسهل.</p></div>
        <div><h3 className="font-bold text-white">روابط سريعة</h3><ul className="mt-3 space-y-2 text-sm"><li><a href="#">عن المتجر</a></li><li><a href="#">المنتجات</a></li><li><a href="#">اتصل بنا</a></li></ul></div>
        <div><h3 className="font-bold text-white">خدمة العملاء</h3><ul className="mt-3 space-y-2 text-sm"><li><a href="#">الشحن والتوصيل</a></li><li><a href="#">الاستبدال والاسترجاع</a></li><li><a href="#">الأسئلة الشائعة</a></li></ul></div>
        <div><h3 className="font-bold text-white">طرق دفع آمنة</h3><p className="mt-3 flex items-center gap-2 text-sm"><CreditCard aria-hidden="true" size={18} /> بطاقات ومحافظ إلكترونية</p></div>
      </div>
      <p className="mt-8 border-t border-slate-800 pt-5 text-xs text-slate-500">© {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة.</p>
    </footer>
  );
}
