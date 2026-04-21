import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/analyzing"],
    },
    sitemap: "https://vot-ai.vercel.app/sitemap.xml",
  }
}
