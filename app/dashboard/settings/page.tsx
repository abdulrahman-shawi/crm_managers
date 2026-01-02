// app/dashboard/settings/page.tsx
import { getGeneralSettings } from "@/lib/settings";
import SettingsForm from "@/components/SettingsForm"; // سنفصل الفورم في مكون Client

export default async function SettingsPage() {
  const settings = await getGeneralSettings();

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          إعدادات النظام
        </h1>
        <p className="text-slate-500 text-sm">إدارة تفاصيل المتجر والحماية والتفضيلات العامة</p>
      </div>

      {/* نمرر البيانات المسترجعة إلى مكون الفورم */}
      <SettingsForm initialData={settings} />
    </div>
  );
}