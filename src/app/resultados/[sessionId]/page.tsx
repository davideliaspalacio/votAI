"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/results/Reveal"
import { RankingList } from "@/components/results/RankingList"
import { AxisBreakdown } from "@/components/results/AxisBreakdown"
import { ShareButton } from "@/components/results/ShareButton"
import { Disclaimer } from "@/components/common/Disclaimer"
import { LegalFooter } from "@/components/common/LegalFooter"
import { ResultsSkeleton } from "@/components/common/Skeletons"
import { api } from "@/lib/api"
import { mockCandidates } from "@/lib/mock/candidates"
import type { MatchResult } from "@/types/domain"
import { Header } from "@/components/common/Header"
import { BarChart3, RefreshCw, GitCompare, User } from "lucide-react"
import { showPublicStats } from "@/lib/utils"

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string
  const [result, setResult] = useState<MatchResult | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!sessionId) return
    api
      .getMatchResult(sessionId)
      .then(setResult)
      .catch(() => setError(true))
  }, [sessionId])

  const handleRevealComplete = useCallback(() => {
    setRevealed(true)
  }, [])

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <div className="text-center">
          <h2 className="font-display text-display-sm font-bold text-text">
            Sesión no encontrada
          </h2>
          <p className="mt-2 text-text-muted">
            No pudimos encontrar tus resultados. ¿Quieres hacer el test de nuevo?
          </p>
          <Link href="/onboarding" className="mt-6 inline-block">
            <Button variant="brutal">Empezar de nuevo</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!result) return <ResultsSkeleton />

  const topResult = result.results[0]
  const topCandidate = mockCandidates.find(
    (c) => c.id === topResult.candidateId
  )

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      {/* Section 1: The Reveal */}
      <Reveal result={result} onRevealComplete={handleRevealComplete} />

      {/* Sections 2-4 appear after reveal */}
      {revealed && (
        <div className="flex flex-1 flex-col space-y-16 pb-12">
          {/* Section 1.5: Top candidate hero card */}
          {topCandidate && (
            <section className="mx-auto max-w-2xl px-4 text-center">
              <div
                className="inline-flex flex-col items-center gap-3 rounded-brutal border-2 px-10 py-8"
                style={{
                  borderColor: topCandidate.color,
                  boxShadow: `4px 4px 0px 0px ${topCandidate.color}`,
                }}
              >
                <div
                  className="flex size-20 items-center justify-center rounded-full"
                  style={{ backgroundColor: topCandidate.color + "20" }}
                >
                  {topCandidate.photo ? (
                    <img src={topCandidate.photo} alt={topCandidate.name} className="size-full rounded-full object-cover" />
                  ) : (
                    <User className="size-10" style={{ color: topCandidate.color }} />
                  )}
                </div>
                <h2 className="font-display text-2xl font-bold text-text">
                  {topCandidate.name}
                </h2>
                <p className="text-sm text-text-muted">{topCandidate.party}</p>
                <div className="font-display text-4xl font-bold text-primary">
                  {topResult.score}%
                </div>
                <p className="text-xs text-text-subtle">de afinidad programática</p>
              </div>
              <p className="mt-4 text-sm text-text-muted">
                {topResult.summary}
              </p>
            </section>
          )}

          {/* Section 2: Full Ranking */}
          <RankingList results={result.results} />

          {/* Section 3: Axis Breakdown */}
          <AxisBreakdown topResults={result.results.slice(0, 3)} />

          {/* Section 4: Share Results */}
          {topCandidate && (
            <section className="mx-auto max-w-2xl px-4">
              <ShareButton
                candidateName={topCandidate.name}
                score={topResult.score}
                sessionId={sessionId}
                topResults={result.results}
                initialPreference={result.initial_preference}
              />
            </section>
          )}

          {/* Section 5: Actions & Disclaimer */}
          <section className="mx-auto max-w-2xl space-y-6 px-4">
            <Disclaimer variant="full" />

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/onboarding">
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="size-4" />
                  Repetir test
                </Button>
              </Link>
              <Link href="/comparar">
                <Button variant="outline" className="gap-2">
                  <GitCompare className="size-4" />
                  Comparar candidatos
                </Button>
              </Link>
              {showPublicStats() && (
                <Link href="/estadisticas">
                  <Button variant="outline" className="gap-2">
                    <BarChart3 className="size-4" />
                    Estadísticas
                  </Button>
                </Link>
              )}
            </div>
          </section>

          <div className="mt-auto">
            <LegalFooter />
          </div>
        </div>
      )}
    </div>
  )
}
