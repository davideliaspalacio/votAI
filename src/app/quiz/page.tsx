import type { Metadata } from "next"
import { QuizContainer } from "@/components/quiz/QuizContainer"

export const metadata: Metadata = {
  title: "Test de afinidad programática",
  description:
    "Responde 10 preguntas sobre los temas que importan y descubre tu afinidad con los candidatos.",
}

export default function QuizPage() {
  return <QuizContainer />
}
