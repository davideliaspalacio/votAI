"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ArrowRight, HelpCircle } from "lucide-react"
import { mockCandidates } from "@/lib/mock/candidates"
import { formatNumber } from "@/lib/utils"

interface MigrationHeroProps {
  gapPct: number
  data: {
    fromCandidateId: string
    fromTotal?: number
    to: { candidateId: string; pct: number; count?: number }[]
  }[]
  initialPreferenceCounts?: {
    preference: string
    count: number
    pct: number
  }[]
  total: number
}

const SPECIAL_PREF_LABELS: Record<string, { label: string; color: string }> = {
  undecided: { label: "Indecisos", color: "#6b7280" },
  blank: { label: "Voto en blanco / Ninguno", color: "#9ca3af" },
  na: { label: "No respondió", color: "#4b5563" },
}

interface InitialVote {
  candidateId: string
  name: string
  color: string
  photo: string | undefined
  count: number | null
  pct: number | null
}

interface FlowDetail {
  fromId: string
  fromName: string
  fromColor: string
  fromPhoto?: string
  fromTotal: number | null
  stayedPct: number
  stayedCount: number | null
  migratedPct: number
  migratedCount: number | null
  destinations: {
    candidateId: string
    name: string
    color: string
    photo?: string
    pct: number
    count: number | null
  }[]
}

const fmt = (n: number) => formatNumber(n)

export function MigrationHero({
  gapPct,
  data,
  initialPreferenceCounts,
  total,
}: MigrationHeroProps) {
  const initialVotes: InitialVote[] = useMemo(() => {
    if (initialPreferenceCounts && initialPreferenceCounts.length > 0) {
      const result: InitialVote[] = []
      for (const row of initialPreferenceCounts) {
        const candidate = mockCandidates.find((c) => c.id === row.preference)
        if (candidate) {
          result.push({
            candidateId: candidate.id,
            name: candidate.name,
            color: candidate.color,
            photo: candidate.photo,
            count: row.count,
            pct: row.pct,
          })
        } else {
          const special =
            SPECIAL_PREF_LABELS[row.preference] ?? {
              label: row.preference,
              color: "#6b7280",
            }
          result.push({
            candidateId: row.preference,
            name: special.label,
            color: special.color,
            photo: undefined,
            count: row.count,
            pct: row.pct,
          })
        }
      }
      return result.sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
    }
    const totalDeclared = data.reduce(
      (acc, f) => acc + (f.fromTotal ?? 0),
      0,
    )
    const result: InitialVote[] = []
    for (const flow of data) {
      const c = mockCandidates.find((x) => x.id === flow.fromCandidateId)
      if (!c) continue
      const count = flow.fromTotal ?? null
      const pct =
        count !== null && totalDeclared > 0
          ? Math.round((count / totalDeclared) * 1000) / 10
          : null
      result.push({
        candidateId: c.id,
        name: c.name,
        color: c.color,
        photo: c.photo,
        count,
        pct,
      })
    }
    return result.sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
  }, [data, initialPreferenceCounts])

  const totalAll = useMemo(
    () => initialVotes.reduce((acc, v) => acc + (v.count ?? 0), 0),
    [initialVotes],
  )

  const flows: FlowDetail[] = useMemo(() => {
    const result: FlowDetail[] = []
    for (const flow of data) {
      const from = mockCandidates.find((c) => c.id === flow.fromCandidateId)
      if (!from) continue
      const stayed = flow.to.find(
        (t) => t.candidateId === flow.fromCandidateId,
      )
      const stayedPct = stayed?.pct ?? 0
      const stayedCount = stayed?.count ?? null
      const migratedPct = Math.max(0, 100 - stayedPct)
      const fromTotal = flow.fromTotal ?? null
      const migratedCount =
        fromTotal !== null && stayedCount !== null
          ? Math.max(0, fromTotal - stayedCount)
          : null
      const destinations = flow.to
        .filter((t) => t.candidateId !== flow.fromCandidateId)
        .sort((a, b) => b.pct - a.pct)
        .map((t) => {
          const c = mockCandidates.find((x) => x.id === t.candidateId)
          return {
            candidateId: t.candidateId,
            name: c?.name ?? t.candidateId,
            color: c?.color ?? "#666",
            photo: c?.photo,
            pct: t.pct,
            count: t.count ?? null,
          }
        })
      result.push({
        fromId: from.id,
        fromName: from.name,
        fromColor: from.color,
        fromPhoto: from.photo,
        fromTotal,
        stayedPct,
        stayedCount,
        migratedPct,
        migratedCount,
        destinations,
      })
    }
    return result.sort((a, b) => (b.fromTotal ?? 0) - (a.fromTotal ?? 0))
  }, [data])

  return (
    <section className="space-y-6">
      <div className="brutal-card p-6 md:p-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-display text-xs font-semibold uppercase tracking-wider text-primary">
            Paso 1 · Voto inicial declarado
          </span>
          <Link
            href="/metodologia"
            className="text-text-subtle transition-colors hover:text-primary"
            aria-label="Cómo se calcula"
          >
            <HelpCircle className="size-4" />
          </Link>
        </div>

        <h2 className="font-display text-2xl font-bold text-text md:text-3xl">
          ¿Por quién votarían sin haber visto las propuestas?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-text-muted md:text-base">
          Antes de hacer el test, cada persona declara qué candidato apoyaría.
          Esta es la distribución de esa preferencia inicial.
        </p>

        <ul className="mt-6 space-y-3">
          {initialVotes.map((v, idx) => {
            const widthPct = v.pct ?? 0
            return (
              <li
                key={v.candidateId}
                className="rounded-brutal border border-surface-border bg-surface/60 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-bold text-text-subtle w-6 shrink-0">
                    #{idx + 1}
                  </span>
                  <CandidateAvatar
                    name={v.name}
                    color={v.color}
                    photo={v.photo}
                  />
                  <span className="flex-1 truncate font-display text-base font-semibold text-text">
                    {v.name}
                  </span>
                  <div className="text-right">
                    <p className="font-display text-xl font-bold text-text">
                      {v.count !== null ? fmt(v.count) : "—"}
                    </p>
                    <p className="text-[11px] uppercase tracking-wider text-text-subtle">
                      {v.pct !== null ? `${v.pct.toFixed(1)}%` : "personas"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-border">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: v.color,
                    }}
                  />
                </div>
              </li>
            )
          })}
        </ul>

        <p className="mt-4 text-[11px] text-text-subtle">
          Total de personas que completaron el test:{" "}
          <strong>{fmt(totalAll || total)}</strong>. Incluye todas las
          respuestas del onboarding (candidatos, indecisos, voto en blanco y
          quienes prefirieron no responder).
        </p>
      </div>

      <div className="brutal-card p-6 md:p-8">
        <span className="font-display text-xs font-semibold uppercase tracking-wider text-primary">
          Paso 2 · ¿Quién se quedó y quién migró?
        </span>

        <h2 className="mt-2 font-display text-2xl font-bold text-text md:text-3xl">
          Después de comparar con las propuestas reales
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-text-muted md:text-base">
          De cada grupo que declaró preferir a un candidato, esto es cuántos
          mantuvieron afinidad y a dónde migraron los demás. Brecha nacional:{" "}
          <strong className="text-accent">{gapPct.toFixed(1)}%</strong>.
        </p>

        <div className="mt-6 space-y-4">
          {flows.map((flow) => (
            <article
              key={flow.fromId}
              className="rounded-brutal border border-surface-border bg-surface/60 p-4 md:p-5"
            >
              <div className="flex items-center gap-3">
                <CandidateAvatar
                  name={flow.fromName}
                  color={flow.fromColor}
                  photo={flow.fromPhoto}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-base font-bold text-text">
                    {flow.fromName}
                  </p>
                  <p className="text-xs text-text-muted">
                    {flow.fromTotal !== null
                      ? `${fmt(flow.fromTotal)} personas declararon preferirlo`
                      : "Voto inicial declarado"}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-md border border-surface-border bg-surface px-3 py-3 text-center">
                  <p
                    className="font-display text-3xl font-bold leading-none"
                    style={{ color: flow.fromColor }}
                  >
                    {flow.stayedPct.toFixed(0)}%
                  </p>
                  <p className="mt-1.5 font-display text-base font-semibold text-text">
                    {flow.stayedCount !== null
                      ? `${fmt(flow.stayedCount)} personas`
                      : "—"}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-text-subtle">
                    Se quedó con {flow.fromName.split(" ")[0]}
                  </p>
                </div>
                <div className="rounded-md border border-accent/30 bg-accent/5 px-3 py-3 text-center">
                  <p className="font-display text-3xl font-bold leading-none text-accent">
                    {flow.migratedPct.toFixed(0)}%
                  </p>
                  <p className="mt-1.5 font-display text-base font-semibold text-text">
                    {flow.migratedCount !== null
                      ? `${fmt(flow.migratedCount)} personas`
                      : "—"}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-text-subtle">
                    Migró a otro candidato
                  </p>
                </div>
              </div>

              {flow.destinations.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-subtle">
                    Migración hacia:
                  </p>
                  <ul className="space-y-1.5">
                    {flow.destinations.slice(0, 5).map((d) => (
                      <li
                        key={d.candidateId}
                        className="flex items-center gap-2 rounded-md bg-surface px-2.5 py-1.5"
                      >
                        <ArrowRight className="size-3 shrink-0 text-text-subtle" />
                        <CandidateAvatar
                          name={d.name}
                          color={d.color}
                          photo={d.photo}
                          size="sm"
                        />
                        <span className="flex-1 truncate text-xs font-semibold text-text">
                          {d.name}
                        </span>
                        <span
                          className="font-display text-sm font-bold tabular-nums"
                          style={{ color: d.color }}
                        >
                          {d.pct.toFixed(0)}%
                        </span>
                        <span className="font-display text-xs font-semibold text-text-muted tabular-nums">
                          {d.count !== null ? `(${fmt(d.count)})` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>

        <p className="mt-5 text-[11px] text-text-subtle">
          &ldquo;Voto inicial declarado&rdquo; es la respuesta del onboarding
          (no es intención de voto). El detalle completo está más abajo en
          &ldquo;El hallazgo principal&rdquo;.
        </p>
      </div>
    </section>
  )
}

interface CandidateAvatarProps {
  name: string
  color: string
  photo?: string
  size?: "sm" | "md"
}

function CandidateAvatar({
  name,
  color,
  photo,
  size = "md",
}: CandidateAvatarProps) {
  const sizeClass = size === "sm" ? "size-6" : "size-9"
  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full border-2`}
      style={{ borderColor: color, backgroundColor: `${color}20` }}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt={name} className="size-full object-cover" />
      ) : (
        <span
          className="text-xs font-bold"
          style={{ color }}
          aria-hidden="true"
        >
          {name.charAt(0)}
        </span>
      )}
    </div>
  )
}
