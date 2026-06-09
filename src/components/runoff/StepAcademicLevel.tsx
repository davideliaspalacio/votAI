"use client"

import type { AcademicLevel } from "@/types/domain"
import { ACADEMIC_LEVELS } from "@/types/domain"
import { cn } from "@/lib/utils"

interface StepAcademicLevelProps {
  value: AcademicLevel | null
  onChange: (v: AcademicLevel) => void
}

export function StepAcademicLevel({ value, onChange }: StepAcademicLevelProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-display-sm font-bold text-text">
          ¿Cuál es tu nivel académico?
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Anónimo y solo para datos estadísticos agregados.
        </p>
      </div>

      <div
        className="mx-auto grid max-w-sm gap-3"
        role="radiogroup"
        aria-label="Nivel académico"
      >
        {ACADEMIC_LEVELS.map((a) => (
          <button
            key={a.value}
            type="button"
            role="radio"
            aria-checked={value === a.value}
            onClick={() => onChange(a.value)}
            className={cn(
              "rounded-brutal border-2 px-6 py-4 text-left font-display text-base font-semibold transition-all",
              value === a.value
                ? "border-primary bg-primary/10 text-text shadow-brutal-sm"
                : "border-surface-border bg-surface text-text-muted hover:border-surface-hover hover:bg-surface-hover"
            )}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  )
}
