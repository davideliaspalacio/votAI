import type { MetadataRoute } from "next"
import { mockCandidates } from "@/lib/mock/candidates"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vot-ai.vercel.app"

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/onboarding`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/metodologia`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/comparar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/estadisticas`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ]

  const candidatePages: MetadataRoute.Sitemap = mockCandidates.map((c) => ({
    url: `${baseUrl}/candidato/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  return [...staticPages, ...candidatePages]
}
