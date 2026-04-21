import type { Metadata } from "next"
import { OnboardingForm } from "@/components/onboarding/OnboardingForm"

export const metadata: Metadata = {
  title: "Datos básicos",
  description:
    "Cuéntanos un poco sobre ti antes de empezar el test de afinidad programática.",
}

export default function OnboardingPage() {
  return <OnboardingForm />
}
