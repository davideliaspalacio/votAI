"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { StepAge } from "./StepAge"
import { StepRegion } from "./StepRegion"
import { StepGender } from "./StepGender"
import { StepIntention } from "./StepIntention"
import { useSessionStore } from "@/lib/store/sessionStore"
import { useQuizStore } from "@/lib/store/quizStore"
import { api } from "@/lib/api"
import type { AgeRange, Region, Gender } from "@/types/domain"

const TOTAL_STEPS = 4

export function OnboardingForm() {
  const router = useRouter()
  const prefersReduced = useReducedMotion()
  const { setSessionId, setDemographics } = useSessionStore()
  const resetQuiz = useQuizStore((s) => s.reset)

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [loading, setLoading] = useState(false)

  const [ageRange, setAgeRange] = useState<AgeRange | null>(null)
  const [region, setRegion] = useState<Region | null>(null)
  const [gender, setGender] = useState<Gender | null>(null)
  const [initialPreference, setInitialPreference] = useState<string | null>(null)

  const canAdvance = useCallback(() => {
    switch (step) {
      case 0: return ageRange !== null
      case 1: return region !== null
      case 2: return true // gender is optional
      case 3: return initialPreference !== null
      default: return false
    }
  }, [step, ageRange, region, initialPreference])

  const goNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1 && canAdvance()) {
      setDirection(1)
      setStep((s) => s + 1)
    }
  }, [step, canAdvance])

  const goPrev = useCallback(() => {
    if (step > 0) {
      setDirection(-1)
      setStep((s) => s - 1)
    }
  }, [step])

  const handleSubmit = async () => {
    if (!ageRange || !region || !initialPreference) return
    setLoading(true)
    try {
      const payload = {
        age_range: ageRange,
        region,
        gender: gender ?? ("na" as Gender),
        initial_preference: initialPreference,
      }
      const { sessionId } = await api.startSession(payload)
      resetQuiz()
      setSessionId(sessionId)
      setDemographics({
        ageRange,
        region,
        gender: gender ?? "na",
        initialPreference,
      })
      router.push("/quiz")
    } catch (err) {
      const error = err as Error & { status?: number; code?: string; retryAfterHours?: number }
      if (error.status === 403 && error.code === "RATE_LIMIT_EXCEEDED") {
        toast.error(`Ya hiciste 2 tests en las últimas ${error.retryAfterHours ?? 12} horas. Intenta más tarde.`, { duration: 6000 })
      } else {
        toast.error("Error al iniciar sesión. Intenta de nuevo.")
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && step < TOTAL_STEPS - 1 && canAdvance()) {
        goNext()
      }
      if (e.key === "Escape") {
        goPrev()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [step, canAdvance, goNext, goPrev])

  const variants = prefersReduced
    ? {}
    : {
        initial: { x: direction > 0 ? 80 : -80, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: direction > 0 ? -80 : 80, opacity: 0 },
      }

  return (
    <div className="flex min-h-dvh flex-col px-4 py-8">
      {/* Progress */}
      <div className="mx-auto w-full max-w-md">
        <div className="mb-2 flex items-center justify-between text-xs text-text-subtle">
          <span>Paso {step + 1} de {TOTAL_STEPS}</span>
          <span>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
        </div>
        <Progress value={((step + 1) / TOTAL_STEPS) * 100} className="h-2" />
      </div>

      {/* Step content */}
      <div className="flex flex-1 items-center justify-center py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              {...variants}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {step === 0 && <StepAge value={ageRange} onChange={setAgeRange} />}
              {step === 1 && <StepRegion value={region} onChange={setRegion} />}
              {step === 2 && <StepGender value={gender} onChange={setGender} />}
              {step === 3 && (
                <StepIntention
                  value={initialPreference}
                  onChange={setInitialPreference}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="mx-auto flex w-full max-w-md items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={goPrev}
          disabled={step === 0}
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          Anterior
        </Button>

        {step < TOTAL_STEPS - 1 ? (
          <Button
            variant="brutal"
            onClick={goNext}
            disabled={!canAdvance()}
            className="gap-2"
          >
            Siguiente
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            variant="brutal"
            onClick={handleSubmit}
            disabled={!canAdvance() || loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Iniciando...
              </>
            ) : (
              <>
                Comenzar el quiz
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
