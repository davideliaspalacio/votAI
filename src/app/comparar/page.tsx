"use client"

import { useState } from "react"
import { Header } from "@/components/common/Header"
import { LegalFooter } from "@/components/common/LegalFooter"
import { Disclaimer } from "@/components/common/Disclaimer"
import { mockCandidates } from "@/lib/mock/candidates"
import { AXES, AXIS_LABELS } from "@/types/domain"
import { User, X, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CompararPage() {
  const [selected, setSelected] = useState<string[]>([])

  const toggleCandidate = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev
    )
  }

  const selectedCandidates = selected
    .map((id) => mockCandidates.find((c) => c.id === id))
    .filter(Boolean) as typeof mockCandidates

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <div className="mx-auto max-w-6xl flex-1 px-4 py-12">
        <h1 className="font-display text-display-sm font-bold text-text md:text-display-md">
          Comparar candidatos
        </h1>
        <p className="mt-2 text-text-muted">
          Selecciona 2 o 3 candidatos para ver sus propuestas lado a lado.
        </p>

        {/* Candidate selector */}
        <div className="mt-8 flex flex-wrap gap-2">
          {mockCandidates.map((c) => {
            const isSelected = selected.includes(c.id)
            return (
              <button
                key={c.id}
                onClick={() => toggleCandidate(c.id)}
                className={cn(
                  "flex items-center gap-2 rounded-brutal border-2 px-4 py-2 text-sm font-semibold transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 text-text"
                    : "border-surface-border bg-surface text-text-muted hover:border-surface-hover",
                  !isSelected && selected.length >= 3 && "opacity-40 cursor-not-allowed"
                )}
                disabled={!isSelected && selected.length >= 3}
              >
                {c.photo ? (
                  <img src={c.photo} alt={c.name} className="size-4 rounded-full object-cover" />
                ) : (
                  <User className="size-4" style={{ color: c.color }} />
                )}
                {c.name}
                {isSelected && <X className="size-3 text-text-subtle" />}
              </button>
            )
          })}
        </div>

        {selected.length === 0 && (
          <p className="mt-12 text-center text-text-subtle">
            Selecciona al menos 2 candidatos para empezar a comparar.
          </p>
        )}

        {selected.length === 1 && (
          <p className="mt-12 text-center text-text-subtle">
            Selecciona 1 candidato más para comparar.
          </p>
        )}

        {/* Comparison cards by axis */}
        {selectedCandidates.length >= 2 && (
          <div className="mt-10 space-y-6">
            {AXES.map((axis) => (
              <div
                key={axis}
                className="rounded-brutal border-2 border-surface-border bg-surface overflow-hidden"
              >
                <div className="border-b border-surface-border bg-surface-hover px-5 py-3">
                  <h3 className="font-display text-sm font-bold text-primary">
                    {AXIS_LABELS[axis]}
                  </h3>
                </div>
                <div className={cn(
                  "grid divide-x divide-surface-border",
                  selectedCandidates.length === 2 ? "grid-cols-2" : "grid-cols-3"
                )}>
                  {selectedCandidates.map((c) => {
                    const pos = c.positions?.[axis]
                    return (
                      <div key={c.id} className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: c.color }}
                          />
                          <span className="font-display text-xs font-bold text-text">
                            {c.name}
                          </span>
                        </div>
                        {pos ? (
                          <>
                            <p className="text-xs leading-relaxed text-text-muted">
                              {pos.summary}
                            </p>
                            <blockquote className="flex items-start gap-1.5 text-[11px] italic text-text-subtle">
                              <Quote
                                className="mt-0.5 size-2.5 shrink-0"
                                style={{ color: c.color }}
                              />
                              <span>&ldquo;{pos.quote}&rdquo;</span>
                            </blockquote>
                          </>
                        ) : (
                          <p className="text-xs italic text-text-subtle">
                            Sin propuesta específica en este eje.
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Disclaimer variant="compact" />
        </div>
      </div>
      <LegalFooter />
    </div>
  )
}
