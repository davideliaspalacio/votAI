"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { PublicStats } from "@/types/domain"
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
import { Lock, Loader2 } from "lucide-react"

export default function EstadisticasPage() {
  const [stats, setStats] = useState<PublicStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gate, setGate] = useState<"loading" | "stats" | "silence" | "disabled">("loading")

  useEffect(() => {
    const silence = process.env.NEXT_PUBLIC_ELECTORAL_SILENCE === "true"
    const enabled = process.env.NEXT_PUBLIC_SHOW_PUBLIC_STATS === "true"

    if (silence) {
      setGate("silence")
      setLoading(false)
      return
    }
    if (!enabled) {
      setGate("disabled")
      setLoading(false)
      return
    }

    setGate("stats")
    api
      .getPublicStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Error cargando estadísticas"))
      .finally(() => setLoading(false))
  }, [])

  // Initial loading state (avoids hydration mismatch)
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

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <div className="mx-auto max-w-5xl flex-1 px-4 py-12">
        {/* Hero */}
        <div className="text-center">
          <h1 className="font-display text-display-sm font-bold text-text md:text-display-md">
            Radiografía de Colombia
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-text-muted">
            ¿Qué piensan realmente los colombianos? Esto es lo que{" "}
            <strong className="text-primary">{stats ? stats.total_sessions.toLocaleString("es-CO") : "..."}</strong>{" "}
            personas nos dijeron con sus respuestas.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-brutal border border-accent/30 bg-accent/5 px-4 py-3 text-center text-sm text-text-muted">
          Esto <strong className="text-text">NO</strong> es una encuesta
          electoral. Son datos de afinidad programática de una muestra
          autoseleccionada. No predicen resultados.
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <ChartSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 rounded-brutal border-2 border-surface-border bg-surface p-8 text-center">
            <p className="font-display text-lg font-bold text-text">
              No se pudieron cargar las estadísticas
            </p>
            <p className="mt-2 text-sm text-text-muted">
              {error.includes("403") || error.includes("insufficient")
                ? "Aún no hay suficientes datos. Vuelve cuando más personas hayan hecho el test."
                : "Hubo un problema al conectar con el servidor. Intenta de nuevo más tarde."}
            </p>
          </div>
        ) : stats ? (
          <div className="mt-10 space-y-8">
            {/* Row 1: Volume + Affinity */}
            <div className="grid gap-6 md:grid-cols-2">
              <VolumeCard
                total={stats.total_sessions}
                lastUpdated={stats.last_updated}
              />
              <AggregateAffinity
                data={stats.aggregate_affinity}
                total={stats.total_sessions}
              />
            </div>

            {/* Section: The Big Reveal */}
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

            {/* Section: By demographics */}
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

            {/* Section: The Issues */}
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

            {/* Section: Undecided */}
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
        ) : null}

        <div className="mt-12">
          <Disclaimer variant="full" />
        </div>
      </div>
      <LegalFooter />
    </div>
  )
}
