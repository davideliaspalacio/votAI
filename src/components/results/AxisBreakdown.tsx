"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, FileText } from "lucide-react"
import { mockCandidates } from "@/lib/mock/candidates"
import type { CandidateResult } from "@/types/domain"
import { cn } from "@/lib/utils"

interface AxisBreakdownProps {
  topResults: CandidateResult[]
}

export function AxisBreakdown({ topResults }: AxisBreakdownProps) {
  const top = topResults[0]
  if (!top) return null

  return (
    <section className="mx-auto max-w-2xl px-4">
      <h3 className="mb-6 font-display text-xl font-bold text-text">
        Detalle por eje temático
      </h3>
      <div className="space-y-3">
        {top.byAxis.map((axis) => (
          <AxisCard key={axis.axis} axis={axis} candidateId={top.candidateId} />
        ))}
      </div>
    </section>
  )
}

function AxisCard({
  axis,
  candidateId,
}: {
  axis: CandidateResult["byAxis"][number]
  candidateId: string
}) {
  const [expanded, setExpanded] = useState(false)
  const candidate = mockCandidates.find((c) => c.id === candidateId)

  return (
    <div className="rounded-brutal border-2 border-surface-border bg-surface transition-colors hover:border-primary/40">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="font-display text-base font-bold text-text">
          {axis.axis}
        </span>
        <span
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-bold transition-colors",
            expanded
              ? "border-primary bg-primary text-background"
              : "border-primary/40 bg-primary/10 text-primary"
          )}
        >
          {expanded ? (
            <>
              Ocultar
              <ChevronUp className="size-3.5" />
            </>
          ) : (
            <>
              Ver detalle
              <ChevronDown className="size-3.5" />
            </>
          )}
        </span>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all",
          expanded ? "max-h-96 pb-5" : "max-h-0"
        )}
      >
        <div className="space-y-3 px-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md bg-primary/5 p-3">
              <p className="text-xs font-semibold text-primary">Tu postura</p>
              <p className="mt-1 text-sm text-text-muted">
                {axis.userStance || (
                  <span className="italic text-text-subtle">
                    Genera el análisis con IA para ver tu postura.
                  </span>
                )}
              </p>
            </div>
            <div
              className="rounded-md p-3"
              style={{
                backgroundColor: (candidate?.color ?? "#666") + "10",
              }}
            >
              <p
                className="text-xs font-semibold"
                style={{ color: candidate?.color }}
              >
                {candidate?.name}
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {axis.candidateStance}
              </p>
            </div>
          </div>

          {axis.quote && (
            <blockquote className="border-l-2 border-text-subtle pl-3 text-sm italic text-text-muted">
              &ldquo;{axis.quote}&rdquo;
              {axis.programPage && (
                <span className="ml-2 not-italic text-xs text-text-subtle">
                  <FileText className="mr-1 inline size-3" />
                  Pág. {axis.programPage}
                </span>
              )}
            </blockquote>
          )}
        </div>
      </div>
    </div>
  )
}
