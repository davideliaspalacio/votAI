import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Comparar candidatos",
  description:
    "Compara las posiciones de los candidatos presidenciales de Colombia 2026 en los 10 ejes temáticos: economía, salud, educación, seguridad, ambiente y más.",
}

export default function CompararLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
