import type { Metadata } from "next"
import { RunoffOnboardingForm } from "@/components/runoff/RunoffOnboardingForm"

export const metadata: Metadata = {
  title: "Segunda vuelta · Datos básicos",
  description:
    "Cuéntanos un poco sobre ti antes del test de afinidad de segunda vuelta: Cepeda vs Abelardo.",
}

export default function RunoffOnboardingPage() {
  return <RunoffOnboardingForm />
}
