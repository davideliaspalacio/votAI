"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RankingList } from "@/components/results/RankingList"
import { ShareButton } from "@/components/results/ShareButton"
import { EnrichWithAiButton } from "@/components/results/EnrichWithAiButton"
import { RunoffAxisBreakdown } from "./RunoffAxisBreakdown"
import { VoteChangeQuestion } from "./VoteChangeQuestion"
import { Disclaimer } from "@/components/common/Disclaimer"
import { LegalFooter } from "@/components/common/LegalFooter"
import { Header } from "@/components/common/Header"
import { ResultsSkeleton } from "@/components/common/Skeletons"
import { api } from "@/lib/api"
import { mockCandidates } from "@/lib/mock/candidates"
import type { RunoffMatchResult } from "@/types/domain"
import { RefreshCw, User, Trophy } from "lucide-react"

interface RunoffResultsProps {
  sessionId: string
}

const SPECIAL_INTENTIONS = ["blank", "undecided", "na", "no_vote"]

export function RunoffResults({ sessionId }: RunoffResultsProps) {
  const [result, setResult] = useState<RunoffMatchResult | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!sessionId) return
    api
      .getRunoffMatchResult(sessionId)
      .then(setResult)
      .catch(() => setError(true))
  }, [sessionId])

  const handleEnriched = useCallback(async () => {
    const fresh = await api.getRunoffMatchResult(sessionId)
    setResult(fresh)
  }, [sessionId])

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
          <Link href="/segunda-vuelta/onboarding" className="mt-6 inline-block">
            <Button variant="brutal">Empezar de nuevo</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!result || result.results.length < 2) return <ResultsSkeleton />

  const winner = result.results[0]
  const runnerUp = result.results[1]
  const winnerCandidate = mockCandidates.find((c) => c.id === winner.candidateId)

  const intention = result.runoff_intention
  const intentionCandidate = !SPECIAL_INTENTIONS.includes(intention)
    ? mockCandidates.find((c) => c.id === intention)
    : null

  let verdict: string
  if (intentionCandidate) {
    verdict = result.preference_match
      ? `Tu intención de voto coincide con tu afinidad programática.`
      : `Pensabas votar por ${intentionCandidate.name}, pero según tus respuestas te identificas más con ${winnerCandidate?.name}.`
  } else {
    verdict = `Aún no tenías una intención definida. Según tus respuestas, te identificas más con ${winnerCandidate?.name}.`
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <div className="flex flex-1 flex-col space-y-16 py-12">
        {/* Head-to-head hero */}
        <section className="mx-auto w-full max-w-2xl px-4 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-subtle">
            Segunda vuelta · Afinidad programática
          </p>
          <h1 className="font-display text-2xl font-bold text-text sm:text-display-sm">
            Cepeda <span className="text-text-subtle">vs</span> Abelardo
          </h1>

          <div className="mx-auto mt-8 flex max-w-lg flex-col gap-4">
            {[winner, runnerUp].map((r, i) => {
              const candidate = mockCandidates.find(
                (c) => c.id === r.candidateId
              )
              if (!candidate) return null
              const isWinner = i === 0
              return (
                <div
                  key={r.candidateId}
                  className="relative flex items-center gap-4 rounded-brutal border-2 px-5 py-4"
                  style={{
                    borderColor: isWinner ? candidate.color : "var(--surface-border)",
                    boxShadow: isWinner ? `4px 4px 0px 0px ${candidate.color}` : undefined,
                  }}
                >
                  {isWinner && (
                    <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-background">
                      <Trophy className="size-3" />
                      Más afín
                    </span>
                  )}
                  <div
                    className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full"
                    style={{ backgroundColor: candidate.color + "20" }}
                  >
                    {candidate.photo ? (
                      <img
                        src={candidate.photo}
                        alt={candidate.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <User className="size-7" style={{ color: candidate.color }} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="font-display text-base font-bold text-text">
                      {candidate.name}
                    </p>
                    <p className="text-xs text-text-subtle">{candidate.party}</p>
                  </div>
                  <div className="text-right">
                    <div
                      className={
                        isWinner
                          ? "font-display text-3xl font-bold"
                          : "font-display text-3xl font-bold text-text-muted"
                      }
                      style={isWinner ? { color: "var(--primary)" } : undefined}
                    >
                      {r.score}%
                    </div>
                    {!isWinner && (
                      <p className="text-[10px] uppercase tracking-wider text-text-subtle">
                        Menos afín
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <p className="mx-auto mt-6 max-w-lg text-sm text-text-muted">
            {verdict}
          </p>
        </section>

        {/* Pregunta opcional post-resultado: ¿reconsiderarías tu voto? (solo si hay brecha) */}
        {!result.preference_match && winnerCandidate && (
          <section className="mx-auto w-full max-w-2xl px-4">
            <VoteChangeQuestion
              sessionId={sessionId}
              intentionName={intentionCandidate?.name ?? null}
              topName={winnerCandidate.name}
              initialAnswer={result.would_change_vote ?? null}
            />
          </section>
        )}

        {/* Enrich with AI (solo si aún no fue enriquecido) */}
        {result.ai_enriched === false && (
          <section className="mx-auto w-full max-w-2xl px-4">
            <EnrichWithAiButton
              sessionId={sessionId}
              onEnriched={handleEnriched}
              enrich={api.enrichRunoffMatchWithAi}
            />
          </section>
        )}

        {/* Ranking (2 candidatos) */}
        <RankingList results={result.results} />

        {/* ¿Por qué? Comparación de los dos planes, tema por tema */}
        <RunoffAxisBreakdown results={result.results} />

        {/* Compartir resultados (con imagen para redes) */}
        <section className="mx-auto w-full max-w-2xl px-4">
          <ShareButton
            candidateName={winnerCandidate?.name ?? ""}
            score={winner.score}
            sessionId={sessionId}
            topResults={result.results}
            initialPreference={result.runoff_intention}
            resultPath="/segunda-vuelta/resultados/"
          />
        </section>

        {/* Acciones y disclaimer */}
        <section className="mx-auto max-w-2xl space-y-6 px-4">
          <Disclaimer variant="full" />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/segunda-vuelta/onboarding">
              <Button variant="outline" className="gap-2">
                <RefreshCw className="size-4" />
                Repetir test
              </Button>
            </Link>
          </div>
        </section>

        <div className="mt-auto">
          <LegalFooter />
        </div>
      </div>
    </div>
  )
}
