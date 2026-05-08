import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Glosario político",
  description:
    "Glosario de términos políticos, electorales y económicos clave del debate público colombiano. Definiciones cortas, neutrales y verificables.",
  alternates: { canonical: "https://votoloco.com/glosario" },
  openGraph: {
    title: "Glosario político — VotoLoco",
    description:
      "Términos políticos, electorales y económicos del debate colombiano explicados de forma corta y neutral.",
    url: "https://votoloco.com/glosario",
  },
}

export default function GlosarioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
