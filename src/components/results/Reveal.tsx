"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Check, Zap, User } from "lucide-react"
import { mockCandidates } from "@/lib/mock/candidates"
import type { MatchResult } from "@/types/domain"

interface RevealProps {
  result: MatchResult
  onRevealComplete: () => void
}

export function Reveal({ result, onRevealComplete }: RevealProps) {
  const prefersReduced = useReducedMotion()
  const [phase, setPhase] = useState<"initial" | "transition" | "reveal">(
    prefersReduced ? "reveal" : "initial"
  )
  const [animatedScore, setAnimatedScore] = useState(0)

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

  useEffect(() => {
    if (prefersReduced) {
      setAnimatedScore(topResult.score)
      onRevealComplete()
      return
    }

    const t1 = setTimeout(() => setPhase("transition"), 3000)
    const t2 = setTimeout(() => {
      setPhase("reveal")
      onRevealComplete()
    }, 4500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [prefersReduced, topResult.score, onRevealComplete])

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

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
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
                <User
                  className="size-10"
                  style={{ color: initialCandidate.color }}
                />
              </div>
              <h3 className="font-display text-2xl font-bold text-text">
                {initialCandidate.name}
              </h3>
              <p className="text-sm text-text-muted">
                {initialCandidate.party}
              </p>
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

        {/* Phase 3: Reveal */}
        {phase === "reveal" && topCandidate && (
          <motion.div
            key="reveal"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            {/* Match/Gap Badge */}
            <div
              className={`mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold ${
                isMatch
                  ? "bg-success/10 text-success"
                  : "bg-accent/10 text-accent"
              }`}
            >
              {isMatch ? (
                <>
                  <Check className="size-4" /> Tu preferencia y tu afinidad
                  coinciden
                </>
              ) : (
                <>
                  <Zap className="size-4" /> Tu preferencia y tu afinidad NO
                  coinciden
                </>
              )}
            </div>

            {/* Top candidate */}
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
                  <User
                    className="size-12"
                    style={{ color: topCandidate.color }}
                  />
                </div>
                <h2 className="font-display text-3xl font-bold text-text">
                  {topCandidate.name}
                </h2>
                <p className="text-sm text-text-muted">
                  {topCandidate.party}
                </p>
                <div className="font-display text-5xl font-bold text-primary">
                  {animatedScore}%
                </div>
                <p className="text-xs text-text-subtle">
                  de afinidad programática
                </p>
              </div>
            </div>

            {/* Explanation for GAP */}
            {!isMatch && !specialPreference && (
              <motion.p
                initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-text-muted"
              >
                Esto <strong className="text-text">NO</strong> significa que
                debas cambiar tu voto. Significa que vale la pena revisar por
                qué apoyas a{" "}
                <strong className="text-text">
                  {initialCandidate?.name}
                </strong>
                .
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
