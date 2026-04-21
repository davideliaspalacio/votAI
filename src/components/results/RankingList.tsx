"use client"

import { motion, useReducedMotion } from "framer-motion"
import { User } from "lucide-react"
import { mockCandidates } from "@/lib/mock/candidates"
import type { CandidateResult } from "@/types/domain"

interface RankingListProps {
  results: CandidateResult[]
}

export function RankingList({ results }: RankingListProps) {
  const prefersReduced = useReducedMotion()

  return (
    <section className="mx-auto max-w-2xl px-4">
      <h3 className="mb-6 font-display text-xl font-bold text-text">
        Ranking completo de afinidad
      </h3>
      <div className="space-y-3" role="list">
        {results.map((r, i) => {
          const candidate = mockCandidates.find((c) => c.id === r.candidateId)
          if (!candidate) return null

          return (
            <motion.div
              key={r.candidateId}
              role="listitem"
              initial={prefersReduced ? {} : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="flex items-center gap-4 rounded-brutal border-2 border-surface-border bg-surface p-4"
            >
              <span className="font-display text-lg font-bold text-text-subtle w-8 text-center">
                {i + 1}
              </span>
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: candidate.color + "20" }}
              >
                <User className="size-5" style={{ color: candidate.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold text-text">
                      {candidate.name}
                    </p>
                    <p className="text-xs text-text-subtle">
                      {candidate.party}
                    </p>
                  </div>
                  <span className="font-display text-lg font-bold text-primary shrink-0">
                    {r.score}%
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-border">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: candidate.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${r.score}%` }}
                    transition={{
                      duration: prefersReduced ? 0 : 0.8,
                      delay: i * 0.08,
                      ease: "easeOut",
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-text-muted">
                  {r.summary}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
