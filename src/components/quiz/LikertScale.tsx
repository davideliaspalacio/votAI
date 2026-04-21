"use client"

import { cn } from "@/lib/utils"

const LABELS = [
  "Muy en desacuerdo",
  "En desacuerdo",
  "Neutral",
  "De acuerdo",
  "Muy de acuerdo",
]

interface LikertScaleProps {
  value?: number
  onChange: (v: number) => void
}

export function LikertScale({ value, onChange }: LikertScaleProps) {
  return (
    <div
      className="grid gap-2 sm:grid-cols-5"
      role="radiogroup"
      aria-label="Nivel de acuerdo"
    >
      {LABELS.map((label, i) => {
        const v = i + 1
        const isSelected = value === v
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${v} de 5: ${label}`}
            onClick={() => onChange(v)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-brutal border-2 px-3 py-3 text-center transition-all sm:px-2 sm:py-4",
              isSelected
                ? "border-primary bg-primary/10 text-text shadow-brutal-sm scale-[1.02]"
                : "border-surface-border bg-surface text-text-muted hover:border-surface-hover hover:bg-surface-hover"
            )}
          >
            <span className="text-lg font-bold font-display">{v}</span>
            <span className="text-[11px] leading-tight">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
