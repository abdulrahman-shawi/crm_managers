import { Check } from "lucide-react";

export interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice?: number;
  features: string[];
  featured?: boolean;
  buttonLabel?: string;
}

const defaultPlans: PricingPlan[] = [
  {
    name: "أساسي",
    description: "للمتاجر الناشئة والمشاريع الصغيرة.",
    monthlyPrice: 49,
    yearlyPrice: 39,
    features: ["حتى ١٠٠ منتج", "تقارير أساسية", "دعم عبر البريد"],
    buttonLabel: "ابدأ الآن",
  },
  {
    name: "احترافي",
    description: "أدوات أكثر لتنمية أعمالك.",
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: ["منتجات غير محدودة", "تقارير متقدمة", "دعم أولوية", "تكاملات المتجر"],
    featured: true,
    buttonLabel: "اختر الخطة",
  },
  {
    name: "أعمال",
    description: "للعمليات الكبيرة والفرق المتنامية.",
    monthlyPrice: 199,
    yearlyPrice: 159,
    features: ["كل مزايا الاحترافي", "حسابات متعددة", "مدير حساب مخصص", "تحليلات مخصصة"],
    buttonLabel: "تواصل معنا",
  },
];

export function PricingCards({
  plans = defaultPlans,
  billingPeriod = "monthly",
}: {
  plans?: PricingPlan[];
  billingPeriod?: "monthly" | "yearly";
}) {
  return (
    <section>
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">خطط واضحة</p>
        <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">اختر الخطة المناسبة لمتجرك</h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400">ابدأ بما تحتاجه، ويمكنك تغيير خطتك في أي وقت.</p>
        <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
          الأسعار {billingPeriod === "yearly" ? "السنوية" : "الشهرية"} — بالريال السعودي
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = billingPeriod === "yearly" ? plan.yearlyPrice ?? plan.monthlyPrice : plan.monthlyPrice;
          return (
            <article
              className={`relative rounded-2xl border p-6 ${plan.featured ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-950/5 dark:bg-blue-950/20" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"}`}
              key={plan.name}
            >
              {plan.featured && <span className="absolute -top-3 right-5 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">الأكثر اختيارًا</span>}
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{plan.name}</h3>
              <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400">{plan.description}</p>
              <p className="mt-5 flex items-baseline gap-2">
                <strong className="text-4xl font-black text-slate-900 dark:text-white">{new Intl.NumberFormat("ar-SA").format(price)}</strong>
                <span className="text-sm text-slate-500">ر.س / {billingPeriod === "yearly" ? "شهر، بالفوترة السنوية" : "شهر"}</span>
              </p>
              <a
                className={`mt-6 block rounded-xl px-4 py-3 text-center text-sm font-bold ${plan.featured ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-slate-300 text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"}`}
                href="#contact"
              >
                {plan.buttonLabel ?? "اختر الخطة"}
              </a>
              <ul className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm dark:border-slate-800">
                {plan.features.map((feature) => (
                  <li className="flex items-start gap-2 text-slate-600 dark:text-slate-300" key={feature}>
                    <Check aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-600" size={17} />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function PricingComparison({
  plans = defaultPlans,
}: {
  plans?: PricingPlan[];
}) {
  const features = Array.from(new Set(plans.flatMap((plan) => plan.features)));
  return (
    <section className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
      <table className="w-full min-w-[640px] text-right text-sm">
        <thead className="bg-slate-50 dark:bg-slate-900">
          <tr>
            <th className="px-5 py-4 font-bold text-slate-700 dark:text-slate-200">المزايا</th>
            {plans.map((plan) => <th className="px-5 py-4 font-bold text-slate-900 dark:text-white" key={plan.name}>{plan.name}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
          {features.map((feature) => (
            <tr key={feature}>
              <th className="px-5 py-4 text-right font-medium text-slate-600 dark:text-slate-300" scope="row">{feature}</th>
              {plans.map((plan) => (
                <td className="px-5 py-4 text-center text-slate-700 dark:text-slate-200" key={plan.name}>
                  {plan.features.includes(feature) ? <Check aria-label="متوفر" className="mx-auto text-emerald-600" size={18} /> : "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
