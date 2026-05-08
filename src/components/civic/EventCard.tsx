"use client"

import { Calendar, ExternalLink, MapPin, Tv } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  EVENT_TYPE_LABELS,
  getDaysUntil,
  type ElectoralEvent,
} from "@/lib/electoral-events"
import { downloadIcsEvent } from "@/lib/ics"
import { cn } from "@/lib/utils"

const TYPE_STYLES: Record<ElectoralEvent["type"], string> = {
  debate: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  deadline: "border-orange-500/40 bg-orange-500/10 text-orange-300",
  election: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
  ceremony: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  campaign: "border-purple-500/40 bg-purple-500/10 text-purple-300",
}

const formatDateLong = (iso: string): string => {
  const date = new Date(iso)
  return date.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const formatTime = (iso: string): string => {
  const date = new Date(iso)
  return date.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

interface EventCardProps {
  event: ElectoralEvent
}

export function EventCard({ event }: EventCardProps) {
  const days = getDaysUntil(event.date)
  const isPast = days < 0
  const isToday = days === 0

  return (
    <article
      className={cn(
        "rounded-xl border border-surface-border bg-surface/50 p-5 transition-colors",
        !isPast && "hover:bg-surface",
        isPast && "opacity-50",
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            TYPE_STYLES[event.type],
          )}
        >
          {EVENT_TYPE_LABELS[event.type]}
        </span>
        {!event.confirmed && (
          <span className="rounded-full border border-surface-border bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-subtle">
            Por confirmar
          </span>
        )}
        {!isPast && (
          <span className="ml-auto text-xs font-semibold text-primary">
            {isToday
              ? "Hoy"
              : days === 1
                ? "Mañana"
                : `Faltan ${days} días`}
          </span>
        )}
      </div>

      <h3 className="font-display text-lg font-bold text-text">
        {event.title}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1">
          <Calendar className="size-3.5" />
          {formatDateLong(event.date)}
        </span>
        <span className="text-text-subtle">·</span>
        <span>{formatTime(event.date)}</span>
        {event.location && (
          <>
            <span className="text-text-subtle">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {event.location}
            </span>
          </>
        )}
        {event.channel && (
          <>
            <span className="text-text-subtle">·</span>
            <span className="inline-flex items-center gap-1">
              <Tv className="size-3.5" />
              {event.channel}
            </span>
          </>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        {event.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadIcsEvent(event)}
          disabled={isPast}
        >
          <Calendar className="mr-1.5 size-4" />
          Agregar a mi calendario
        </Button>
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Más info
            <ExternalLink className="ml-1.5 size-3.5" />
          </a>
        )}
      </div>
    </article>
  )
}
