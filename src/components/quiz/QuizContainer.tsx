"use client"

import { useEffect, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { QuizProgressBar } from "./ProgressBar"
import { QuestionCard } from "./QuestionCard"
import { QuestionSkeleton } from "@/components/common/Skeletons"
import { useQuizStore } from "@/lib/store/quizStore"
import { useSessionStore } from "@/lib/store/sessionStore"
import { api } from "@/lib/api"

export function QuizContainer() {
  const router = useRouter()
  const prefersReduced = useReducedMotion()
  const sessionId = useSessionStore((s) => s.sessionId)
  const {
    questions,
    answers,
    currentIndex,
    setQuestions,
    answerQuestion,
    goNext,
    goPrev,
    getCurrentAnswer,
    isComplete,
  } = useQuizStore()

  const [direction, setDirection] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [importances, setImportances] = useState<Record<string, 1 | 2 | 3>>({})

  useEffect(() => {
    if (!sessionId) {
      router.replace("/onboarding")
      return
    }
    api.getQuestions(sessionId).then((q) => {
      setQuestions(q)
      setLoading(false)
    })
  }, [sessionId, router, setQuestions])

  const currentQuestion = questions[currentIndex]
  const currentAnswer = getCurrentAnswer()
  const isLast = currentIndex === questions.length - 1
  const canGoNext = currentAnswer !== undefined

  const handleNext = useCallback(() => {
    setDirection(1)
    goNext()
  }, [goNext])

  const handlePrev = useCallback(() => {
    setDirection(-1)
    goPrev()
  }, [goPrev])

  const handleSubmit = async () => {
    if (!sessionId) return
    setSubmitting(true)
    try {
      const quizAnswers = answers.map((a) => ({
        ...a,
        weight: importances[a.questionId] ?? (2 as 1 | 2 | 3),
      }))
      await api.submitMatch(sessionId, quizAnswers)
      router.push("/analyzing")
    } catch {
      toast.error("Error al enviar respuestas. Intenta de nuevo.")
      setSubmitting(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const num = parseInt(e.key)
      if (num >= 1 && num <= 5 && currentQuestion) {
        answerQuestion(currentQuestion.id, num, importances[currentQuestion.id] ?? 2)
      }
      if (e.key === "ArrowRight" || (e.key === "Enter" && canGoNext && !isLast)) {
        handleNext()
      }
      if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault()
        handlePrev()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentQuestion, canGoNext, isLast, handleNext, handlePrev, answerQuestion, importances])

  if (loading) return <QuestionSkeleton />

  if (!currentQuestion) return null

  const variants = prefersReduced
    ? {}
    : {
        initial: { x: direction > 0 ? 60 : -60, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: direction > 0 ? -60 : 60, opacity: 0 },
      }

  return (
    <div className="flex min-h-dvh flex-col px-4 pb-32 pt-6">
      {/* Progress */}
      <div className="mx-auto w-full max-w-2xl">
        <QuizProgressBar
          current={currentIndex}
          total={questions.length}
          axis={currentQuestion.axis}
        />
      </div>

      {/* Question */}
      <div className="flex flex-1 py-8">
        <div className="w-full max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              {...variants}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <QuestionCard
                question={currentQuestion}
                likertValue={currentAnswer?.value as number | undefined}
                importanceValue={importances[currentQuestion.id] ?? 2}
                onLikertChange={(v) =>
                  answerQuestion(
                    currentQuestion.id,
                    v,
                    importances[currentQuestion.id] ?? 2
                  )
                }
                onImportanceChange={(v) =>
                  setImportances((prev) => ({
                    ...prev,
                    [currentQuestion.id]: v,
                  }))
                }
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation — fixed at bottom */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-surface-border bg-background/95 backdrop-blur-md px-4 py-4">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Anterior
          </Button>

          {isLast && isComplete() ? (
            <Button
              variant="brutal"
              onClick={handleSubmit}
              disabled={submitting}
              className="gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Ver resultados"
              )}
            </Button>
          ) : (
            <Button
              variant="brutal"
              onClick={handleNext}
              disabled={!canGoNext}
              className="gap-2"
            >
              Siguiente
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
        <p className="mt-2 text-center text-xs text-text-subtle">
          Usa las teclas 1-5 para responder, ← → para navegar
        </p>
      </div>
    </div>
  )
}
