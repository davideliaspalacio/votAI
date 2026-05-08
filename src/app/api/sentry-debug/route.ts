import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export function GET(request: Request) {
  const url = new URL(request.url)
  const ts = url.searchParams.get("ts") ?? Date.now()
  throw new Error(`Sentry server error ${ts}`)
  // unreachable, pero para satisfacer el tipo de retorno
  return NextResponse.json({ ok: true })
}
