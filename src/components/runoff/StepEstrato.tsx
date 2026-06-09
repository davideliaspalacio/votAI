"use client"

import type { Estrato } from "@/types/domain"
import { STRATA } from "@/types/domain"
import { cn } from "@/lib/utils"

interface StepEstratoProps {
  value: Estrato | null
  onChange: (v: Estrato) => void
}

export function StepEstrato({ value, onChange }: StepEstratoProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-display-sm font-bold text-text">
          ¿Cuál es tu estrato socioeconómico?
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Anónimo y solo para datos estadísticos agregados.
        </p>
      </div>

      <div
        className="mx-auto grid max-w-sm grid-cols-2 gap-3"
        role="radiogroup"
        aria-label="Estrato socioeconómico"
      >
        {STRATA.map((s) => (
          <button
            key={s.value}
            type="button"
            role="radio"
            aria-checked={value === s.value}
            onClick={() => onChange(s.value)}
            className={cn(
              "rounded-brutal border-2 px-6 py-4 text-center font-display text-base font-semibold transition-all",
              s.value === "na" && "col-span-2",
              value === s.value
                ? "border-primary bg-primary/10 text-text shadow-brutal-sm"
                : "border-surface-border bg-surface text-text-muted hover:border-surface-hover hover:bg-surface-hover"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
