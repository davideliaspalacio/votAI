import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

const nextConfig: NextConfig = {
  /* config options here */
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
