"use client"

import { cn } from "@/lib/utils"
import { mockCandidates } from "@/lib/mock/candidates"
import { RUNOFF_CANDIDATE_IDS } from "@/types/domain"
import { ShieldCheck, User } from "lucide-react"

// Solo los dos candidatos de la segunda vuelta: Cepeda (c1) y Abelardo (c2).
const RUNOFF_CANDIDATES = mockCandidates.filter((c) =>
  (RUNOFF_CANDIDATE_IDS as readonly string[]).includes(c.id)
)

const SPECIAL_OPTIONS = [
  { value: "blank", label: "Voto en blanco" },
  { value: "undecided", label: "Aún no decido" },
  { value: "na", label: "Prefiero no decir" },
]

interface StepRunoffIntentionProps {
  value: string | null
  onChange: (v: string) => void
}

export function StepRunoffIntention({
  value,
  onChange,
}: StepRunoffIntentionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-display-sm font-bold text-text">
          En segunda vuelta,{" "}
          <span className="text-primary">¿por quién piensas votar?</span>
        </h2>
        <div className="mx-auto mt-3 flex items-start gap-2 rounded-brutal border border-surface-border bg-surface px-4 py-3 text-sm text-text-muted max-w-md">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
          <p>
            Tu respuesta es anónima y solo se usa en datos agregados. Nadie
            sabrá qué contestaste.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-sm space-y-2">
        <div
          className="grid gap-2"
          role="radiogroup"
          aria-label="Intención de voto en segunda vuelta"
        >
          {RUNOFF_CANDIDATES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={value === c.id}
              onClick={() => onChange(c.id)}
              className={cn(
                "flex items-center gap-3 rounded-brutal border-2 px-4 py-3 text-left transition-all",
                value === c.id
                  ? "border-primary bg-primary/10 text-text shadow-brutal-sm"
                  : "border-surface-border bg-surface text-text-muted hover:border-surface-hover hover:bg-surface-hover"
              )}
            >
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: c.color + "20" }}
              >
                {c.photo ? (
                  <img
                    src={c.photo}
                    alt={c.name}
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <User className="size-4" style={{ color: c.color }} />
                )}
              </div>
              <div>
                <span className="font-display text-sm font-semibold">
                  {c.name}
                </span>
                <span className="ml-2 text-xs text-text-subtle">{c.party}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="pt-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-subtle">
            Otras opciones
          </p>
          <div className="grid gap-2">
            {SPECIAL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={value === opt.value}
                onClick={() => onChange(opt.value)}
                className={cn(
                  "rounded-brutal border-2 px-4 py-3 text-left font-display text-sm font-semibold transition-all",
                  value === opt.value
                    ? "border-accent bg-accent/10 text-text shadow-brutal-sm"
                    : "border-surface-border bg-surface text-text-muted hover:border-surface-hover hover:bg-surface-hover"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
