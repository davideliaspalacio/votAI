import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

const nextConfig: NextConfig = {
  async redirects() {
    // El test cerró: todo el flujo (onboarding/quiz/analyzing) va a estadísticas.
    // Quitar estas entradas si se reabre el test.
    return [
      "/onboarding",
      "/quiz",
      "/analyzing",
      "/segunda-vuelta/onboarding",
      "/segunda-vuelta/quiz",
      "/segunda-vuelta/analyzing",
    ].map((source) => ({
      source,
      destination: "/estadisticas",
      permanent: false,
    }))
  },
}

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG ?? "votoloco",
  project: process.env.SENTRY_PROJECT ?? "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  // Routes Sentry events through votoloco.com/monitoring instead of
  // ingest.sentry.io directly, bypassing ad-blockers (uBlock, Brave Shields,
  // Privacy Badger, etc.) that block Sentry's domain.
  tunnelRoute: "/monitoring",
  sourcemaps: {
    disable: false,
  },
})
