"use client"

import { mockCandidates } from "@/lib/mock/candidates"
import Link from "next/link"
import { HelpCircle, TrendingUp, TrendingDown } from "lucide-react"

interface AgeDistributionProps {
  data: {
    range: string
    distribution: { candidateId: string; pct: number }[]
  }[]
}

const AGE_LABELS: Record<string, string> = {
  "18-24": "18–24 (Gen Z)",
  "25-34": "25–34 (Millennials)",
  "35-49": "35–49",
  "50-64": "50–64",
  "65+": "65+",
}

export function AgeDistribution({ data }: AgeDistributionProps) {
  // Find the top candidate per age group for insights
  const topPerAge = data.map((d) => {
    const sorted = [...d.distribution].sort((a, b) => b.pct - a.pct)
    const top = sorted[0]
    const c = mockCandidates.find((c) => c.id === top?.candidateId)
    return { range: d.range, candidate: c, pct: top?.pct ?? 0 }
  })

  return (
    <div className="brutal-card p-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-text">
          ¿Cómo piensa cada generación?
        </h3>
        <Link href="/metodologia" className="text-text-subtle hover:text-primary">
          <HelpCircle className="size-4" />
        </Link>
      </div>
      <p className="mb-5 text-xs text-text-muted">
        El candidato con mayor afinidad programática por rango de edad.
        Los jóvenes y los mayores tienen gustos MUY distintos.
      </p>

      {/* Visual bars per age group */}
      <div className="space-y-4">
        {data.map((d) => {
          const sorted = [...d.distribution].sort((a, b) => b.pct - a.pct)
          const top3 = sorted.slice(0, 3)

          return (
            <div key={d.range}>
              <p className="mb-1.5 text-xs font-semibold text-text">
                {AGE_LABELS[d.range] ?? d.range}
              </p>

              {/* Stacked bar */}
              <div className="flex h-8 overflow-hidden rounded-brutal">
                {top3.map((entry) => {
                  const c = mockCandidates.find(
                    (c) => c.id === entry.candidateId
                  )
                  return (
                    <div
                      key={entry.candidateId}
                      className="flex items-center justify-center overflow-hidden text-[10px] font-bold"
                      style={{
                        width: `${entry.pct}%`,
                        backgroundColor: c?.color ?? "#666",
                        color: "#0B0B0F",
                      }}
                      title={`${c?.name}: ${entry.pct}%`}
                    >
                      {entry.pct > 12 ? `${c?.name?.split(" ")[0]} ${entry.pct}%` : ""}
                    </div>
                  )
                })}
                <div
                  className="flex flex-1 items-center justify-center text-[10px] text-text-subtle bg-surface-border"
                >
                  {sorted.slice(3).reduce((acc, e) => acc + e.pct, 0) > 5
                    ? "Otros"
                    : ""}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Insights */}
      <div className="mt-5 space-y-2">
        <div className="flex items-start gap-2 rounded-md border border-surface-border bg-surface-hover px-3 py-2">
          <TrendingUp className="mt-0.5 size-3.5 shrink-0 text-success" />
          <p className="text-xs text-text-muted">
            <strong className="text-text">Los más jóvenes (18-24)</strong>{" "}
            tienen mayor afinidad con{" "}
            <strong style={{ color: topPerAge[0]?.candidate?.color }}>
              {topPerAge[0]?.candidate?.name}
            </strong>{" "}
            ({topPerAge[0]?.pct}%). Es el grupo más concentrado.
          </p>
        </div>
        <div className="flex items-start gap-2 rounded-md border border-surface-border bg-surface-hover px-3 py-2">
          <TrendingDown className="mt-0.5 size-3.5 shrink-0 text-accent" />
          <p className="text-xs text-text-muted">
            <strong className="text-text">Los mayores de 65</strong> se
            inclinan más hacia{" "}
            <strong style={{ color: topPerAge[topPerAge.length - 1]?.candidate?.color }}>
              {topPerAge[topPerAge.length - 1]?.candidate?.name}
            </strong>
            . Es la generación más conservadora programáticamente.
          </p>
        </div>
      </div>
    </div>
  )
}
