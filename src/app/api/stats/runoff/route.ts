import { proxyStats } from "@/lib/server/statsProxy"

export async function GET() {
  return proxyStats("/api/stats/runoff")
}
