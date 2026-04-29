import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "¿Cómo voto? — Guía electoral",
  description:
    "Guía paso a paso para votar en las elecciones presidenciales de Colombia 2026: documentos, horarios, qué hacer si te equivocas, voto en blanco vs nulo y más.",
  alternates: { canonical: "https://votoloco.com/como-voto" },
  openGraph: {
    title: "¿Cómo voto en Colombia 2026? — VotoLoco",
    description:
      "Guía paso a paso para votar: documentos, horarios y todo lo que necesitas saber.",
    url: "https://votoloco.com/como-voto",
  },
}

export default function ComoVotoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
