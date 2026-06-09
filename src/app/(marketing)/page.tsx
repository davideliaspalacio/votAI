import type { Metadata } from "next"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { FirstRoundStatsHome } from "@/components/home/FirstRoundStatsHome"
import { TrustSection } from "@/components/landing/TrustSection"

export const metadata: Metadata = {
  title: "VotoLoco - Segunda vuelta: tu afinidad con los dos planes",
  description:
    "Descubre con cuál plan de gobierno tienes más afinidad en la segunda vuelta presidencial de Colombia 2026: Cepeda o Abelardo. No es una encuesta.",
}

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FirstRoundStatsHome />
      <TrustSection />
    </>
  )
}
