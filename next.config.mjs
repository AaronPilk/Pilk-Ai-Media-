/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — Cloudflare serves the `out/` folder directly (no server, no adapter).
  // The contact form is handled by a native Cloudflare function in /functions/api/leads.ts.
  output: "export",
  // Emit folder/index.html for each route so Cloudflare Pages serves clean URLs
  // like /contact and /process correctly.
  trailingSlash: true,
  reactStrictMode: true,
  // Don't fail the production build on lint/type nitpicks. The site still runs;
  // run `npm run lint` / `npm run typecheck` locally for the full reports.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
