"use client"

import { AXIS_LABELS, type Axis } from "@/types/domain"
import Link from "next/link"
import { HelpCircle, Handshake, Swords } from "lucide-react"

interface PolarizationChartProps {
  data: { axis: string; polarizationScore: number }[]
}

function getLabel(score: number): { text: string; color: string } {
  if (score >= 0.7) return { text: "Muy divididos", color: "#EF4444" }
  if (score >= 0.5) return { text: "Divididos", color: "#F59E0B" }
  if (score >= 0.35) return { text: "Algo de acuerdo", color: "#A1A1AA" }
  return { text: "Bastante consenso", color: "#22C55E" }
}

export function PolarizationChart({ data }: PolarizationChartProps) {
  const sorted = [...data].sort((a, b) => b.polarizationScore - a.polarizationScore)
  const mostPolarized = sorted[0]
  const leastPolarized = sorted[sorted.length - 1]

  return (
    <div className="brutal-card p-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-text">
          ¿En qué estamos de acuerdo (y en qué no)?
        </h3>
        <Link href="/metodologia" className="text-text-subtle hover:text-primary">
          <HelpCircle className="size-4" />
        </Link>
      </div>
      <p className="mb-5 text-xs text-text-muted">
        Qué tan divididas están las opiniones de los usuarios en cada tema.
        Entre más rojo, más nos peleamos por ese tema.
      </p>

      <div className="space-y-3">
        {sorted.map((d) => {
          const pct = d.polarizationScore * 100
          const label = getLabel(d.polarizationScore)

          return (
            <div key={d.axis}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-text">
                  {AXIS_LABELS[d.axis as Axis] ?? d.axis}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{
                    backgroundColor: label.color + "15",
                    color: label.color,
                  }}
                >
                  {label.text}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-surface-border">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: label.color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Insights */}
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2">
          <Swords className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p className="text-xs text-text-muted">
            <strong className="text-text">Tema más polarizante:</strong>{" "}
            {AXIS_LABELS[mostPolarized?.axis as Axis]}. Los colombianos tienen
            opiniones radicalmente opuestas.
          </p>
        </div>
        <div className="flex items-start gap-2 rounded-md border border-success/20 bg-success/5 px-3 py-2">
          <Handshake className="mt-0.5 size-4 shrink-0 text-success" />
          <p className="text-xs text-text-muted">
            <strong className="text-text">Mayor consenso:</strong>{" "}
            {AXIS_LABELS[leastPolarized?.axis as Axis]}. Aquí la mayoría
            piensa parecido.
          </p>
        </div>
      </div>
    </div>
  )
}
