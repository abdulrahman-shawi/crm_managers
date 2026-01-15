const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development", // تعطيله أثناء البرمجة لتجنب الكاش المزعج
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
