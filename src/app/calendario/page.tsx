"use client"

import { useMemo, useState } from "react"
import { CalendarDays, Clock } from "lucide-react"
import { Header } from "@/components/common/Header"
import { LegalFooter } from "@/components/common/LegalFooter"
import { EventCard } from "@/components/civic/EventCard"
import { cn } from "@/lib/utils"
import {
  ELECTORAL_EVENTS_2026,
  EVENT_TYPE_LABELS,
  getDaysUntil,
  sortByDate,
  type ElectoralEventType,
} from "@/lib/electoral-events"

const FILTERS: (ElectoralEventType | "todos")[] = [
  "todos",
  "election",
  "debate",
  "deadline",
  "campaign",
  "ceremony",
]

export default function CalendarioPage() {
  const [filter, setFilter] = useState<ElectoralEventType | "todos">("todos")
  const [showPast, setShowPast] = useState(false)

  const sorted = useMemo(() => sortByDate(ELECTORAL_EVENTS_2026), [])

  const filtered = useMemo(() => {
    return sorted.filter((event) => {
      if (filter !== "todos" && event.type !== filter) return false
      const isPast = getDaysUntil(event.endDate ?? event.date) < 0
      if (!showPast && isPast) return false
      return true
    })
  }, [sorted, filter, showPast])

  const nextEvent = useMemo(
    () =>
      sorted.find((e) => getDaysUntil(e.endDate ?? e.date) >= 0) ?? null,
    [sorted],
  )

  const daysUntilNext = nextEvent ? getDaysUntil(nextEvent.date) : null

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <div className="mb-8">
          <h1 className="font-display text-display-sm font-bold text-text md:text-display-md">
            Calendario electoral
          </h1>
          <p className="mt-3 text-base text-text-muted md:text-lg">
            Fechas clave de las elecciones presidenciales de Colombia 2026.
            Descarga cualquier evento a tu calendario con un clic.
          </p>
        </div>

        {nextEvent && daysUntilNext !== null && daysUntilNext >= 0 && (
          <div className="mb-8 rounded-xl border-2 border-primary/40 bg-primary/5 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Clock className="size-3.5" />
              Próximo evento
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold text-text">
              {nextEvent.title}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {daysUntilNext === 0
                ? "Es hoy"
                : daysUntilNext === 1
                  ? "Es mañana"
                  : `Faltan ${daysUntilNext} días`}
            </p>
          </div>
        )}

        <div className="sticky top-14 z-30 -mx-4 mb-6 flex flex-wrap items-center gap-2 border-b border-surface-border bg-background/95 px-4 py-3 backdrop-blur-md">
          {FILTERS.map((f) => {
            const active = filter === f
            const label =
              f === "todos" ? "Todos" : EVENT_TYPE_LABELS[f]
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-surface-border bg-surface text-text-muted hover:text-text",
                )}
              >
                {label}
              </button>
            )
          })}
          <label className="ml-auto inline-flex shrink-0 cursor-pointer items-center gap-2 text-xs text-text-muted">
            <input
              type="checkbox"
              checked={showPast}
              onChange={(e) => setShowPast(e.target.checked)}
              className="size-3.5 accent-primary"
            />
            Mostrar pasados
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <CalendarDays className="mx-auto size-12 text-text-subtle" />
            <p className="mt-3 text-text-muted">
              No hay eventos con este filtro.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        <p className="mt-12 text-xs text-text-subtle">
          Algunas fechas (debates, plazos administrativos) están sujetas a
          confirmación oficial por parte del CNE y la Registraduría. Las
          actualizamos cuando se publican.
        </p>
      </main>
      <LegalFooter />
    </div>
  )
}
