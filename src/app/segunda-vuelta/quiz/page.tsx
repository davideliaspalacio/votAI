import type { Metadata } from "next"
import { RunoffQuizContainer } from "@/components/runoff/RunoffQuizContainer"

export const metadata: Metadata = {
  title: "Segunda vuelta · Test de afinidad",
  description:
    "Responde 10 preguntas y descubre con qué plan tienes más afinidad: Cepeda o Abelardo.",
}

export default function RunoffQuizPage() {
  return <RunoffQuizContainer />
}
