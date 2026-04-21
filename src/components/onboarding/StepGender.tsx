"use client"

import type { Gender } from "@/types/domain"
import { cn } from "@/lib/utils"

const GENDERS: { value: Gender; label: string }[] = [
  { value: "m", label: "Masculino" },
  { value: "f", label: "Femenino" },
  { value: "nb", label: "No binario" },
  { value: "na", label: "Prefiero no decir" },
]

interface StepGenderProps {
  value: Gender | null
  onChange: (v: Gender) => void
}

export function StepGender({ value, onChange }: StepGenderProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-display-sm font-bold text-text">
          ¿Con qué género te identificas?
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Opcional. Esta información es anónima y solo se usa con fines
          estadísticos agregados.
        </p>
      </div>

      <div className="mx-auto grid max-w-sm gap-3" role="radiogroup" aria-label="Género">
        {GENDERS.map((g) => (
          <button
            key={g.value}
            type="button"
            role="radio"
            aria-checked={value === g.value}
            onClick={() => onChange(g.value)}
            className={cn(
              "rounded-brutal border-2 px-6 py-4 text-left font-display text-base font-semibold transition-all",
              value === g.value
                ? "border-primary bg-primary/10 text-text shadow-brutal-sm"
                : "border-surface-border bg-surface text-text-muted hover:border-surface-hover hover:bg-surface-hover"
            )}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  )
}
