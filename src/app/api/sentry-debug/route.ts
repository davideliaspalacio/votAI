import * as Sentry from "@sentry/nextjs"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const ts = url.searchParams.get("ts") ?? Date.now()
  const error = new Error(`Sentry server error ${ts}`)
  Sentry.captureException(error)
  await Sentry.flush(2000)
  throw error
}
