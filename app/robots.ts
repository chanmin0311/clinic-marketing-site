import type { MetadataRoute } from "next";

// Required by output: 'export' for a metadata route with no dynamic input.
export const dynamic = "force-static";

// Permanent, per contexts/project.md §5 — this is a fabricated demo, never a
// real clinic, and must never be indexable. This is not env-gated because the
// posture does not change; there is no production cutover.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
