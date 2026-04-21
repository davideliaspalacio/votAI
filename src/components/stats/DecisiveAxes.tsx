"use client"

import { AXIS_LABELS, type Axis } from "@/types/domain"
import Link from "next/link"
import { HelpCircle, Flame, Snowflake } from "lucide-react"

interface DecisiveAxesProps {
  data: { axis: string; avgWeight: number }[]
}

export function DecisiveAxes({ data }: DecisiveAxesProps) {
  const sorted = [...data].sort((a, b) => b.avgWeight - a.avgWeight)
  const maxWeight = sorted[0]?.avgWeight ?? 3

  return (
    <div className="brutal-card p-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-text">
          ¿Qué temas le importan más a la gente?
        </h3>
        <Link href="/metodologia" className="text-text-subtle hover:text-primary">
          <HelpCircle className="size-4" />
        </Link>
      </div>
      <p className="mb-5 text-xs text-text-muted">
        Ranking de ejes temáticos según la importancia que los usuarios les
        asignaron con el slider (1 = poco, 3 = muy importante).
      </p>

      <div className="space-y-3">
        {sorted.map((d, i) => {
          const pct = (d.avgWeight / 3) * 100
          const isTop3 = i < 3
          const isBottom3 = i >= sorted.length - 3

          return (
            <div key={d.axis}>
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-right text-xs font-bold text-text-subtle">
                    {i + 1}.
                  </span>
                  {isTop3 && <Flame className="size-3 text-accent" />}
                  {isBottom3 && <Snowflake className="size-3 text-text-subtle" />}
                  <span className="text-xs font-semibold text-text">
                    {AXIS_LABELS[d.axis as Axis] ?? d.axis}
                  </span>
                </div>
                <span className="text-xs font-bold text-primary">
                  {d.avgWeight.toFixed(1)}/3
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-surface-border">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: isTop3 ? "#FFDE3A" : isBottom3 ? "#71717A" : "#A1A1AA",
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Insight */}
      <div className="mt-5 rounded-md border border-surface-border bg-surface-hover px-4 py-3">
        <p className="text-xs text-text-muted">
          <strong className="text-text">En resumen:</strong> A los colombianos
          lo que más les importa es la{" "}
          <strong className="text-primary">
            {AXIS_LABELS[sorted[0]?.axis as Axis]}
          </strong>{" "}
          y la{" "}
          <strong className="text-primary">
            {AXIS_LABELS[sorted[1]?.axis as Axis]}
          </strong>
          . Lo que menos peso tiene es{" "}
          <strong className="text-text-subtle">
            {AXIS_LABELS[sorted[sorted.length - 1]?.axis as Axis]}
          </strong>
          .
        </p>
      </div>
    </div>
  )
}
