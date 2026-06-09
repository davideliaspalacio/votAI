"use client"

import { useParams } from "next/navigation"
import { RunoffResults } from "@/components/runoff/RunoffResults"

export default function RunoffResultsPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  return <RunoffResults sessionId={sessionId} />
}
