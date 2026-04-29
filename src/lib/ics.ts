import type { ElectoralEvent } from "./electoral-events"

const formatIcsDate = (iso: string): string => {
  const d = new Date(iso)
  const pad = (n: number) => n.toString().padStart(2, "0")
  return (
    `${d.getUTCFullYear()}` +
    `${pad(d.getUTCMonth() + 1)}` +
    `${pad(d.getUTCDate())}T` +
    `${pad(d.getUTCHours())}` +
    `${pad(d.getUTCMinutes())}` +
    `${pad(d.getUTCSeconds())}Z`
  )
}

const escapeIcsText = (text: string): string =>
  text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")

const foldLine = (line: string): string => {
  if (line.length <= 75) return line
  const chunks: string[] = []
  let i = 0
  while (i < line.length) {
    chunks.push(line.slice(i, i + 75))
    i += 75
  }
  return chunks.join("\r\n ")
}

export function buildIcsEvent(event: ElectoralEvent): string {
  const start = formatIcsDate(event.date)
  const end = formatIcsDate(
    event.endDate ??
      new Date(new Date(event.date).getTime() + 60 * 60 * 1000).toISOString(),
  )
  const now = formatIcsDate(new Date().toISOString())
  const description = [
    event.description,
    event.location ? `Lugar: ${event.location}` : null,
    event.channel ? `Canal: ${event.channel}` : null,
    event.link ? `Más info: ${event.link}` : null,
    "Fuente: votoloco.com",
  ]
    .filter(Boolean)
    .join("\\n")

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VotoLoco//Calendario Electoral 2026//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@votoloco.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${description}`,
    event.location ? `LOCATION:${escapeIcsText(event.location)}` : null,
    event.link ? `URL:${event.link}` : null,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((l): l is string => l !== null)

  return lines.map(foldLine).join("\r\n")
}

export function downloadIcsEvent(event: ElectoralEvent): void {
  const ics = buildIcsEvent(event)
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `votoloco-${event.id}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
