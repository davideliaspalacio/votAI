import * as Sentry from "@sentry/nextjs"

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate:
      process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? 0.1 : 1.0,
    sendDefaultPii: false,
    // Privacy-first: no session replay (Habeas Data)
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    integrations: [],
    beforeSend(event) {
      // Scrub localStorage values that include sessionId
      if (event.contexts?.state) delete event.contexts.state
      // Scrub demographic data if it leaks into payloads
      const req = event.request
      if (req?.data && typeof req.data === "object") {
        const data = req.data as Record<string, unknown>
        if ("initial_preference" in data) data.initial_preference = "[scrubbed]"
        if ("region" in data) data.region = "[scrubbed]"
        if ("age_range" in data) data.age_range = "[scrubbed]"
        if ("gender" in data) data.gender = "[scrubbed]"
      }
      return event
    },
    ignoreErrors: [
      // Browser extensions
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      // Network errors that are expected
      "NetworkError",
      "Failed to fetch",
      "Load failed",
      // Hydration warnings React noisy in dev
      "Hydration failed",
      "There was an error while hydrating",
    ],
    denyUrls: [
      // Browser extensions
      /chrome-extension:/i,
      /moz-extension:/i,
      /safari-extension:/i,
    ],
  })
}
