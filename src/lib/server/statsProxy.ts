import { NextResponse } from "next/server"

const BACKEND_API_BASE =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:4000"

const STATS_ADMIN_TOKEN = process.env.STATS_ADMIN_TOKEN ?? process.env.ADMIN_TOKEN

export async function proxyStats(path: "/api/stats/public" | "/api/stats/runoff") {
  if (!STATS_ADMIN_TOKEN) {
    return NextResponse.json(
      {
        error: "STATS_ADMIN_TOKEN_MISSING",
        message: "Configura STATS_ADMIN_TOKEN para consultar estadísticas protegidas",
      },
      { status: 500 }
    )
  }

  const response = await fetch(`${BACKEND_API_BASE}${path}`, {
    headers: {
      "X-Admin-Token": STATS_ADMIN_TOKEN,
    },
    cache: "no-store",
  })

  const body = await response.text()
  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  })
}
