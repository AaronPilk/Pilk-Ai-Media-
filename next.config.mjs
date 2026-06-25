/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — Cloudflare serves the `out/` folder directly (no server, no adapter).
  // The contact form is handled by a native Cloudflare function in /functions/api/leads.ts.
  output: "export",
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
