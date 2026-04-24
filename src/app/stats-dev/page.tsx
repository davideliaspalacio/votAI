"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/common/Header"
import { LegalFooter } from "@/components/common/LegalFooter"
import { Loader2 } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

const TABS = [
  { id: "engagement", label: "Engagement" },
  { id: "affinity", label: "Afinidad Profunda" },
  { id: "axes", label: "Ejes Temáticos" },
  { id: "demographics", label: "Demográficas" },
  { id: "blank", label: "Voto en Blanco" },
  { id: "flow", label: "Flujo Preferencia" },
] as const

type TabId = (typeof TABS)[number]["id"]

const ENDPOINTS: Record<TabId, string> = {
  engagement: "/api/stats/engagement",
  affinity: "/api/stats/affinity-deep",
  axes: "/api/stats/axes-analysis",
  demographics: "/api/stats/demographics",
  blank: "/api/stats/blank-vote",
  flow: "/api/stats/preference-flow",
}

export default function StatsDevPage() {
  const [tab, setTab] = useState<TabId>("engagement")
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === "development")
  }, [])

  useEffect(() => {
    if (!isDev) return
    setLoading(true)
    setData(null)
    fetch(`${API}${ENDPOINTS[tab]}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [tab, isDev])

  if (!isDev) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-text-muted">Solo disponible en desarrollo</p>
        </div>
        <LegalFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="mb-2 font-display text-2xl font-bold text-text">
          Dashboard de Métricas (Dev)
        </h1>
        <p className="mb-6 text-sm text-text-muted">
          Solo visible en desarrollo. No se muestra en producción.
        </p>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface border border-surface-border text-text-muted hover:text-text"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : data ? (
          <div className="space-y-6">
            {tab === "engagement" && <EngagementView data={data} />}
            {tab === "affinity" && <AffinityView data={data} />}
            {tab === "axes" && <AxesView data={data} />}
            {tab === "demographics" && <DemographicsView data={data} />}
            {tab === "blank" && <BlankVoteView data={data} />}
            {tab === "flow" && <FlowView data={data} />}
          </div>
        ) : (
          <p className="text-text-muted">No hay datos disponibles</p>
        )}
      </div>
      <LegalFooter />
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-brutal border-2 border-surface-border bg-surface p-5">
      <h3 className="mb-3 font-display text-sm font-bold text-text">{title}</h3>
      {children}
    </div>
  )
}

function Metric({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
      {sub && <p className="text-[10px] text-text-subtle">{sub}</p>}
    </div>
  )
}

// ==================== TAB VIEWS ====================

function EngagementView({ data }: { data: Record<string, unknown> }) {
  const d = data as {
    total_sessions: number; completed: number; abandoned: number; completion_rate: number;
    avg_time_seconds: number; min_time_seconds: number; max_time_seconds: number;
    by_hour: { hour: number; count: number }[];
    by_day: { day: string; count: number }[];
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-4">
        <Card title="Total sesiones"><Metric label="sesiones" value={d.total_sessions} /></Card>
        <Card title="Completadas"><Metric label="tests terminados" value={d.completed} /></Card>
        <Card title="Abandonadas"><Metric label="sin terminar" value={d.abandoned} /></Card>
        <Card title="Tasa de completado"><Metric label="conversion" value={`${d.completion_rate}%`} /></Card>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card title="Tiempo promedio"><Metric label="segundos" value={d.avg_time_seconds} /></Card>
        <Card title="Más rápido"><Metric label="segundos" value={d.min_time_seconds} /></Card>
        <Card title="Más lento"><Metric label="segundos" value={d.max_time_seconds} /></Card>
      </div>
      <Card title="Por hora del día">
        <div className="flex h-32 items-end gap-1">
          {(d.by_hour ?? []).map((h) => {
            const max = Math.max(...(d.by_hour ?? []).map((x) => x.count), 1)
            return (
              <div key={h.hour} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t bg-primary/60" style={{ height: `${(h.count / max) * 100}%` }} />
                <span className="text-[8px] text-text-subtle">{h.hour}</span>
              </div>
            )
          })}
        </div>
      </Card>
      <Card title="Por día de la semana">
        <div className="space-y-2">
          {(d.by_day ?? []).map((day) => {
            const max = Math.max(...(d.by_day ?? []).map((x) => x.count), 1)
            return (
              <div key={day.day} className="flex items-center gap-3">
                <span className="w-20 text-xs text-text-muted">{day.day}</span>
                <div className="h-4 flex-1 rounded-full bg-surface-border">
                  <div className="h-full rounded-full bg-primary/60" style={{ width: `${(day.count / max) * 100}%` }} />
                </div>
                <span className="w-10 text-right text-xs text-text-subtle">{day.count}</span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

function AffinityView({ data }: { data: Record<string, unknown> }) {
  const d = data as {
    most_polarizing: { candidateId: string; stddev: number }[];
    second_choice: { candidateId: string; mostCommonSecond: string; pct: number }[];
    avg_gap_1st_2nd: number;
    gap_distribution: { tight: number; moderate: number; clear: number; dominant: number };
    top_score_distribution: Record<string, number>;
    candidate_fidelity: { candidateId: string; fidelityPct: number; total: number }[];
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Brecha promedio #1 vs #2"><Metric label="puntos de diferencia" value={d.avg_gap_1st_2nd} /></Card>
        <Card title="Distribución de brecha">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div><p className="text-lg font-bold text-green-400">{d.gap_distribution?.tight}</p><p className="text-[10px] text-text-subtle">Ajustado (0-5)</p></div>
            <div><p className="text-lg font-bold text-yellow-400">{d.gap_distribution?.moderate}</p><p className="text-[10px] text-text-subtle">Moderado (6-15)</p></div>
            <div><p className="text-lg font-bold text-orange-400">{d.gap_distribution?.clear}</p><p className="text-[10px] text-text-subtle">Claro (16-30)</p></div>
            <div><p className="text-lg font-bold text-red-400">{d.gap_distribution?.dominant}</p><p className="text-[10px] text-text-subtle">Dominante (30+)</p></div>
          </div>
        </Card>
      </div>
      <Card title="Candidato más polarizante (mayor varianza en scores)">
        <div className="space-y-2">
          {(d.most_polarizing ?? []).map((c) => (
            <div key={c.candidateId} className="flex items-center justify-between text-sm">
              <span className="text-text-muted">{c.candidateId}</span>
              <span className="font-bold text-primary">{c.stddev}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Segunda opción más frecuente">
        <div className="space-y-2">
          {(d.second_choice ?? []).map((c) => (
            <div key={c.candidateId} className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Si #1 es {c.candidateId}</span>
              <span className="text-text">#2 más común: <strong className="text-primary">{c.mostCommonSecond}</strong> ({c.pct}%)</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Distribución de score del #1">
        <div className="space-y-2">
          {Object.entries(d.top_score_distribution ?? {}).map(([range, count]) => (
            <div key={range} className="flex items-center gap-3">
              <span className="w-16 text-xs text-text-muted">{range}%</span>
              <div className="h-4 flex-1 rounded-full bg-surface-border">
                <div className="h-full rounded-full bg-primary/60" style={{ width: `${(count / Math.max(...Object.values(d.top_score_distribution ?? {}), 1)) * 100}%` }} />
              </div>
              <span className="w-10 text-right text-xs text-text-subtle">{count}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Fidelidad por candidato (% que elige Y coincide)">
        <div className="space-y-2">
          {(d.candidate_fidelity ?? []).map((c) => (
            <div key={c.candidateId} className="flex items-center justify-between text-sm">
              <span className="text-text-muted">{c.candidateId} ({c.total} personas)</span>
              <span className="font-bold text-primary">{c.fidelityPct}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function AxesView({ data }: { data: Record<string, unknown> }) {
  const d = data as {
    axis_importance: { axis: string; avgWeight: number; highImportance: number }[];
    popular_responses: { axis: string; mean: number; distribution: { value: number; pct: number }[] }[];
    axis_polarization: { axis: string; polarizationScore: number }[];
  }

  return (
    <div className="space-y-4">
      <Card title="Ejes más importantes (peso promedio)">
        <div className="space-y-2">
          {(d.axis_importance ?? []).map((a) => (
            <div key={a.axis} className="flex items-center gap-3">
              <span className="w-32 text-xs text-text-muted">{a.axis}</span>
              <div className="h-4 flex-1 rounded-full bg-surface-border">
                <div className="h-full rounded-full bg-primary/60" style={{ width: `${(a.avgWeight / 3) * 100}%` }} />
              </div>
              <span className="w-16 text-right text-xs text-text-subtle">{a.avgWeight} ({a.highImportance}% alta)</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Polarización por eje">
        <div className="space-y-2">
          {(d.axis_polarization ?? []).map((a) => (
            <div key={a.axis} className="flex items-center gap-3">
              <span className="w-32 text-xs text-text-muted">{a.axis}</span>
              <div className="h-4 flex-1 rounded-full bg-surface-border">
                <div className="h-full rounded-full bg-red-500/60" style={{ width: `${a.polarizationScore * 100}%` }} />
              </div>
              <span className="w-10 text-right text-xs text-text-subtle">{a.polarizationScore}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Respuesta promedio por eje (1=izq, 7=der)">
        <div className="space-y-2">
          {(d.popular_responses ?? []).map((a) => (
            <div key={a.axis} className="flex items-center gap-3">
              <span className="w-32 text-xs text-text-muted">{a.axis}</span>
              <div className="relative h-4 flex-1 rounded-full bg-surface-border">
                <div className="absolute top-0 h-full w-1 rounded bg-primary" style={{ left: `${((a.mean - 1) / 6) * 100}%` }} />
              </div>
              <span className="w-10 text-right text-xs text-text-subtle">{a.mean}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function DemographicsView({ data }: { data: Record<string, unknown> }) {
  const d = data as {
    importance_by_age: { age_range: string; top_axes: { axis: string; avgWeight: number }[] }[];
    generational_gap: { axis: string; young_mean: number; older_mean: number; gap: number }[];
    surprise_by_region: { region: string; surprise_pct: number; total: number }[];
  }

  return (
    <div className="space-y-4">
      <Card title="Brecha generacional (jóvenes 18-24 vs mayores 50+)">
        <div className="space-y-2">
          {(d.generational_gap ?? []).map((g) => (
            <div key={g.axis} className="flex items-center justify-between text-sm">
              <span className="text-text-muted">{g.axis}</span>
              <span className="text-text">
                Jóvenes: <strong>{g.young_mean}</strong> | Mayores: <strong>{g.older_mean}</strong> |
                Brecha: <strong className="text-primary">{g.gap}</strong>
              </span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Tasa de sorpresa por región">
        <div className="space-y-2">
          {(d.surprise_by_region ?? []).map((r) => (
            <div key={r.region} className="flex items-center gap-3">
              <span className="w-20 text-xs text-text-muted">{r.region}</span>
              <div className="h-4 flex-1 rounded-full bg-surface-border">
                <div className="h-full rounded-full bg-accent/60" style={{ width: `${r.surprise_pct}%` }} />
              </div>
              <span className="w-20 text-right text-xs text-text-subtle">{r.surprise_pct}% ({r.total})</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Eje más importante por edad">
        <div className="space-y-3">
          {(d.importance_by_age ?? []).map((a) => (
            <div key={a.age_range}>
              <p className="text-xs font-bold text-text">{a.age_range}</p>
              <p className="text-xs text-text-muted">
                {(a.top_axes ?? []).map((t) => `${t.axis} (${t.avgWeight})`).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function BlankVoteView({ data }: { data: Record<string, unknown> }) {
  const d = data as {
    blank_wins: number; blank_pct: number; message?: string;
    profile: { by_age: [string, number][]; by_region: [string, number][] };
    avg_responses_by_axis: { axis: string; avgValue: number }[];
  }

  if (d.message) {
    return <Card title="Voto en Blanco"><p className="text-text-muted">{d.message}</p></Card>
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Veces que ganó"><Metric label="sesiones" value={d.blank_wins} /></Card>
        <Card title="Porcentaje"><Metric label="del total" value={`${d.blank_pct}%`} /></Card>
      </div>
      <Card title="Perfil del votante en blanco">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold text-text">Por edad</p>
            {(d.profile?.by_age ?? []).map(([age, count]) => (
              <p key={age} className="text-xs text-text-muted">{age}: {count}</p>
            ))}
          </div>
          <div>
            <p className="mb-2 text-xs font-bold text-text">Por región</p>
            {(d.profile?.by_region ?? []).map(([region, count]) => (
              <p key={region} className="text-xs text-text-muted">{region}: {count}</p>
            ))}
          </div>
        </div>
      </Card>
      <Card title="Respuesta promedio por eje (votantes en blanco)">
        <div className="space-y-2">
          {(d.avg_responses_by_axis ?? []).map((a) => (
            <div key={a.axis} className="flex items-center gap-3">
              <span className="w-32 text-xs text-text-muted">{a.axis}</span>
              <div className="relative h-4 flex-1 rounded-full bg-surface-border">
                <div className="absolute top-0 h-full w-1 rounded bg-accent" style={{ left: `${((a.avgValue - 1) / 6) * 100}%` }} />
              </div>
              <span className="w-10 text-right text-xs text-text-subtle">{a.avgValue}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function FlowView({ data }: { data: Record<string, unknown> }) {
  const d = data as {
    preference_flow: {
      fromPreference: string; total: number; stays_pct: number; leaves_pct: number;
      destinations: { candidateId: string; pct: number; count: number; avgScore: number }[];
    }[];
  }

  return (
    <div className="space-y-4">
      {(d.preference_flow ?? []).map((flow) => (
        <Card key={flow.fromPreference} title={`Eligieron: ${flow.fromPreference} (${flow.total} personas)`}>
          <div className="mb-3 flex gap-4">
            <Metric label="se quedan" value={`${flow.stays_pct}%`} />
            <Metric label="se van" value={`${flow.leaves_pct}%`} />
          </div>
          <div className="space-y-1">
            {flow.destinations.map((dest) => (
              <div key={dest.candidateId} className="flex items-center gap-3 text-xs">
                <span className="w-10 text-text-muted">{dest.candidateId}</span>
                <div className="h-3 flex-1 rounded-full bg-surface-border">
                  <div
                    className={`h-full rounded-full ${dest.candidateId === flow.fromPreference ? "bg-green-500/60" : "bg-primary/40"}`}
                    style={{ width: `${dest.pct}%` }}
                  />
                </div>
                <span className="w-28 text-right text-text-subtle">{dest.pct}% ({dest.count}) avg:{dest.avgScore}%</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
