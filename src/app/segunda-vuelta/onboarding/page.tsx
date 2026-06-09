import type { Metadata } from "next"
import { RunoffOnboardingForm } from "@/components/runoff/RunoffOnboardingForm"

export const metadata: Metadata = {
  title: "Segunda vuelta · Datos básicos",
  description:
    "Cuéntanos un poco sobre ti antes del test de afinidad de segunda vuelta entre los planes de Cepeda y Abelardo.",
}

export default function RunoffOnboardingPage() {
  return <RunoffOnboardingForm />
}
