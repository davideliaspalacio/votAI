export type ElectoralEventType =
  | "debate"
  | "deadline"
  | "election"
  | "ceremony"
  | "campaign"

export interface ElectoralEvent {
  id: string
  date: string
  endDate?: string
  title: string
  description: string
  type: ElectoralEventType
  location?: string
  link?: string
  channel?: string
  confirmed: boolean
}

export const EVENT_TYPE_LABELS: Record<ElectoralEventType, string> = {
  debate: "Debate",
  deadline: "Plazo",
  election: "Elección",
  ceremony: "Posesión",
  campaign: "Campaña",
}

export const ELECTORAL_EVENTS_2026: ElectoralEvent[] = [
  {
    id: "deadline-cedula",
    date: "2026-03-13T23:59:00-05:00",
    title: "Cierre de inscripción de cédulas",
    description:
      "Último día para inscribir tu cédula y cambiar tu puesto de votación para presidenciales.",
    type: "deadline",
    link: "https://www.registraduria.gov.co",
    confirmed: true,
  },
  {
    id: "campaign-start",
    date: "2026-01-30T00:00:00-05:00",
    endDate: "2026-05-30T23:59:00-05:00",
    title: "Periodo oficial de campaña presidencial",
    description:
      "Periodo legal de propaganda electoral para presidenciales (4 meses antes de la primera vuelta).",
    type: "campaign",
    confirmed: true,
  },
  {
    id: "debate-1",
    date: "2026-04-15T20:00:00-05:00",
    title: "Primer debate presidencial (TBD)",
    description:
      "Fecha tentativa del primer debate presidencial. Por confirmar canal y candidatos participantes.",
    type: "debate",
    confirmed: false,
  },
  {
    id: "debate-2",
    date: "2026-05-08T20:00:00-05:00",
    title: "Debate presidencial (TBD)",
    description: "Fecha tentativa del segundo debate. Por confirmar.",
    type: "debate",
    confirmed: false,
  },
  {
    id: "silence-start",
    date: "2026-05-29T00:00:00-05:00",
    endDate: "2026-05-31T16:00:00-05:00",
    title: "Silencio electoral (primera vuelta)",
    description:
      "Prohibición de propaganda y publicación de encuestas durante los días previos y la jornada electoral.",
    type: "deadline",
    confirmed: true,
  },
  {
    id: "first-round",
    date: "2026-05-31T08:00:00-05:00",
    endDate: "2026-05-31T16:00:00-05:00",
    title: "Primera vuelta presidencial",
    description: "Jornada electoral de 8:00 AM a 4:00 PM. Lleva tu cédula amarilla.",
    type: "election",
    link: "https://www.registraduria.gov.co",
    confirmed: true,
  },
  {
    id: "second-round",
    date: "2026-06-21T08:00:00-05:00",
    endDate: "2026-06-21T16:00:00-05:00",
    title: "Segunda vuelta presidencial (eventual)",
    description:
      "Solo si ningún candidato supera el 50% en la primera vuelta. Compiten los dos más votados.",
    type: "election",
    link: "https://www.registraduria.gov.co",
    confirmed: true,
  },
  {
    id: "presidential-handover",
    date: "2026-08-07T11:00:00-05:00",
    title: "Posesión presidencial",
    description:
      "Acto de posesión del nuevo presidente de Colombia para el periodo 2026-2030 en la Plaza de Bolívar.",
    type: "ceremony",
    location: "Plaza de Bolívar, Bogotá",
    confirmed: true,
  },
]

export function sortByDate(events: ElectoralEvent[]): ElectoralEvent[] {
  return [...events].sort((a, b) => a.date.localeCompare(b.date))
}

export function getUpcomingEvents(
  events: ElectoralEvent[],
  now: Date = new Date(),
): ElectoralEvent[] {
  const nowIso = now.toISOString()
  return sortByDate(events).filter((e) => (e.endDate ?? e.date) >= nowIso)
}

export function getDaysUntil(
  isoDate: string,
  now: Date = new Date(),
): number {
  const target = new Date(isoDate)
  const diffMs = target.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}
