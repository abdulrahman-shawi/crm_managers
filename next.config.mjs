import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  disable: process.env.NODE_ENV === "development",
  // السماح بتجاوز قواعد التخزين الافتراضية عبر cacheName نفسه
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: [
      {
        // عدم تخزين ردود /api/ إطلاقاً حتى تظهر الأسعار والفواتير المحدثة فوراً
        urlPattern: ({ sameOrigin, url: { pathname } }) =>
          sameOrigin &&
          pathname.startsWith("/api/") &&
          !pathname.startsWith("/api/auth/callback"),
        handler: "NetworkOnly",
        method: "GET",
        options: { cacheName: "apis" },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // أي إعدادات أخرى لمشروع الـ CRM الخاص بك ضعها هنا
  reactStrictMode: true,
};

export default withPWA(nextConfig);