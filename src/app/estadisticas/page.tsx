"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { PublicStats, RunoffStats } from "@/types/domain"
import { Header } from "@/components/common/Header"
import { LegalFooter } from "@/components/common/LegalFooter"
import { Disclaimer } from "@/components/common/Disclaimer"
import { ChartSkeleton } from "@/components/common/Skeletons"
import { VolumeCard } from "@/components/stats/VolumeCard"
import { AggregateAffinity } from "@/components/stats/AggregateAffinity"
import { RegionMap } from "@/components/stats/RegionMap"
import { AgeDistribution } from "@/components/stats/AgeDistribution"
import { GapSankey } from "@/components/stats/GapSankey"
import { DecisiveAxes } from "@/components/stats/DecisiveAxes"
import { PolarizationChart } from "@/components/stats/PolarizationChart"
import { UndecidedCard } from "@/components/stats/UndecidedCard"
import { RunoffStatsPanel } from "@/components/stats/RunoffStatsPanel"
import { Lock, Loader2 } from "lucide-react"

type StatsTab = "first" | "runoff"
type StatsErrors = Partial<Record<StatsTab, string>>
type StatsGate = "loading" | "stats" | "silence" | "disabled"

export default function EstadisticasPage() {
  const gate = getInitialGate()
  const [activeTab, setActiveTab] = useState<StatsTab>("first")
  const [stats, setStats] = useState<PublicStats | null>(null)
  const [runoffStats, setRunoffStats] = useState<RunoffStats | null>(null)
  const [loading, setLoading] = useState(gate === "stats")
  const [errors, setErrors] = useState<StatsErrors>({})

  useEffect(() => {
    if (gate !== "stats") return

    let cancelled = false

    async function loadStats() {
      const [firstResult, runoffResult] = await Promise.allSettled([
        api.getPublicStats(),
        api.getRunoffStats(),
      ])

      if (cancelled) return

      const nextErrors: StatsErrors = {}

      if (firstResult.status === "fulfilled") {
        setStats(firstResult.value)
      } else {
        nextErrors.first = getErrorMessage(firstResult.reason)
      }

      if (runoffResult.status === "fulfilled") {
        setRunoffStats(runoffResult.value)
      } else {
        nextErrors.runoff = getErrorMessage(runoffResult.reason)
      }

      setErrors(nextErrors)
      setLoading(false)
    }

    void loadStats()

    return () => {
      cancelled = true
    }
  }, [gate])

  if (gate === "loading") {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
        <LegalFooter />
      </div>
    )
  }

  if (gate === "silence") {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="text-center">
            <Lock className="mx-auto size-12 text-primary" />
            <h1 className="mt-4 font-display text-display-sm font-bold text-text">
              Silencio electoral
            </h1>
            <p className="mt-2 text-text-muted">
              Las estadísticas están temporalmente deshabilitadas durante el
              período de silencio electoral.
            </p>
          </div>
        </div>
        <LegalFooter />
      </div>
    )
  }

  if (gate === "disabled") {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="text-center">
            <h1 className="font-display text-display-sm font-bold text-text">
              Estadísticas próximamente
            </h1>
            <p className="mt-2 text-text-muted">
              Las estadísticas públicas estarán disponibles cuando tengamos
              suficientes datos.
            </p>
          </div>
        </div>
        <LegalFooter />
      </div>
    )
  }

  const activeTotal =
    activeTab === "runoff" ? runoffStats?.total_sessions : stats?.total_sessions

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <div className="mx-auto max-w-5xl flex-1 px-4 py-12">
        <div className="text-center">
          <h1 className="font-display text-display-sm font-bold text-text md:text-display-md">
            Radiografía de Colombia
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-text-muted">
            {activeTab === "first"
              ? "Primera vuelta: afinidad programática, brechas entre preferencia y resultado del test, y cortes por perfil."
              : "Segunda vuelta: transferencia de voto, afinidad Cepeda vs Abelardo y señales de decisión real."}
          </p>
          <p className="mt-2 text-sm text-text-muted">
            <strong className="text-primary">
              {activeTotal ? activeTotal.toLocaleString("es-CO") : "..."}
            </strong>{" "}
            tests completados en esta vista.
          </p>
        </div>

        <div className="mt-6 rounded-brutal border border-accent/30 bg-accent/5 px-4 py-3 text-center text-sm text-text-muted">
          Esto <strong className="text-text">NO</strong> es una encuesta
          electoral. Son datos de afinidad programática de una muestra
          autoseleccionada. No predicen resultados.
        </div>

        <div
          role="tablist"
          aria-label="Selector de estadísticas"
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          <StatsTabButton
            active={activeTab === "first"}
            onClick={() => setActiveTab("first")}
          >
            Estadísticas primera vuelta
          </StatsTabButton>
          <StatsTabButton
            active={activeTab === "runoff"}
            onClick={() => setActiveTab("runoff")}
          >
            Estadísticas vuelta número dos
          </StatsTabButton>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <ChartSkeleton key={i} />
            ))}
          </div>
        ) : activeTab === "first" ? (
          stats ? (
            <FirstRoundPanel stats={stats} />
          ) : (
            <StatsErrorCard error={errors.first} />
          )
        ) : runoffStats ? (
          <div className="mt-10">
            <RunoffStatsPanel stats={runoffStats} />
          </div>
        ) : (
          <StatsErrorCard error={errors.runoff} />
        )}

        <div className="mt-12">
          <Disclaimer variant="full" />
        </div>
      </div>
      <LegalFooter />
    </div>
  )
}

function StatsTabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`min-h-10 rounded-md border px-4 py-2 text-sm font-bold transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-surface-border bg-surface text-text-muted hover:text-text"
      }`}
    >
      {children}
    </button>
  )
}

function FirstRoundPanel({ stats }: { stats: PublicStats }) {
  return (
    <div className="mt-10 space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <VolumeCard total={stats.total_sessions} lastUpdated={stats.last_updated} />
        <AggregateAffinity
          data={stats.aggregate_affinity}
          total={stats.total_sessions}
        />
      </div>

      <div>
        <h2 className="mb-1 font-display text-xl font-bold text-text">
          El hallazgo principal
        </h2>
        <p className="mb-4 text-sm text-text-muted">
          Lo que más nos sorprendió de los datos.
        </p>
        <GapSankey
          gapPct={stats.gap_national_pct}
          data={stats.preference_vs_match}
          total={stats.total_sessions}
        />
      </div>

      <div>
        <h2 className="mb-1 font-display text-xl font-bold text-text">
          ¿Quién piensa qué?
        </h2>
        <p className="mb-4 text-sm text-text-muted">
          Así se distribuye la afinidad por edad y región.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <AgeDistribution data={stats.by_age} />
          <RegionMap data={stats.by_region} />
        </div>
      </div>

      <div>
        <h2 className="mb-1 font-display text-xl font-bold text-text">
          Los temas que mueven a Colombia
        </h2>
        <p className="mb-4 text-sm text-text-muted">
          Qué importa más, y dónde estamos más divididos.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <DecisiveAxes data={stats.decisive_axes} />
          <PolarizationChart data={stats.polarization_by_axis} />
        </div>
      </div>

      <div>
        <h2 className="mb-1 font-display text-xl font-bold text-text">
          Los indecisos reales
        </h2>
        <p className="mb-4 text-sm text-text-muted">
          No todos tienen un candidato claro.
        </p>
        <div className="max-w-lg">
          <UndecidedCard pct={stats.undecided_pct} />
        </div>
      </div>
    </div>
  )
}

function StatsErrorCard({ error }: { error?: string }) {
  return (
    <div className="mt-10 rounded-brutal border-2 border-surface-border bg-surface p-8 text-center">
      <p className="font-display text-lg font-bold text-text">
        No se pudieron cargar estas estadísticas
      </p>
      <p className="mt-2 text-sm text-text-muted">
        {error?.includes("403") || error?.includes("insufficient")
          ? "Aún no hay suficientes datos o el acceso está protegido para esta vista."
          : "Hubo un problema al conectar con el servidor. Intenta de nuevo más tarde."}
      </p>
    </div>
  )
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Error cargando estadísticas"
}

function getInitialGate(): StatsGate {
  if (process.env.NEXT_PUBLIC_ELECTORAL_SILENCE === "true") return "silence"
  if (process.env.NEXT_PUBLIC_SHOW_PUBLIC_STATS !== "true") return "disabled"
  return "stats"
}
