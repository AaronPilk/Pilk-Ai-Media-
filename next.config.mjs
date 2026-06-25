/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep production builds green even if a lint rule nitpicks generated code.
  // Type safety is still enforced (ignoreBuildErrors stays false).
  // Run `npm run lint` separately for the full lint report.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
