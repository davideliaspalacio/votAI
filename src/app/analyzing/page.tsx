import { redirect } from "next/navigation"

// El test de primera vuelta se retiró de la UI: solo queda el de segunda vuelta.
export default function AnalyzingPage() {
  redirect("/segunda-vuelta/onboarding")
}
