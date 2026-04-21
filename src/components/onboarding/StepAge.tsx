"use client"

import type { AgeRange } from "@/types/domain"
import { cn } from "@/lib/utils"

const AGE_RANGES: { value: AgeRange; label: string }[] = [
  { value: "18-24", label: "18 – 24 años" },
  { value: "25-34", label: "25 – 34 años" },
  { value: "35-49", label: "35 – 49 años" },
  { value: "50-64", label: "50 – 64 años" },
  { value: "65+", label: "65 años o más" },
]

interface StepAgeProps {
  value: AgeRange | null
  onChange: (v: AgeRange) => void
}

export function StepAge({ value, onChange }: StepAgeProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-display-sm font-bold text-text">
          ¿Cuántos años tienes?
        </h2>
        <p className="mt-2 text-text-muted">
          Selecciona tu rango de edad
        </p>
      </div>

      <div className="mx-auto grid max-w-sm gap-3" role="radiogroup" aria-label="Rango de edad">
        {AGE_RANGES.map((range) => (
          <button
            key={range.value}
            type="button"
            role="radio"
            aria-checked={value === range.value}
            onClick={() => onChange(range.value)}
            className={cn(
              "rounded-brutal border-2 px-6 py-4 text-left font-display text-base font-semibold transition-all",
              value === range.value
                ? "border-primary bg-primary/10 text-text shadow-brutal-sm"
                : "border-surface-border bg-surface text-text-muted hover:border-surface-hover hover:bg-surface-hover"
            )}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  )
}
