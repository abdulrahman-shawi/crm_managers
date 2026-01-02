import { Metadata } from 'next';
import { getPageSeo } from '@/lib/seoPage';
import Dashboard from './pages';

type Props = {
  params: { slug: string };
};

// هذه الدالة هي المحرك الأساسي للـ SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seo = await getPageSeo("/dashboard");

  return {
    title: seo?.title || "العنوان الافتراضي",
    description: seo?.description || "الوصف الافتراضي",
    openGraph: {
      images: [seo?.ogImage || '/default-og.png'],
    },
    keywords: seo?.keywords,
  };
}

export default function Page({ params }: Props) {
  return (
    <Dashboard />
  );
}