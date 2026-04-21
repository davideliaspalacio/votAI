"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Brain, Scale, BarChart3, Loader2, RefreshCw, BookOpen, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useSessionStore } from "@/lib/store/sessionStore"
import { api } from "@/lib/api"
import { mockCandidates } from "@/lib/mock/candidates"
import { AXIS_LABELS, AXES } from "@/types/domain"

const STEPS = [
  {
    icon: FileText,
    getMessage: () => {
      const candidate =
        mockCandidates[Math.floor(Math.random() * mockCandidates.length)]
      return `Revisando programa de ${candidate.name}...`
    },
  },
  {
    icon: Brain,
    getMessage: () => {
      const candidate =
        mockCandidates[Math.floor(Math.random() * mockCandidates.length)]
      return `Analizando propuestas de ${candidate.name}...`
    },
  },
  {
    icon: Scale,
    getMessage: () => {
      const axis = AXES[Math.floor(Math.random() * AXES.length)]
      return `Comparando posturas en ${AXIS_LABELS[axis]}...`
    },
  },
  {
    icon: BookOpen,
    getMessage: () => {
      const axis = AXES[Math.floor(Math.random() * AXES.length)]
      return `Evaluando tu posición en ${AXIS_LABELS[axis]}...`
    },
  },
  {
    icon: Users,
    getMessage: () => `Cruzando datos con ${mockCandidates.length} candidatos...`,
  },
  {
    icon: BarChart3,
    getMessage: () => "Calculando tu afinidad programática...",
  },
]

const FUN_FACTS = [
  "Colombia tiene el 50% de los páramos del mundo",
  "La Constitución de 1991 ha tenido más de 50 reformas",
  "La informalidad laboral en Colombia supera el 55%",
  "Colombia es el segundo país más biodiverso del planeta",
  "El voto en Colombia es un derecho y un deber ciudadano",
  "Más de 6 millones de colombianos viven en el exterior",
  "Colombia tiene 32 departamentos y un distrito capital",
  "El Congreso colombiano tiene 108 senadores y 188 representantes",
]

const MIN_DISPLAY_MS = 4000
const TIMEOUT_MS = 60000

export function AnalyzingAnimation() {
  const router = useRouter()
  const prefersReduced = useReducedMotion()
  const sessionId = useSessionStore((s) => s.sessionId)

  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState(STEPS[0].getMessage())
  const [funFact, setFunFact] = useState(() => FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)])
  const [candidatesAnalyzed, setCandidatesAnalyzed] = useState(0)
  const [error, setError] = useState(false)
  const [done, setDone] = useState(false)
  const startTime = useRef(Date.now())

  // Progreso logaritmico: rapido al inicio, lento al acercarse al 90%
  useEffect(() => {
    if (done) return
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return 90
        const remaining = 90 - p
        const increment = Math.max(0.3, remaining * 0.04)
        return Math.min(p + increment, 90)
      })
    }, 200)
    return () => clearInterval(interval)
  }, [done])

  // Rotar pasos y mensajes
  useEffect(() => {
    if (done) return
    const interval = setInterval(() => {
      setStep((s) => {
        const next = (s + 1) % STEPS.length
        setMessage(STEPS[next].getMessage())
        return next
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [done])

  // Contador de candidatos analizados
  useEffect(() => {
    if (done) return
    const interval = setInterval(() => {
      setCandidatesAnalyzed((c) => {
        if (c >= mockCandidates.length) return mockCandidates.length
        return c + 1
      })
    }, 1200)
    return () => clearInterval(interval)
  }, [done])

  // Rotar datos curiosos
  useEffect(() => {
    if (done) return
    const interval = setInterval(() => {
      setFunFact(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)])
    }, 5000)
    return () => clearInterval(interval)
  }, [done])

  // Polling
  const poll = useCallback(async () => {
    if (!sessionId) return false
    try {
      const result = await api.getMatchResult(sessionId)
      if (result.status === "done") {
        setDone(true)
        setCandidatesAnalyzed(mockCandidates.length)
        const elapsed = Date.now() - startTime.current
        const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)
        setTimeout(() => {
          setProgress(100)
          setTimeout(() => router.push(`/resultados/${sessionId}`), 400)
        }, remaining)
        return true
      }
      return false
    } catch {
      return false
    }
  }, [sessionId, router])

  useEffect(() => {
    if (!sessionId) {
      router.replace("/onboarding")
      return
    }

    poll()

    const pollInterval = setInterval(async () => {
      const isDone = await poll()
      if (isDone) clearInterval(pollInterval)
      if (Date.now() - startTime.current > TIMEOUT_MS) {
        clearInterval(pollInterval)
        setError(true)
      }
    }, 2000)

    return () => clearInterval(pollInterval)
  }, [sessionId, router, poll])

  const CurrentIcon = STEPS[step].icon

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <h2 className="font-display text-display-sm font-bold text-text">
            Está tardando más de lo esperado
          </h2>
          <p className="mt-2 text-text-muted">
            El análisis está tomando más tiempo del habitual.
          </p>
        </div>
        <Button
          variant="brutal"
          onClick={() => {
            setError(false)
            setDone(false)
            setProgress(0)
            setCandidatesAnalyzed(0)
            startTime.current = Date.now()
          }}
          className="gap-2"
        >
          <RefreshCw className="size-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4">
      {/* Icono animado */}
      <div className="relative">
        {prefersReduced ? (
          <Loader2 className="size-16 animate-spin text-primary" />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.08, 1], opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CurrentIcon className="size-16 text-primary" />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Mensaje principal */}
      <div className="h-14 flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="font-display text-lg font-semibold text-text text-center"
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Barra de progreso */}
      <div className="w-full max-w-xs space-y-2">
        <Progress value={progress} className="h-2.5" />
        <div className="flex justify-between text-xs text-text-subtle">
          <span>
            {candidatesAnalyzed}/{mockCandidates.length} candidatos
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Dato curioso */}
      <div className="mt-4 max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={funFact}
            initial={prefersReduced ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? {} : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-surface-border bg-surface/50 px-4 py-3 text-center"
          >
            <p className="text-xs font-medium text-text-muted">
              ¿Sabías que...?
            </p>
            <p className="mt-1 text-sm text-text">
              {funFact}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
