"use client"

import { ArrowRight, BarChart3, Gauge, Scale, Split, Vote } from "lucide-react"
import {
  ACADEMIC_LEVELS,
  AXIS_LABELS,
  REGIONS,
  STRATA,
  type Axis,
  type RunoffFlowStat,
  type RunoffSegmentStat,
  type RunoffStats,
} from "@/types/domain"
import { mockCandidates } from "@/lib/mock/candidates"
import { formatNumber } from "@/lib/utils"

interface RunoffStatsPanelProps {
  stats: RunoffStats
}

const SPECIAL_LABELS: Record<string, string> = {
  blank: "Voto en blanco",
  undecided: "Indeciso",
  no_vote: "No votó",
  na: "No responde",
}

const GENDER_LABELS: Record<string, string> = {
  f: "Mujeres",
  m: "Hombres",
  nb: "No binario",
  na: "No responde",
}

const CHOICE_LABELS: Record<string, string> = {
  affinity: "Votaría por afinidad",
  intention: "Mantendría su intención",
}

export function RunoffStatsPanel({ stats }: RunoffStatsPanelProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          icon={<Vote className="size-5" />}
          label="Tests completados"
          value={formatNumber(stats.total_sessions)}
          sub="Muestra autoseleccionada de segunda vuelta"
        />
        <MetricCard
          icon={<Gauge className="size-5" />}
          label="Intención y afinidad coinciden"
          value={`${stats.preference_match_pct.toFixed(1)}%`}
          sub={`${formatNumber(stats.preference_match_total)} personas con intención c1/c2`}
        />
        <MetricCard
          icon={<Scale className="size-5" />}
          label="Afinidad en blanco"
          value={`${stats.blank_vote_pct.toFixed(1)}%`}
          sub="Peso de respuestas tipo ninguno de los dos"
        />
        <MetricCard
          icon={<Split className="size-5" />}
          label="Comparación cerrada"
          value={`${stats.closest_race_pct.toFixed(1)}%`}
          sub={`Margen promedio: ${stats.avg_margin.toFixed(1)} puntos`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <CandidateAffinityCard stats={stats} />
        <CountsCard
          title="Intención declarada de segunda vuelta"
          description="Antes de ver el resultado, esto decía la gente que pensaba hacer."
          rows={stats.runoff_intention_counts}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FlowCard
          title="Transferencia desde primera vuelta"
          description="Toma el voto declarado de primera vuelta y muestra hacia qué plan se movió la afinidad."
          flows={stats.transfer_from_first_round}
        />
        <FlowCard
          title="Intención vs afinidad"
          description="Compara la intención de segunda vuelta con el candidato que salió más afín en el test."
          flows={stats.intention_vs_affinity}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <CountsCard
          title="Después del resultado"
          description="De quienes respondieron, mide si votarían por el plan más afín o por su intención previa."
          rows={stats.vote_choice_counts}
          emptyText="Todavía no hay respuestas suficientes a esta pregunta."
          labelForValue={(value) => CHOICE_LABELS[value] ?? formatValueLabel(value)}
        />
        <SegmentCard
          title="Cortes por región"
          description="Distribución de afinidad, coincidencia intención/afinidad y peso del blanco por región."
          rows={stats.by_region}
          labelForSegment={(value) =>
            REGIONS.find((region) => region.value === value)?.label ?? value
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SegmentCard
          title="Por género"
          description="Cómo se reparte la afinidad según el género reportado."
          rows={stats.by_gender}
          labelForSegment={(value) => GENDER_LABELS[value] ?? value}
        />
        <SegmentCard
          title="Por edad"
          description="Dónde se inclina cada generación."
          rows={stats.by_age}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SegmentCard
          title="Por estrato"
          description="Cómo se mueve la afinidad por estrato socioeconómico."
          rows={stats.by_estrato}
          labelForSegment={(value) =>
            STRATA.find((stratum) => stratum.value === value)?.label ?? value
          }
        />
        <SegmentCard
          title="Por nivel académico"
          description="Cortes por el nivel reportado en onboarding."
          rows={stats.by_academic_level}
          labelForSegment={(value) =>
            ACADEMIC_LEVELS.find((level) => level.value === value)?.label ??
            value
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AxisCard
          title="Temas más decisivos"
          description="Promedio de importancia asignada a cada eje."
          rows={stats.decisive_axes.map((row) => ({
            key: row.axis,
            value: row.avgWeight,
            max: 3,
            suffix: "/3",
          }))}
        />
        <AxisCard
          title="Temas más polarizados"
          description="Qué ejes tienen respuestas más separadas entre sí."
          rows={stats.polarization_by_axis.map((row) => ({
            key: row.axis,
            value: row.polarizationScore,
            max: 1,
            suffix: "",
          }))}
        />
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="brutal-card p-5">
      <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="font-display text-3xl font-bold text-text">{value}</p>
      <p className="mt-1 text-sm font-semibold text-text">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-text-muted">{sub}</p>
    </div>
  )
}

function CandidateAffinityCard({ stats }: { stats: RunoffStats }) {
  return (
    <div className="brutal-card p-6">
      <div className="mb-1 flex items-center gap-2">
        <BarChart3 className="size-4 text-primary" />
        <h3 className="font-display text-sm font-bold text-text">
          Afinidad agregada
        </h3>
      </div>
      <p className="mb-5 text-xs leading-relaxed text-text-muted">
        Cuenta cuántas personas quedaron más cerca del plan de Cepeda o del de
        Abelardo. El puntaje promedio muestra la fuerza de esa cercanía.
      </p>

      <div className="space-y-4">
        {stats.aggregate_affinity.map((entry) => {
          const candidate = getCandidate(entry.candidateId)
          return (
            <div key={entry.candidateId}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-text">
                    {candidate.name}
                  </p>
                  <p className="text-xs text-text-subtle">
                    {formatNumber(entry.count)} tests
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold text-primary">
                    {entry.pct.toFixed(1)}%
                  </p>
                  <p className="text-[11px] text-text-subtle">
                    score {entry.avgScore.toFixed(1)}
                  </p>
                </div>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-surface-border">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${entry.pct}%`,
                    backgroundColor: candidate.color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CountsCard({
  title,
  description,
  rows,
  emptyText = "No hay datos disponibles todavía.",
  labelForValue = formatValueLabel,
}: {
  title: string
  description: string
  rows: { value: string; count: number; pct: number }[]
  emptyText?: string
  labelForValue?: (value: string) => string
}) {
  const max = Math.max(...rows.map((row) => row.count), 1)

  return (
    <div className="brutal-card p-6">
      <h3 className="font-display text-sm font-bold text-text">{title}</h3>
      <p className="mb-5 mt-1 text-xs leading-relaxed text-text-muted">
        {description}
      </p>

      {rows.length === 0 ? (
        <p className="text-sm text-text-muted">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {rows.slice(0, 6).map((row) => {
            const label = labelForValue(row.value)
            const color = colorForValue(row.value)
            return (
              <div key={row.value}>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="truncate text-xs font-semibold text-text">
                    {label}
                  </span>
                  <span className="shrink-0 text-xs font-bold text-primary">
                    {row.pct.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-border">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(row.count / max) * 100}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <span className="w-12 text-right text-[11px] text-text-subtle">
                    {formatNumber(row.count)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FlowCard({
  title,
  description,
  flows,
}: {
  title: string
  description: string
  flows: RunoffFlowStat[]
}) {
  return (
    <div className="brutal-card p-6">
      <h3 className="font-display text-sm font-bold text-text">{title}</h3>
      <p className="mb-5 mt-1 text-xs leading-relaxed text-text-muted">
        {description}
      </p>

      <div className="space-y-4">
        {flows.slice(0, 6).map((flow) => (
          <div
            key={flow.fromCandidateId}
            className="rounded-md border border-surface-border bg-surface-hover p-4"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="truncate text-sm font-bold text-text">
                {formatValueLabel(flow.fromCandidateId)}
              </p>
              <p className="shrink-0 text-xs text-text-subtle">
                N = {formatNumber(flow.total)}
              </p>
            </div>

            <div className="flex h-7 overflow-hidden rounded-full bg-surface-border">
              {flow.to.map((destination) => {
                const candidate = getCandidate(destination.candidateId)
                return (
                  <div
                    key={destination.candidateId}
                    className="flex min-w-0 items-center justify-center px-1 text-[10px] font-bold text-background"
                    style={{
                      width: `${destination.pct}%`,
                      backgroundColor: candidate.color,
                    }}
                    title={`${candidate.name}: ${destination.pct.toFixed(1)}%`}
                  >
                    {destination.pct >= 18
                      ? `${candidate.name.split(" ")[0]} ${destination.pct.toFixed(0)}%`
                      : ""}
                  </div>
                )
              })}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {flow.to.map((destination) => {
                const candidate = getCandidate(destination.candidateId)
                return (
                  <span
                    key={destination.candidateId}
                    className="inline-flex items-center gap-1 rounded-md border border-surface-border px-2 py-1 text-[11px] text-text-muted"
                  >
                    <ArrowRight
                      className="size-3"
                      style={{ color: candidate.color }}
                    />
                    {candidate.name}: {destination.pct.toFixed(1)}%
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SegmentCard({
  title,
  description,
  rows,
  labelForSegment = (value) => value,
}: {
  title: string
  description: string
  rows: RunoffSegmentStat[]
  labelForSegment?: (value: string) => string
}) {
  return (
    <div className="brutal-card p-6">
      <h3 className="font-display text-sm font-bold text-text">{title}</h3>
      <p className="mb-5 mt-1 text-xs leading-relaxed text-text-muted">
        {description}
      </p>

      <div className="space-y-4">
        {rows.slice(0, 6).map((row) => (
          <div key={row.segment}>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <p className="truncate text-xs font-bold text-text">
                {labelForSegment(row.segment)}
              </p>
              <p className="shrink-0 text-[11px] text-text-subtle">
                N = {formatNumber(row.total)}
              </p>
            </div>
            <div className="flex h-6 overflow-hidden rounded-full bg-surface-border">
              {row.distribution.map((entry) => {
                const candidate = getCandidate(entry.candidateId)
                return (
                  <div
                    key={entry.candidateId}
                    className="flex items-center justify-center text-[10px] font-bold text-background"
                    style={{
                      width: `${entry.pct}%`,
                      backgroundColor: candidate.color,
                    }}
                    title={`${candidate.name}: ${entry.pct.toFixed(1)}%`}
                  >
                    {entry.pct >= 24 ? `${entry.pct.toFixed(0)}%` : ""}
                  </div>
                )
              })}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-text-subtle">
              <span>Coincide: {row.matchPct.toFixed(1)}%</span>
              <span>Blanco: {row.blankPct.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AxisCard({
  title,
  description,
  rows,
}: {
  title: string
  description: string
  rows: { key: string; value: number; max: number; suffix: string }[]
}) {
  return (
    <div className="brutal-card p-6">
      <h3 className="font-display text-sm font-bold text-text">{title}</h3>
      <p className="mb-5 mt-1 text-xs leading-relaxed text-text-muted">
        {description}
      </p>

      <div className="space-y-3">
        {rows.slice(0, 8).map((row) => (
          <div key={row.key}>
            <div className="mb-1 flex items-center justify-between gap-3">
              <p className="truncate text-xs font-semibold text-text">
                {AXIS_LABELS[row.key as Axis] ?? row.key}
              </p>
              <p className="shrink-0 text-xs font-bold text-primary">
                {row.value.toFixed(1)}
                {row.suffix}
              </p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-surface-border">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${Math.min((row.value / row.max) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function getCandidate(candidateId: string) {
  const candidate = mockCandidates.find((item) => item.id === candidateId)
  return {
    name: candidate?.name ?? formatValueLabel(candidateId),
    color: candidate?.color ?? "#A1A1AA",
  }
}

function colorForValue(value: string) {
  if (value === "blank") return getCandidate("c0").color
  if (value === "undecided" || value === "na" || value === "no_vote") {
    return "#A1A1AA"
  }
  return getCandidate(value).color
}

function formatValueLabel(value: string) {
  return getCandidateName(value) ?? SPECIAL_LABELS[value] ?? value
}

function getCandidateName(value: string) {
  return mockCandidates.find((candidate) => candidate.id === value)?.name
}
