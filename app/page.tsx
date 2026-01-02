// app/page.tsx
import { getGeneralSettings } from "@/lib/settings";
import ModernTemplate from "@/components/templates/ModernTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";

export default async function HomePage() {
  const settings = await getGeneralSettings();
  
  // اختيار القالب ديناميكياً
  const currentTemplate = settings?.selectedTemplate || "modern";

  return (
    <>
      {currentTemplate === "modern" && <ModernTemplate settings={settings} />}
      {currentTemplate === "minimal" && <MinimalTemplate settings={settings} />}
    </>
  );
}