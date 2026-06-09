"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { StepAge } from "@/components/onboarding/StepAge"
import { StepRegion } from "@/components/onboarding/StepRegion"
import { StepGender } from "@/components/onboarding/StepGender"
import { StepEstrato } from "./StepEstrato"
import { StepAcademicLevel } from "./StepAcademicLevel"
import { StepFirstRoundVote } from "./StepFirstRoundVote"
import { StepRunoffIntention } from "./StepRunoffIntention"
import { useRunoffSessionStore } from "@/lib/store/runoffSessionStore"
import { useRunoffQuizStore } from "@/lib/store/runoffQuizStore"
import { api } from "@/lib/api"
import type {
  AgeRange,
  Region,
  Gender,
  Estrato,
  AcademicLevel,
} from "@/types/domain"

const TOTAL_STEPS = 7

export function RunoffOnboardingForm() {
  const router = useRouter()
  const prefersReduced = useReducedMotion()
  const { setSessionId, setDemographics } = useRunoffSessionStore()
  const resetQuiz = useRunoffQuizStore((s) => s.reset)

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [loading, setLoading] = useState(false)

  const [ageRange, setAgeRange] = useState<AgeRange | null>(null)
  const [region, setRegion] = useState<Region | null>(null)
  const [gender, setGender] = useState<Gender | null>(null)
  const [estrato, setEstrato] = useState<Estrato | null>(null)
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel | null>(null)
  const [firstRoundVote, setFirstRoundVote] = useState<string | null>(null)
  const [runoffIntention, setRunoffIntention] = useState<string | null>(null)

  const canAdvance = useCallback(() => {
    switch (step) {
      case 0:
        return ageRange !== null
      case 1:
        return region !== null
      case 2:
        return true // género es opcional
      case 3:
        return estrato !== null
      case 4:
        return academicLevel !== null
      case 5:
        return firstRoundVote !== null
      case 6:
        return runoffIntention !== null
      default:
        return false
    }
  }, [step, ageRange, region, estrato, academicLevel, firstRoundVote, runoffIntention])

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
    if (
      !ageRange ||
      !region ||
      !estrato ||
      !academicLevel ||
      !firstRoundVote ||
      !runoffIntention
    )
      return
    setLoading(true)
    try {
      const payload = {
        age_range: ageRange,
        region,
        gender: gender ?? ("na" as Gender),
        estrato,
        academic_level: academicLevel,
        first_round_vote: firstRoundVote,
        runoff_intention: runoffIntention,
      }
      const { sessionId } = await api.startRunoffSession(payload)
      resetQuiz()
      setSessionId(sessionId)
      setDemographics({
        ageRange,
        region,
        gender: gender ?? "na",
        estrato,
        academicLevel,
        firstRoundVote,
        runoffIntention,
      })
      router.push("/segunda-vuelta/quiz")
    } catch {
      toast.error("Error al iniciar sesión. Intenta de nuevo.")
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
    <div className="flex min-h-dvh flex-col px-4 pb-28 pt-8">
      {/* Progress */}
      <div className="mx-auto w-full max-w-md">
        <div className="mb-2 flex items-center justify-between text-xs text-text-subtle">
          <span>
            Paso {step + 1} de {TOTAL_STEPS}
          </span>
          <span>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
        </div>
        <Progress value={((step + 1) / TOTAL_STEPS) * 100} className="h-2" />
      </div>

      {/* Step content */}
      <div className="flex flex-1 py-8">
        <div className="w-full max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              {...variants}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {step === 0 && <StepAge value={ageRange} onChange={setAgeRange} />}
              {step === 1 && (
                <StepRegion value={region} onChange={setRegion} />
              )}
              {step === 2 && (
                <StepGender value={gender} onChange={setGender} />
              )}
              {step === 3 && (
                <StepEstrato value={estrato} onChange={setEstrato} />
              )}
              {step === 4 && (
                <StepAcademicLevel
                  value={academicLevel}
                  onChange={setAcademicLevel}
                />
              )}
              {step === 5 && (
                <StepFirstRoundVote
                  value={firstRoundVote}
                  onChange={setFirstRoundVote}
                />
              )}
              {step === 6 && (
                <StepRunoffIntention
                  value={runoffIntention}
                  onChange={setRunoffIntention}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation — always visible at bottom */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-surface-border bg-background/95 backdrop-blur-md px-4 py-4">
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
                  Comenzar el test
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
