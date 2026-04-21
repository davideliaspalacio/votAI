import type { Metadata } from "next"
import { AnalyzingAnimation } from "@/components/analyzing/AnalyzingAnimation"

export const metadata: Metadata = {
  title: "Analizando tus respuestas",
  description: "Estamos comparando tus respuestas con las propuestas de cada candidato.",
}

export default function AnalyzingPage() {
  return <AnalyzingAnimation />
}
