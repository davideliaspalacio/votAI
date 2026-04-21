import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Question, QuizAnswer } from "@/types/domain"

interface QuizState {
  questions: Question[]
  answers: QuizAnswer[]
  currentIndex: number
  setQuestions: (q: Question[]) => void
  answerQuestion: (questionId: string, value: number | string, weight: 1 | 2 | 3) => void
  goNext: () => void
  goPrev: () => void
  isComplete: () => boolean
  getCurrentAnswer: () => QuizAnswer | undefined
  reset: () => void
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questions: [],
      answers: [],
      currentIndex: 0,

      setQuestions: (questions) =>
        set({ questions, answers: [], currentIndex: 0 }),

      answerQuestion: (questionId, value, weight) => {
        const { answers } = get()
        const idx = answers.findIndex((a) => a.questionId === questionId)
        const newAnswer: QuizAnswer = { questionId, value, weight }
        if (idx >= 0) {
          const updated = [...answers]
          updated[idx] = newAnswer
          set({ answers: updated })
        } else {
          set({ answers: [...answers, newAnswer] })
        }
      },

      goNext: () => {
        const { currentIndex, questions } = get()
        if (currentIndex < questions.length - 1) {
          set({ currentIndex: currentIndex + 1 })
        }
      },

      goPrev: () => {
        const { currentIndex } = get()
        if (currentIndex > 0) {
          set({ currentIndex: currentIndex - 1 })
        }
      },

      isComplete: () => {
        const { questions, answers } = get()
        return questions.length > 0 && answers.length === questions.length
      },

      getCurrentAnswer: () => {
        const { questions, answers, currentIndex } = get()
        const q = questions[currentIndex]
        if (!q) return undefined
        return answers.find((a) => a.questionId === q.id)
      },

      reset: () => set({ questions: [], answers: [], currentIndex: 0 }),
    }),
    { name: "votoloco:quiz:v1" }
  )
)
