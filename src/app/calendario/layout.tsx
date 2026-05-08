import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Calendario electoral 2026",
  description:
    "Fechas clave de las elecciones presidenciales de Colombia 2026: debates, plazos, primera vuelta, segunda vuelta y posesión. Descarga eventos a tu calendario.",
  alternates: { canonical: "https://votoloco.com/calendario" },
  openGraph: {
    title: "Calendario electoral Colombia 2026 — VotoLoco",
    description:
      "Todas las fechas clave del proceso electoral en un solo lugar.",
    url: "https://votoloco.com/calendario",
  },
}

export default function CalendarioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
