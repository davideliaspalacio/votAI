import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Estadísticas de afinidad programática",
  description:
    "Radiografía de Colombia: cómo se distribuye la afinidad programática por región, edad y eje temático. Datos agregados y anónimos del test de VotAI.",
}

export default function EstadisticasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
