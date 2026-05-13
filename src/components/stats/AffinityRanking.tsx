"use client"

import { useMemo } from "react"
import Link from "next/link"
import { HelpCircle } from "lucide-react"
import { mockCandidates } from "@/lib/mock/candidates"
import { formatNumber } from "@/lib/utils"

interface AffinityRankingProps {
  data: { candidateId: string; pct: number }[]
  total: number
}

interface AffinityRow {
  candidateId: string
  name: string
  color: string
  photo: string | undefined
  count: number
  pct: number
}

const fmt = (n: number) => formatNumber(n)

export function AffinityRanking({ data, total }: AffinityRankingProps) {
  const rows: AffinityRow[] = useMemo(() => {
    const result: AffinityRow[] = []
    for (const row of data) {
      const c = mockCandidates.find((x) => x.id === row.candidateId)
      if (!c) continue
      const count = Math.round((row.pct / 100) * total)
      result.push({
        candidateId: c.id,
        name: c.name,
        color: c.color,
        photo: c.photo,
        count,
        pct: row.pct,
      })
    }
    return result.sort((a, b) => b.pct - a.pct)
  }, [data, total])

  const totalCounted = rows.reduce((acc, r) => acc + r.count, 0)

  return (
    <section>
      <div className="brutal-card p-6 md:p-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-display text-xs font-semibold uppercase tracking-wider text-primary">
            Paso 3 · Afinidad real con propuestas
          </span>
          <Link
            href="/metodologia"
            className="text-text-subtle transition-colors hover:text-primary"
            aria-label="Cómo se calcula"
          >
            <HelpCircle className="size-4" />
          </Link>
        </div>

        <h2 className="font-display text-2xl font-bold text-text md:text-3xl">
          ¿Con qué candidato hay más afinidad programática?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-text-muted md:text-base">
          Después de comparar las respuestas del test con las propuestas
          oficiales de cada programa, este es el candidato #1 de afinidad de
          cada persona.
        </p>

        <ul className="mt-6 space-y-3">
          {rows.map((v, idx) => {
            const widthPct = v.pct
            return (
              <li
                key={v.candidateId}
                className="rounded-brutal border border-surface-border bg-surface/60 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-bold text-text-subtle w-6 shrink-0">
                    #{idx + 1}
                  </span>
                  <div
                    className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2"
                    style={{
                      borderColor: v.color,
                      backgroundColor: `${v.color}20`,
                    }}
                  >
                    {v.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.photo}
                        alt={v.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span
                        className="text-xs font-bold"
                        style={{ color: v.color }}
                        aria-hidden="true"
                      >
                        {v.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="flex-1 truncate font-display text-base font-semibold text-text">
                    {v.name}
                  </span>
                  <div className="text-right">
                    <p className="font-display text-xl font-bold text-text">
                      {fmt(v.count)}
                    </p>
                    <p className="text-[11px] uppercase tracking-wider text-text-subtle">
                      {v.pct.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-border">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: v.color,
                    }}
                  />
                </div>
              </li>
            )
          })}
        </ul>

        <p className="mt-4 text-[11px] text-text-subtle">
          Basado en <strong>{fmt(totalCounted || total)}</strong> tests
          completados. Cada persona contribuye con su candidato #1 de afinidad
          tras comparar sus respuestas con las propuestas del programa.
        </p>
      </div>
    </section>
  )
}
