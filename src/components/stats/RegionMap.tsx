"use client"

import { mockCandidates } from "@/lib/mock/candidates"
import { REGIONS } from "@/types/domain"
import { MapPin, Crown } from "lucide-react"
import Link from "next/link"
import { HelpCircle } from "lucide-react"

interface RegionMapProps {
  data: {
    region: string
    top3: { candidateId: string; pct: number }[]
  }[]
}

export function RegionMap({ data }: RegionMapProps) {
  return (
    <div className="brutal-card p-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-text">
          ¿Qué piensan en cada región?
        </h3>
        <Link href="/metodologia" className="text-text-subtle hover:text-primary">
          <HelpCircle className="size-4" />
        </Link>
      </div>
      <p className="mb-4 text-xs text-text-muted">
        El candidato con mayor afinidad programática agregada por cada región
        natural de Colombia.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {data.map((region) => {
          const regionLabel =
            REGIONS.find((r) => r.value === region.region)?.label ??
            region.region
          const topCandidate = mockCandidates.find(
            (c) => c.id === region.top3[0]?.candidateId
          )
          const topPct = region.top3[0]?.pct

          return (
            <div
              key={region.region}
              className="rounded-brutal border-2 p-4"
              style={{
                borderColor: topCandidate?.color ?? "#2A2A3A",
                backgroundColor: (topCandidate?.color ?? "#14141B") + "08",
              }}
            >
              <div className="flex items-center gap-1.5">
                <MapPin
                  className="size-4"
                  style={{ color: topCandidate?.color }}
                />
                <p className="font-display text-xs font-bold text-text">
                  {regionLabel}
                </p>
              </div>

              {/* Winner */}
              <div className="mt-3 flex items-center gap-1.5">
                <Crown className="size-3" style={{ color: topCandidate?.color }} />
                <p className="text-xs font-bold" style={{ color: topCandidate?.color }}>
                  {topCandidate?.name}
                </p>
              </div>
              <p className="text-[11px] text-text-muted">
                {topPct?.toFixed(1)}% de afinidad agregada
              </p>

              {/* Runners up */}
              <div className="mt-2 space-y-0.5">
                {region.top3.slice(1).map((entry, i) => {
                  const c = mockCandidates.find(
                    (c) => c.id === entry.candidateId
                  )
                  return (
                    <p key={entry.candidateId} className="text-[10px] text-text-subtle">
                      {i + 2}. {c?.name} ({entry.pct.toFixed(1)}%)
                    </p>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Insight */}
      <div className="mt-4 rounded-md border border-surface-border bg-surface-hover px-4 py-3">
        <p className="text-xs text-text-muted">
          <strong className="text-text">Dato curioso:</strong> La región{" "}
          <strong className="text-text">Pacífica</strong> es donde más
          concentrada está la afinidad: un solo candidato supera el 28%.
          En la <strong className="text-text">Insular</strong>, la competencia
          es más reñida.
        </p>
      </div>

      {/* Accessible table */}
      <details className="mt-3">
        <summary className="cursor-pointer text-[11px] text-text-subtle hover:text-text-muted">
          Ver datos en tabla accesible
        </summary>
        <table className="mt-2 w-full text-[11px]" aria-label="Afinidad por región">
          <thead>
            <tr>
              <th className="text-left text-text-subtle py-1">Región</th>
              <th className="text-left text-text-subtle py-1">#1</th>
              <th className="text-left text-text-subtle py-1">#2</th>
              <th className="text-left text-text-subtle py-1">#3</th>
            </tr>
          </thead>
          <tbody>
            {data.map((region) => {
              const label =
                REGIONS.find((r) => r.value === region.region)?.label ??
                region.region
              return (
                <tr key={region.region}>
                  <td className="text-text-muted py-1">{label}</td>
                  {region.top3.map((entry) => {
                    const c = mockCandidates.find(
                      (c) => c.id === entry.candidateId
                    )
                    return (
                      <td key={entry.candidateId} className="text-text-muted py-1">
                        {c?.name} ({entry.pct.toFixed(1)}%)
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </details>
    </div>
  )
}
