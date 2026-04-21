"use client"

import { motion, useReducedMotion } from "framer-motion"
import { mockCandidates } from "@/lib/mock/candidates"
import { formatNumber } from "@/lib/utils"
import Link from "next/link"
import { HelpCircle, ArrowRight, Shuffle } from "lucide-react"

interface GapSankeyProps {
  gapPct: number
  data: {
    fromCandidateId: string
    to: { candidateId: string; pct: number }[]
  }[]
  total: number
}

export function GapSankey({ gapPct, data, total }: GapSankeyProps) {
  const prefersReduced = useReducedMotion()

  return (
    <div className="brutal-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-text">
          El dato que más sorprende
        </h3>
        <Link href="/metodologia" className="text-text-subtle hover:text-primary">
          <HelpCircle className="size-4" />
        </Link>
      </div>

      {/* Hero metric */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 rounded-brutal border-2 border-accent bg-accent/5 p-6 text-center"
      >
        <Shuffle className="mx-auto mb-2 size-8 text-accent" />
        <p className="font-display text-5xl font-bold text-accent md:text-6xl">
          {gapPct.toFixed(1)}%
        </p>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-text-muted">
          de las personas descubrió que el candidato que pensaba apoyar{" "}
          <strong className="text-text">
            NO es con quien tiene mayor afinidad programática
          </strong>
        </p>
        <p className="mt-2 text-sm text-text-subtle">
          Es decir: casi <strong className="text-accent">{Math.round(gapPct / 10)} de cada 10</strong>{" "}
          personas tiene un candidato más afín del que cree.
        </p>
      </motion.div>

      {/* Explanation */}
      <p className="mb-4 text-sm text-text-muted">
        ¿A dónde &ldquo;migra&rdquo; la afinidad? Esto muestra qué pasó con
        quienes declararon preferir a cada candidato:
      </p>

      {/* Flow cards */}
      <div className="space-y-4">
        {data.slice(0, 5).map((flow) => {
          const from = mockCandidates.find(
            (c) => c.id === flow.fromCandidateId
          )
          if (!from) return null

          const stayed = flow.to.find(
            (t) => t.candidateId === flow.fromCandidateId
          )
          const stayedPct = stayed?.pct ?? 0
          const moved = 100 - stayedPct

          return (
            <div
              key={flow.fromCandidateId}
              className="rounded-md border border-surface-border bg-surface-hover p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: from.color }}
                />
                <span className="font-display text-sm font-bold text-text">
                  Quienes preferían a {from.name}
                </span>
              </div>

              {/* Stay vs move bar */}
              <div className="mb-2 flex h-6 overflow-hidden rounded-full">
                <div
                  className="flex items-center justify-center text-[10px] font-bold text-primary-foreground"
                  style={{
                    width: `${stayedPct}%`,
                    backgroundColor: from.color,
                  }}
                >
                  {stayedPct > 15 ? `${stayedPct}% se queda` : ""}
                </div>
                <div
                  className="flex items-center justify-center text-[10px] font-bold text-accent bg-accent/20"
                  style={{ width: `${moved}%` }}
                >
                  {moved > 15 ? `${moved}% migra` : ""}
                </div>
              </div>

              {/* Destinations */}
              <div className="flex flex-wrap gap-1.5">
                {flow.to
                  .filter((t) => t.candidateId !== flow.fromCandidateId)
                  .map((dest) => {
                    const to = mockCandidates.find(
                      (c) => c.id === dest.candidateId
                    )
                    return (
                      <span
                        key={dest.candidateId}
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={{
                          backgroundColor: (to?.color ?? "#666") + "15",
                          color: to?.color,
                        }}
                      >
                        <ArrowRight className="size-2.5" />
                        {to?.name} {dest.pct}%
                      </span>
                    )
                  })}
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-[10px] text-text-subtle">
        N = {formatNumber(total)} &middot; &ldquo;Preferencia inicial
        declarada&rdquo; se refiere a la respuesta del onboarding, NO a una
        encuesta de intención de voto.
      </p>
    </div>
  )
}
