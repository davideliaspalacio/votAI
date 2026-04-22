import type { Metadata } from "next"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { CandidateGrid } from "@/components/landing/CandidateGrid"
import { TrustSection } from "@/components/landing/TrustSection"

export const metadata: Metadata = {
  title: "VotAI - 10 preguntas. Tu candidato real. Sin enredos.",
  description:
    "Descubre qué candidato presidencial de Colombia 2026 se alinea con lo que piensas. Test de afinidad programática. No es una encuesta.",
}

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <CandidateGrid />
      <TrustSection />
    </>
  )
}
