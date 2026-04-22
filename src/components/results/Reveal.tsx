"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Check, Zap, User, ChevronLeft, ChevronRight, FileText, Share2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { mockCandidates } from "@/lib/mock/candidates"
import { AXIS_LABELS } from "@/types/domain"
import { ShareStoryCard } from "./ShareStoryCard"
import type { MatchResult, CandidateResult } from "@/types/domain"

interface RevealProps {
  result: MatchResult
  onRevealComplete: () => void
}

interface AxisSlide {
  axis: string
  userStance: string
  // Los candidatos que tienen data para este eje (top 3 del resultado)
  candidates: {
    candidateId: string
    candidateName: string
    candidateColor: string
    candidateParty: string
    candidateStance: string
    candidatePhoto?: string
    quote: string
    programPage?: number
  }[]
}

type Phase = "initial" | "transition" | "reveal" | "axes" | "done"

export function Reveal({ result, onRevealComplete }: RevealProps) {
  const prefersReduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>(prefersReduced ? "reveal" : "initial")
  const [animatedScores, setAnimatedScores] = useState<number[]>([])
  const [axisIndex, setAxisIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const storyCardRef = useRef<HTMLDivElement>(null)

  const allResults = useMemo(() => result.results, [result.results])
  const allCandidates = useMemo(() => allResults.map((r) => ({
    ...r,
    candidate: mockCandidates.find((c) => c.id === r.candidateId),
  })), [allResults])
  const top3Results = useMemo(() => result.results.slice(0, 3), [result.results])
  const topResult = result.results[0]
  const topCandidate = allCandidates[0]?.candidate
  const scoreTargets = useRef(allResults.map((r) => r.score))
  const initialCandidate = mockCandidates.find(
    (c) => c.id === result.initial_preference
  )
  const isMatch = result.preference_match
  const specialPreference =
    result.initial_preference === "undecided" ||
    result.initial_preference === "blank" ||
    result.initial_preference === "na"

  // Construir slides con todos los candidatos del top 3 por eje
  const axisSlides: AxisSlide[] = (() => {
    const axisMap = new Map<string, AxisSlide>()

    for (const candidateResult of top3Results) {
      const candidate = mockCandidates.find((c) => c.id === candidateResult.candidateId)
      if (!candidate || !candidateResult.byAxis) continue

      for (const axisData of candidateResult.byAxis) {
        if (!axisMap.has(axisData.axis)) {
          axisMap.set(axisData.axis, {
            axis: axisData.axis,
            userStance: axisData.userStance,
            candidates: [],
          })
        }
        axisMap.get(axisData.axis)!.candidates.push({
          candidateId: candidate.id,
          candidateName: candidate.name,
          candidateColor: candidate.color,
          candidateParty: candidate.party,
          candidateStance: axisData.candidateStance,
          candidatePhoto: candidate.photo,
          quote: axisData.quote,
          programPage: axisData.programPage,
        })
      }
    }

    // Agregar el candidato elegido si no está en top 3
    if (initialCandidate && !specialPreference) {
      const initialResult = result.results.find((r) => r.candidateId === initialCandidate.id)
      if (initialResult?.byAxis) {
        for (const axisData of initialResult.byAxis) {
          const slide = axisMap.get(axisData.axis)
          if (slide && !slide.candidates.find((c) => c.candidateId === initialCandidate.id)) {
            slide.candidates.push({
              candidateId: initialCandidate.id,
              candidateName: initialCandidate.name,
              candidateColor: initialCandidate.color,
              candidateParty: initialCandidate.party,
              candidateStance: axisData.candidateStance,
              candidatePhoto: initialCandidate.photo,
              quote: axisData.quote,
              programPage: axisData.programPage,
            })
          }
        }
      }
    }

    return Array.from(axisMap.values())
  })()

  const currentSlide = axisSlides[axisIndex]
  const totalAxes = axisSlides.length

  // Phase transitions
  useEffect(() => {
    if (prefersReduced) {
      setAnimatedScores([...scoreTargets.current])
      return
    }
    const t1 = setTimeout(() => setPhase("transition"), 3000)
    const t2 = setTimeout(() => setPhase("reveal"), 4500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [prefersReduced])

  // Animate scores
  useEffect(() => {
    if (phase !== "reveal" || prefersReduced) return
    const targets = scoreTargets.current
    const current = new Array(targets.length).fill(0)
    const interval = setInterval(() => {
      let allDone = true
      for (let i = 0; i < targets.length; i++) {
        if (current[i] < (targets[i] ?? 0)) {
          current[i] += 1
          allDone = false
        }
      }
      setAnimatedScores([...current])
      if (allDone) clearInterval(interval)
    }, 20)
    return () => clearInterval(interval)
  }, [phase, prefersReduced])

  // Auto-advance slideshow
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
    }, 8000)
    return () => clearInterval(interval)
  }, [phase, autoPlay, totalAxes, onRevealComplete])

  // Candidato elegido si no está en top 3
  const initialNotInTop3 = !specialPreference && initialCandidate && !top3Results.find((r) => r.candidateId === initialCandidate.id)

  // Generar imagen capturando el componente ShareStoryCard
  const generateShareImage = useCallback(async (): Promise<Blob | null> => {
    if (!storyCardRef.current) return null
    try {
      const { toPng } = await import("html-to-image")
      const dataUrl = await toPng(storyCardRef.current, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        backgroundColor: "#0c0c18",
      })
      const res = await fetch(dataUrl)
      return await res.blob()
    } catch (err) {
      console.error("Error generando imagen:", err)
      return null
    }
  }, [])

  const handleShareImage = useCallback(async () => {
    const blob = await generateShareImage()
    if (!blob) { toast.error("No se pudo generar la imagen"); return }

    if (navigator.share) {
      try {
        const file = new File([blob], "votai-resultado.png", { type: "image/png" })
        const canShareFiles = navigator.canShare?.({ files: [file] })
        const host = typeof window !== "undefined" ? window.location.host : ""
        await navigator.share({
          title: "Mi afinidad programática",
          text: `Hice el test de afinidad en ${host} — mi mayor afinidad es con ${topCandidate?.name} (${topResult.score}%)`,
          ...(canShareFiles ? { files: [file] } : {}),
        })
        return
      } catch { /* cancelled */ }
    }

    // Fallback: download
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "votai-resultado.png"; a.click()
    URL.revokeObjectURL(url)
    toast.success("Imagen descargada")
  }, [generateShareImage, topCandidate, topResult])

  const handleStartAxes = useCallback(() => {
    if (axisSlides.length > 0) { setPhase("axes"); setAxisIndex(0) }
    else { setPhase("done"); onRevealComplete() }
  }, [axisSlides.length, onRevealComplete])

  const handleSkip = useCallback(() => {
    setAutoPlay(false); setPhase("done"); onRevealComplete()
  }, [onRevealComplete])

  const handlePrev = useCallback(() => {
    setAutoPlay(false); setAxisIndex((p) => Math.max(0, p - 1))
  }, [])

  const handleNext = useCallback(() => {
    setAutoPlay(false)
    if (axisIndex >= totalAxes - 1) { setPhase("done"); onRevealComplete() }
    else { setAxisIndex((p) => p + 1) }
  }, [axisIndex, totalAxes, onRevealComplete])

  return (
    <div className={`flex flex-col items-center justify-center px-4 py-12 ${phase === "done" ? "" : "min-h-[85vh]"}`}>
      {/* Componente oculto para captura de imagen — formato story 1080x1920 */}
      <ShareStoryCard
        ref={storyCardRef}
        results={result.results}
        initialPreference={result.initial_preference}
        preferenceMatch={result.preference_match}
      />

      <AnimatePresence mode="wait">
        {/* Phase 1: Initial preference */}
        {phase === "initial" && !specialPreference && initialCandidate && (
          <motion.div key="initial" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }} className="text-center">
            <p className="font-display text-lg text-text-muted">Tu preferencia inicial declarada era...</p>
            <div className="mt-6 inline-flex flex-col items-center gap-4 rounded-brutal border-2 border-surface-border bg-surface px-10 py-8">
              <div className="flex size-20 items-center justify-center rounded-full" style={{ backgroundColor: initialCandidate.color + "20" }}>
                {initialCandidate.photo ? (
                  <img src={initialCandidate.photo} alt={initialCandidate.name} className="size-full rounded-full object-cover" />
                ) : (
                  <User className="size-10" style={{ color: initialCandidate.color }} />
                )}
              </div>
              <h3 className="font-display text-2xl font-bold text-text">{initialCandidate.name}</h3>
              <p className="text-sm text-text-muted">{initialCandidate.party}</p>
            </div>
          </motion.div>
        )}

        {phase === "initial" && specialPreference && (
          <motion.div key="initial-special" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <p className="font-display text-lg text-text-muted">
              Antes del test declaraste:{" "}
              <span className="font-bold text-text">
                {result.initial_preference === "undecided" ? "Aún no decidido" : result.initial_preference === "blank" ? "Voto en blanco" : "Prefiero no decir"}
              </span>
            </p>
          </motion.div>
        )}

        {/* Phase 2: Transition */}
        {phase === "transition" && (
          <motion.div key="transition" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <p className="font-display text-xl font-bold text-text">Pero según tus 10 respuestas...</p>
          </motion.div>
        )}

        {/* Phase 3: Reveal TOP 3 */}
        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center w-full max-w-3xl"
          >
            {/* Match/Gap Badge */}
            <div className={`mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold ${isMatch ? "bg-success/10 text-success" : "bg-accent/10 text-accent"}`}>
              {isMatch ? (<><Check className="size-4" /> Tu preferencia y tu afinidad coinciden</>) : (<><Zap className="size-4" /> Tu preferencia y tu afinidad NO coinciden</>)}
            </div>

            {/* Candidato elegido primero (si no está en top 3) */}
            {initialNotInTop3 && initialCandidate && initialResult && (
              <motion.div
                initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-4 w-full"
              >
                <p className="mb-2 text-center text-xs text-text-subtle">Tu candidato elegido</p>
                <div
                  className="flex items-center gap-3 rounded-brutal border-2 border-dashed p-3"
                  style={{ borderColor: initialCandidate.color + "60" }}
                >
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: initialCandidate.color + "20" }}
                  >
                    {initialCandidate.photo ? (
                      <img src={initialCandidate.photo} alt={initialCandidate.name} className="size-full rounded-full object-cover" />
                    ) : (
                      <User className="size-5" style={{ color: initialCandidate.color }} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-bold text-text">{initialCandidate.name}</p>
                    <p className="text-[10px] text-text-muted">{initialCandidate.party}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-display text-xl font-bold text-text-muted">{initialResult.score}%</span>
                    <p className="text-[10px] text-text-subtle">Puesto #{initialRank}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <p className="mb-4 text-sm text-text-muted">Ranking de afinidad programática</p>

            {/* All candidates — compact rows */}
            <div className="w-full space-y-2.5">
              {allCandidates.map((item, i) => {
                if (!item.candidate) return null
                const isFirst = i === 0
                return (
                  <motion.div
                    key={item.candidateId}
                    initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.4 }}
                    className={`flex items-center gap-3 rounded-brutal border-2 p-3 ${isFirst ? "" : "border-surface-border bg-surface"}`}
                    style={isFirst ? { borderColor: item.candidate.color, boxShadow: `3px 3px 0px 0px ${item.candidate.color}` } : undefined}
                  >
                    {/* Position badge */}
                    <span className={`flex size-6 shrink-0 items-center justify-center rounded-full font-display text-[10px] font-bold ${isFirst ? "bg-primary text-primary-foreground" : "bg-surface-border text-text-subtle"}`}>
                      {i + 1}
                    </span>

                    {/* Avatar */}
                    <div
                      className={`flex shrink-0 items-center justify-center rounded-full ${isFirst ? "size-10" : "size-8"}`}
                      style={{ backgroundColor: item.candidate.color + "20" }}
                    >
                      {item.candidate.photo ? (
                        <img src={item.candidate.photo} alt={item.candidate.name} className="size-full rounded-full object-cover" />
                      ) : (
                        <User className={isFirst ? "size-5" : "size-4"} style={{ color: item.candidate.color }} />
                      )}
                    </div>

                    {/* Name + party */}
                    <div className="min-w-0 flex-1">
                      <p className={`font-display font-bold text-text ${isFirst ? "text-sm" : "text-xs"}`}>
                        {item.candidate.name}
                      </p>
                      <p className="text-[10px] text-text-muted">{item.candidate.party}</p>
                    </div>

                    {/* Score */}
                    <div className={`shrink-0 font-display font-bold text-primary ${isFirst ? "text-xl" : "text-base"}`}>
                      {animatedScores[i] ?? 0}%
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Share image button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 flex justify-center gap-2"
            >
              <Button variant="outline" size="sm" onClick={handleShareImage} className="gap-2 text-xs">
                <Share2 className="size-3.5" />
                Compartir imagen
              </Button>
            </motion.div>

            {/* Gap explanation */}
            {!isMatch && !specialPreference && (
              <motion.p initial={prefersReduced ? {} : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-text-muted">
                Esto <strong className="text-text">NO</strong> significa que debas cambiar tu voto. Significa que vale la pena revisar por qué apoyas a{" "}
                <strong className="text-text">{initialCandidate?.name}</strong>.
              </motion.p>
            )}

            {/* CTA */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-8 flex flex-col items-center gap-3">
              <Button variant="brutal" size="lg" onClick={handleStartAxes} className="gap-2">
                Ver por qué
                <ChevronRight className="size-4" />
              </Button>
              <button onClick={handleSkip} className="text-xs text-text-subtle transition-colors hover:text-text-muted">
                Saltar al resultado completo
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Phase 4: Axis slideshow — muestra top 3 + candidato elegido */}
        {phase === "axes" && currentSlide && (
          <motion.div
            key={`axis-${axisIndex}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex w-full max-w-2xl flex-col items-center"
          >
            {/* Progress */}
            <div className="mb-6 w-full space-y-2">
              <div className="flex items-center justify-between text-xs text-text-subtle">
                <span>{axisIndex + 1} de {totalAxes} ejes</span>
                <button onClick={handleSkip} className="transition-colors hover:text-text-muted">Saltar</button>
              </div>
              <Progress value={((axisIndex + 1) / totalAxes) * 100} className="h-1.5" />
            </div>

            {/* Axis name */}
            <div className="mb-5 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 font-display text-sm font-bold text-primary">
                {AXIS_LABELS[currentSlide.axis as keyof typeof AXIS_LABELS] ?? currentSlide.axis}
              </span>
            </div>

            {/* User stance */}
            <div className="mb-4 w-full rounded-brutal border-2 border-primary/30 bg-primary/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">Tu postura</p>
              <p className="mt-2 text-sm leading-relaxed text-text">{currentSlide.userStance}</p>
            </div>

            {/* Divider */}
            <div className="mb-4 flex w-full items-center gap-3">
              <div className="h-px flex-1 bg-surface-border" />
              <span className="font-display text-xs font-bold text-text-subtle">VS LOS CANDIDATOS</span>
              <div className="h-px flex-1 bg-surface-border" />
            </div>

            {/* All candidates for this axis */}
            <div className="w-full space-y-3">
              {currentSlide.candidates.map((cand) => {
                const isInitial = cand.candidateId === result.initial_preference
                return (
                  <div
                    key={cand.candidateId}
                    className="rounded-brutal border-2 p-4"
                    style={{
                      borderColor: cand.candidateColor + "50",
                      backgroundColor: cand.candidateColor + "08",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="flex size-7 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: cand.candidateColor + "20" }}
                      >
                        {cand.candidatePhoto ? (
                          <img src={cand.candidatePhoto} alt={cand.candidateName} className="size-full rounded-full object-cover" />
                        ) : (
                          <User className="size-3.5" style={{ color: cand.candidateColor }} />
                        )}
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: cand.candidateColor }}>
                        {cand.candidateName}
                      </p>
                      {isInitial && (
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                          Tu elegido
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-text">{cand.candidateStance}</p>
                    {cand.quote && (
                      <blockquote className="mt-2 border-l-2 border-text-subtle/30 pl-3 text-xs italic text-text-muted">
                        &ldquo;{cand.quote}&rdquo;
                        {cand.programPage && (
                          <span className="ml-1.5 not-italic text-text-subtle">
                            <FileText className="mr-0.5 inline size-3" /> Pág. {cand.programPage}
                          </span>
                        )}
                      </blockquote>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="mt-6 flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handlePrev} disabled={axisIndex === 0}>
                <ChevronLeft className="size-5" />
              </Button>
              <div className="flex gap-1.5">
                {axisSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setAutoPlay(false); setAxisIndex(i) }}
                    className={`size-2 rounded-full transition-all ${i === axisIndex ? "scale-125 bg-primary" : i < axisIndex ? "bg-primary/40" : "bg-surface-border"}`}
                  />
                ))}
              </div>
              <Button variant="ghost" size="icon" onClick={handleNext}>
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
