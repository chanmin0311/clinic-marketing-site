import type { NextConfig } from "next";

// contexts/architecture.md §5 — static export only. No middleware, route
// handlers, server actions, or Next.js image optimization.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
