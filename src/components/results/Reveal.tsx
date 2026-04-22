"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Check, Zap, User, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { mockCandidates } from "@/lib/mock/candidates"
import { AXIS_LABELS } from "@/types/domain"
import type { MatchResult, CandidateResult } from "@/types/domain"

interface RevealProps {
  result: MatchResult
  onRevealComplete: () => void
}

interface AxisSlide {
  axis: string
  userStance: string
  candidateId: string
  candidateName: string
  candidateColor: string
  candidateParty: string
  candidateStance: string
  quote: string
  programPage?: number
  isTopCandidate: boolean
}

type Phase = "initial" | "transition" | "reveal" | "axes" | "done"

export function Reveal({ result, onRevealComplete }: RevealProps) {
  const prefersReduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>(prefersReduced ? "reveal" : "initial")
  const [animatedScore, setAnimatedScore] = useState(0)
  const [axisIndex, setAxisIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  const topResult = result.results[0]
  const topCandidate = mockCandidates.find((c) => c.id === topResult.candidateId)
  const initialCandidate = mockCandidates.find(
    (c) => c.id === result.initial_preference
  )
  const isMatch = result.preference_match
  const specialPreference =
    result.initial_preference === "undecided" ||
    result.initial_preference === "blank" ||
    result.initial_preference === "na"

  // Para cada eje, buscar el candidato con mayor coincidencia entre el top 3
  const axisSlides: AxisSlide[] = (() => {
    const top3 = result.results.slice(0, 3)
    const axisMap = new Map<string, AxisSlide>()

    for (const candidateResult of top3) {
      const candidate = mockCandidates.find((c) => c.id === candidateResult.candidateId)
      if (!candidate || !candidateResult.byAxis) continue

      for (const axisData of candidateResult.byAxis) {
        const existing = axisMap.get(axisData.axis)
        // Si no hay entrada para este eje, o si este candidato tiene mejor score
        if (!existing) {
          axisMap.set(axisData.axis, {
            axis: axisData.axis,
            userStance: axisData.userStance,
            candidateId: candidate.id,
            candidateName: candidate.name,
            candidateColor: candidate.color,
            candidateParty: candidate.party,
            candidateStance: axisData.candidateStance,
            quote: axisData.quote,
            programPage: axisData.programPage,
            isTopCandidate: candidate.id === topResult.candidateId,
          })
        }
        // Mantener el del candidato con mejor score general si ya existe
        // (el top3 ya viene ordenado por score, así que el primero que encontremos es el mejor)
      }
    }

    return Array.from(axisMap.values())
  })()

  const currentSlide = axisSlides[axisIndex]
  const totalAxes = axisSlides.length

  // Phase transitions: initial -> transition -> reveal
  useEffect(() => {
    if (prefersReduced) {
      setAnimatedScore(topResult.score)
      return
    }

    const t1 = setTimeout(() => setPhase("transition"), 3000)
    const t2 = setTimeout(() => setPhase("reveal"), 4500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [prefersReduced, topResult.score])

  // Animate score counter
  useEffect(() => {
    if (phase !== "reveal" || prefersReduced) return
    let current = 0
    const target = topResult.score
    const interval = setInterval(() => {
      current += 1
      if (current >= target) {
        current = target
        clearInterval(interval)
      }
      setAnimatedScore(current)
    }, 20)
    return () => clearInterval(interval)
  }, [phase, topResult.score, prefersReduced])

  // Auto-advance axes slideshow
  useEffect(() => {
    if (phase !== "axes" || !autoPlay || totalAxes === 0) return
    const interval = setInterval(() => {
      setAxisIndex((prev) => {
        if (prev >= totalAxes - 1) {
          setPhase("done")
          onRevealComplete()
          return prev
        }
        return prev + 1
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [phase, autoPlay, totalAxes, onRevealComplete])

  const handleStartAxes = useCallback(() => {
    if (axisSlides.length > 0) {
      setPhase("axes")
      setAxisIndex(0)
    } else {
      setPhase("done")
      onRevealComplete()
    }
  }, [axisSlides.length, onRevealComplete])

  const handleSkip = useCallback(() => {
    setAutoPlay(false)
    setPhase("done")
    onRevealComplete()
  }, [onRevealComplete])

  const handlePrev = useCallback(() => {
    setAutoPlay(false)
    setAxisIndex((prev) => Math.max(0, prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    setAutoPlay(false)
    if (axisIndex >= totalAxes - 1) {
      setPhase("done")
      onRevealComplete()
    } else {
      setAxisIndex((prev) => prev + 1)
    }
  }, [axisIndex, totalAxes, onRevealComplete])

  return (
    <div className={`flex flex-col items-center justify-center px-4 py-12 ${phase === "done" ? "" : "min-h-[85vh]"}`}>
      <AnimatePresence mode="wait">
        {/* Phase 1: Show initial preference */}
        {phase === "initial" && !specialPreference && initialCandidate && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="font-display text-lg text-text-muted">
              Tu preferencia inicial declarada era...
            </p>
            <div className="mt-6 inline-flex flex-col items-center gap-4 rounded-brutal border-2 border-surface-border bg-surface px-10 py-8">
              <div
                className="flex size-20 items-center justify-center rounded-full"
                style={{ backgroundColor: initialCandidate.color + "20" }}
              >
                {initialCandidate.photo ? (
                  <img src={initialCandidate.photo} alt={initialCandidate.name} className="size-full rounded-full object-cover" />
                ) : (
                  <User className="size-10" style={{ color: initialCandidate.color }} />
                )}
              </div>
              <h3 className="font-display text-2xl font-bold text-text">
                {initialCandidate.name}
              </h3>
              <p className="text-sm text-text-muted">{initialCandidate.party}</p>
            </div>
          </motion.div>
        )}

        {phase === "initial" && specialPreference && (
          <motion.div
            key="initial-special"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <p className="font-display text-lg text-text-muted">
              Antes del test declaraste:{" "}
              <span className="font-bold text-text">
                {result.initial_preference === "undecided"
                  ? "Aún no decidido"
                  : result.initial_preference === "blank"
                    ? "Voto en blanco"
                    : "Prefiero no decir"}
              </span>
            </p>
          </motion.div>
        )}

        {/* Phase 2: Transition */}
        {phase === "transition" && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <p className="font-display text-xl font-bold text-text">
              Pero según tus 10 respuestas...
            </p>
          </motion.div>
        )}

        {/* Phase 3: Reveal top candidate */}
        {phase === "reveal" && topCandidate && (
          <motion.div
            key="reveal"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            {/* Match/Gap Badge */}
            <div
              className={`mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold ${
                isMatch ? "bg-success/10 text-success" : "bg-accent/10 text-accent"
              }`}
            >
              {isMatch ? (
                <>
                  <Check className="size-4" /> Tu preferencia y tu afinidad coinciden
                </>
              ) : (
                <>
                  <Zap className="size-4" /> Tu preferencia y tu afinidad NO coinciden
                </>
              )}
            </div>

            {/* Top candidate card */}
            <div className="mt-4">
              <p className="text-sm text-text-muted">
                Tu mayor afinidad programática es con
              </p>
              <div
                className="mt-6 inline-flex flex-col items-center gap-4 rounded-brutal border-2 p-8"
                style={{
                  borderColor: topCandidate.color,
                  boxShadow: `4px 4px 0px 0px ${topCandidate.color}`,
                }}
              >
                <div
                  className="flex size-24 items-center justify-center rounded-full"
                  style={{ backgroundColor: topCandidate.color + "20" }}
                >
                  {topCandidate.photo ? (
                    <img src={topCandidate.photo} alt={topCandidate.name} className="size-full rounded-full object-cover" />
                  ) : (
                    <User className="size-12" style={{ color: topCandidate.color }} />
                  )}
                </div>
                <h2 className="font-display text-3xl font-bold text-text">
                  {topCandidate.name}
                </h2>
                <p className="text-sm text-text-muted">{topCandidate.party}</p>
                <div className="font-display text-5xl font-bold text-primary">
                  {animatedScore}%
                </div>
                <p className="text-xs text-text-subtle">de afinidad programática</p>
              </div>
            </div>

            {/* Gap explanation */}
            {!isMatch && !specialPreference && (
              <motion.p
                initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-text-muted"
              >
                Esto <strong className="text-text">NO</strong> significa que debas
                cambiar tu voto. Significa que vale la pena revisar por qué apoyas a{" "}
                <strong className="text-text">{initialCandidate?.name}</strong>.
              </motion.p>
            )}

            {/* CTA to see breakdown */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-8 flex flex-col items-center gap-3"
            >
              <Button variant="brutal" size="lg" onClick={handleStartAxes} className="gap-2">
                Ver por qué
                <ChevronRight className="size-4" />
              </Button>
              <button
                onClick={handleSkip}
                className="text-xs text-text-subtle transition-colors hover:text-text-muted"
              >
                Saltar al resultado completo
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Phase 4: Axis slideshow */}
        {phase === "axes" && currentSlide && (
          <motion.div
            key={`axis-${axisIndex}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex w-full max-w-lg flex-col items-center"
          >
            {/* Progress */}
            <div className="mb-6 w-full space-y-2">
              <div className="flex items-center justify-between text-xs text-text-subtle">
                <span>
                  {axisIndex + 1} de {totalAxes} ejes
                </span>
                <button
                  onClick={handleSkip}
                  className="transition-colors hover:text-text-muted"
                >
                  Saltar
                </button>
              </div>
              <Progress value={((axisIndex + 1) / totalAxes) * 100} className="h-1.5" />
            </div>

            {/* Axis name */}
            <div className="mb-6 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 font-display text-sm font-bold text-primary">
                {AXIS_LABELS[currentSlide.axis as keyof typeof AXIS_LABELS] ?? currentSlide.axis}
              </span>
              {!currentSlide.isTopCandidate && (
                <p className="mt-2 text-xs text-accent">
                  En este eje coincides más con otro candidato
                </p>
              )}
            </div>

            {/* Comparison cards */}
            <div className="w-full space-y-3">
              {/* User stance */}
              <div className="rounded-brutal border-2 border-primary/30 bg-primary/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                  Tu postura
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text">
                  {currentSlide.userStance}
                </p>
              </div>

              {/* VS divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-surface-border" />
                <span className="font-display text-xs font-bold text-text-subtle">VS</span>
                <div className="h-px flex-1 bg-surface-border" />
              </div>

              {/* Candidate stance */}
              <div
                className="rounded-brutal border-2 p-4"
                style={{
                  borderColor: currentSlide.candidateColor + "50",
                  backgroundColor: currentSlide.candidateColor + "08",
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="flex size-6 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: currentSlide.candidateColor + "20" }}
                  >
                    {(() => {
                      const slideCandidate = mockCandidates.find((c) => c.id === currentSlide.candidateId)
                      return slideCandidate?.photo ? (
                        <img src={slideCandidate.photo} alt={currentSlide.candidateName} className="size-full rounded-full object-cover" />
                      ) : (
                        <User className="size-3" style={{ color: currentSlide.candidateColor }} />
                      )
                    })()}
                  </div>
                  <p
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: currentSlide.candidateColor }}
                  >
                    {currentSlide.candidateName}
                  </p>
                  <span className="text-[10px] text-text-subtle">
                    {currentSlide.candidateParty}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text">
                  {currentSlide.candidateStance}
                </p>

                {/* Quote */}
                {currentSlide.quote && (
                  <blockquote className="mt-3 border-l-2 border-text-subtle/30 pl-3 text-xs italic text-text-muted">
                    &ldquo;{currentSlide.quote}&rdquo;
                    {currentSlide.programPage && (
                      <span className="ml-1.5 not-italic text-text-subtle">
                        <FileText className="mr-0.5 inline size-3" />
                        Pág. {currentSlide.programPage}
                      </span>
                    )}
                  </blockquote>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                disabled={axisIndex === 0}
              >
                <ChevronLeft className="size-5" />
              </Button>

              {/* Dots */}
              <div className="flex gap-1.5">
                {axisSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAutoPlay(false)
                      setAxisIndex(i)
                    }}
                    className={`size-2 rounded-full transition-all ${
                      i === axisIndex
                        ? "scale-125 bg-primary"
                        : i < axisIndex
                          ? "bg-primary/40"
                          : "bg-surface-border"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
              >
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
