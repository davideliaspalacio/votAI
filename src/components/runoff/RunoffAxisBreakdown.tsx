"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, FileText } from "lucide-react"
import { mockCandidates } from "@/lib/mock/candidates"
import { AXIS_LABELS, type Axis, type CandidateResult } from "@/types/domain"
import { cn } from "@/lib/utils"

const cepeda = mockCandidates.find((c) => c.id === "c1")
const abelardo = mockCandidates.find((c) => c.id === "c2")

type AxisDetail = CandidateResult["byAxis"][number]

interface RunoffAxisBreakdownProps {
  results: CandidateResult[]
}

// "El porqué" del resultado: compara, tema por tema, el plan de Cepeda contra el
// de Abelardo. No depende del enriquecimiento con IA — usa las posturas reales
// de cada plan que ya vienen en el resultado.
export function RunoffAxisBreakdown({ results }: RunoffAxisBreakdownProps) {
  const c1 = results.find((r) => r.candidateId === "c1")
  const c2 = results.find((r) => r.candidateId === "c2")
  if (!c1 || !c2 || c1.byAxis.length === 0) return null

  const c2ByAxis = new Map(c2.byAxis.map((a) => [a.axis, a]))

  return (
    <section className="mx-auto max-w-2xl px-4">
      <h3 className="mb-1 font-display text-xl font-bold text-text">
        ¿Por qué este resultado?
      </h3>
      <p className="mb-6 text-sm text-text-muted">
        Así se comparan los dos planes en cada tema. Tu afinidad sale de qué tan
        cerca quedaste de cada uno.
      </p>
      <div className="space-y-3">
        {c1.byAxis.map((a1) => (
          <AxisCard
            key={a1.axis}
            axisKey={a1.axis}
            cepedaAxis={a1}
            abelardoAxis={c2ByAxis.get(a1.axis)}
          />
        ))}
      </div>
    </section>
  )
}

function AxisCard({
  axisKey,
  cepedaAxis,
  abelardoAxis,
}: {
  axisKey: string
  cepedaAxis: AxisDetail
  abelardoAxis?: AxisDetail
}) {
  const [expanded, setExpanded] = useState(false)
  const label = AXIS_LABELS[axisKey as Axis] ?? axisKey

  return (
    <div className="rounded-brutal border-2 border-surface-border bg-surface transition-colors hover:border-primary/40">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="font-display text-base font-bold text-text">{label}</span>
        <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-text-subtle">
          {expanded ? (
            <>
              Ocultar <ChevronUp className="size-3.5" />
            </>
          ) : (
            <>
              Ver detalle <ChevronDown className="size-3.5" />
            </>
          )}
        </span>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all",
          expanded ? "max-h-[40rem] pb-5" : "max-h-0"
        )}
      >
        <div className="grid gap-3 px-5 sm:grid-cols-2">
          <PlanColumn
            name={cepeda?.name ?? "Iván Cepeda"}
            color={cepeda?.color ?? "#FFD700"}
            axis={cepedaAxis}
          />
          <PlanColumn
            name={abelardo?.name ?? "Abelardo de la Espriella"}
            color={abelardo?.color ?? "#1E3A5F"}
            axis={abelardoAxis}
          />
        </div>
      </div>
    </div>
  )
}

function PlanColumn({
  name,
  color,
  axis,
}: {
  name: string
  color: string
  axis?: AxisDetail
}) {
  return (
    <div className="rounded-md border border-surface-border bg-background/40 p-3">
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className="font-display text-sm font-bold text-text">{name}</p>
      </div>
      <p className="text-sm text-text-muted">{axis?.candidateStance}</p>
      {axis?.quote && (
        <blockquote
          className="mt-2 border-l-2 pl-3 text-xs italic text-text-subtle"
          style={{ borderColor: color + "80" }}
        >
          &ldquo;{axis.quote}&rdquo;
          {axis.programPage ? (
            <span className="ml-1 not-italic">
              <FileText className="mr-1 inline size-3" />
              Pág. {axis.programPage}
            </span>
          ) : null}
        </blockquote>
      )}
    </div>
  )
}
