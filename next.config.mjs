/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — Cloudflare serves the `out/` folder directly (no server, no adapter).
  // The contact form is handled by a native Cloudflare function in /functions/api/leads.ts.
  output: "export",
  // Emit folder/index.html for each route so Cloudflare Pages serves clean URLs.
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
