import type { Metadata } from "next"
import { RunoffAnalyzing } from "@/components/runoff/RunoffAnalyzing"

export const metadata: Metadata = {
  title: "Analizando tus respuestas",
  description:
    "Estamos comparando tus respuestas con los planes de Cepeda y Abelardo.",
}

export default function RunoffAnalyzingPage() {
  return <RunoffAnalyzing />
}
