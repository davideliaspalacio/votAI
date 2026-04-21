"use client"

import { cn } from "@/lib/utils"

const LEVELS = [
  { value: 1, label: "Poco importante" },
  { value: 2, label: "Importante" },
  { value: 3, label: "Muy importante" },
] as const

interface ImportanceSliderProps {
  value: 1 | 2 | 3
  onChange: (v: 1 | 2 | 3) => void
}

export function ImportanceSlider({ value, onChange }: ImportanceSliderProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-text-subtle">
        ¿Qué tan importante es este tema para ti?
      </p>
      <div
        className="flex gap-2"
        role="radiogroup"
        aria-label="Importancia del tema"
      >
        {LEVELS.map((level) => (
          <button
            key={level.value}
            type="button"
            role="radio"
            aria-checked={value === level.value}
            onClick={() => onChange(level.value)}
            className={cn(
              "flex-1 rounded-brutal border-2 px-3 py-2 text-xs font-semibold transition-all",
              value === level.value
                ? "border-accent bg-accent/10 text-accent"
                : "border-surface-border bg-surface text-text-subtle hover:border-surface-hover"
            )}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  )
}
