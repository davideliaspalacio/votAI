"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Check, Zap, User, ChevronLeft, ChevronRight, FileText, Share2 } from "lucide-react"
import { toast } from "sonner"
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
  const initialResult = initialNotInTop3 ? result.results.find((r) => r.candidateId === initialCandidate?.id) : null
  const initialRank = initialResult ? result.results.findIndex((r) => r.candidateId === initialCandidate?.id) + 1 : 0

  // Cargar foto de candidato como Image para canvas
  const loadImg = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })

  // Generar imagen story 1080x1920 pixel-perfect con el diseño del HTML del Reveal
  const generateShareImage = useCallback(async (): Promise<Blob | null> => {
    try {
      // Formato Instagram Story (1080x1920) — proporcional al HTML escalado x2
      const W = 1080
      const H = 1920
      const PAD = 60
      const cardX = PAD
      const cardW = W - PAD * 2

      const canvas = document.createElement("canvas")
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext("2d")
      if (!ctx) return null

      const font = "system-ui, -apple-system, 'Inter', sans-serif"

      // ============ FONDO (gradiente oscuro como el tema) ============
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, "#0c0c18")
      bg.addColorStop(0.5, "#13132a")
      bg.addColorStop(1, "#161630")
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // ============ HEADER: LOGO + URL ============
      const host = typeof window !== "undefined" ? window.location.host : "votoloco.com"

      // Cargar logo
      try {
        const logo = await loadImg("/votolocoimage.png")
        ctx.drawImage(logo, W / 2 - 50, 60, 100, 100)
      } catch {
        // ignorar si no carga
      }

      // Marca
      ctx.fillStyle = "#FFDE3A"
      ctx.font = `bold 56px ${font}`
      ctx.textAlign = "center"
      ctx.fillText("VotoLoco", W / 2, 220)

      // URL pequeño
      ctx.fillStyle = "#888"
      ctx.font = `bold 24px ${font}`
      ctx.fillText(host.toUpperCase(), W / 2, 258)

      // ============ BADGE MATCH/GAP (pill) ============
      const badgeY = 310
      const badgeText = isMatch
        ? "✓ Tu preferencia y tu afinidad coinciden"
        : "⚡ Tu preferencia y tu afinidad NO coinciden"
      const badgeColor = isMatch ? "#22c55e" : "#f59e0b"
      const badgeBg = isMatch ? "rgba(34, 197, 94, 0.12)" : "rgba(245, 158, 11, 0.12)"

      ctx.font = `bold 28px ${font}`
      const badgeTextWidth = ctx.measureText(badgeText).width
      const badgePadX = 40
      const badgeWidth = badgeTextWidth + badgePadX * 2
      const badgeHeight = 64

      ctx.beginPath()
      ctx.roundRect((W - badgeWidth) / 2, badgeY, badgeWidth, badgeHeight, badgeHeight / 2)
      ctx.fillStyle = badgeBg
      ctx.fill()
      ctx.strokeStyle = badgeColor + "55"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = badgeColor
      ctx.textBaseline = "middle"
      ctx.fillText(badgeText, W / 2, badgeY + badgeHeight / 2 + 2)
      ctx.textBaseline = "alphabetic"

      // ============ HELPER: dibujar tarjeta de candidato (h dinámico) ============
      const drawScaledCard = async (
        y: number,
        h: number,
        rank: number,
        name: string,
        party: string,
        color: string,
        photo: string | undefined,
        scoreVal: number,
        isTop: boolean,
        isDashed: boolean,
      ): Promise<number> => {
        const r = 28
        const padX = 40

        // Sombra brutal del top 1
        if (isTop && !isDashed) {
          ctx.beginPath()
          ctx.roundRect(cardX + 8, y + 8, cardW, h, r)
          ctx.fillStyle = color
          ctx.fill()
        }

        // Card body
        ctx.beginPath()
        ctx.roundRect(cardX, y, cardW, h, r)
        ctx.fillStyle = isTop ? color + "26" : "#1a1a30"
        ctx.fill()

        // Border
        if (isDashed) {
          ctx.setLineDash([16, 10])
          ctx.strokeStyle = color + "99"
          ctx.lineWidth = 4
        } else if (isTop) {
          ctx.setLineDash([])
          ctx.strokeStyle = color
          ctx.lineWidth = 5
        } else {
          ctx.setLineDash([])
          ctx.strokeStyle = "#2a2a45"
          ctx.lineWidth = 3
        }
        ctx.stroke()
        ctx.setLineDash([])

        const cy = y + h / 2

        // Tamaños proporcionales a la altura
        const baseHTop = 200
        const baseHOther = 150
        const baseH = isTop ? baseHTop : baseHOther
        const sf = h / baseH

        // ===== Badge número =====
        const badgeRadius = (isTop ? 36 : 28) * sf
        const badgeCx = cardX + padX + badgeRadius
        ctx.beginPath()
        ctx.arc(badgeCx, cy, badgeRadius, 0, Math.PI * 2)
        ctx.fillStyle = isTop ? "#FFDE3A" : "#2a2a45"
        ctx.fill()
        ctx.fillStyle = isTop ? "#0c0c18" : "#fff"
        ctx.font = `bold ${Math.round((isTop ? 32 : 26) * sf)}px ${font}`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(String(rank), badgeCx, cy + 2)
        ctx.textBaseline = "alphabetic"

        // ===== Foto del candidato =====
        const avatarRadius = (isTop ? 56 : 42) * sf
        const avatarCx = badgeCx + badgeRadius + avatarRadius + 28 * sf
        ctx.beginPath()
        ctx.arc(avatarCx, cy, avatarRadius, 0, Math.PI * 2)
        ctx.fillStyle = color + "33"
        ctx.fill()

        if (photo) {
          try {
            const img = await loadImg(photo)
            ctx.save()
            ctx.beginPath()
            ctx.arc(avatarCx, cy, avatarRadius - 2, 0, Math.PI * 2)
            ctx.clip()
            const size = (avatarRadius - 2) * 2
            ctx.drawImage(img, avatarCx - avatarRadius + 2, cy - avatarRadius + 2, size, size)
            ctx.restore()
          } catch {
            ctx.beginPath()
            ctx.arc(avatarCx, cy, avatarRadius / 2, 0, Math.PI * 2)
            ctx.fillStyle = color
            ctx.fill()
          }
        } else {
          ctx.beginPath()
          ctx.arc(avatarCx, cy, avatarRadius / 2, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()
        }

        // ===== Nombre + Partido =====
        const textX = avatarCx + avatarRadius + 32 * sf
        const scoreReserve = 220 * sf
        const textMaxW = cardX + cardW - textX - scoreReserve

        ctx.textAlign = "left"
        ctx.fillStyle = "#ffffff"
        ctx.font = `bold ${Math.round((isTop ? 44 : 36) * sf)}px ${font}`
        let displayName = name
        while (ctx.measureText(displayName).width > textMaxW && displayName.length > 5) {
          displayName = displayName.slice(0, -2) + "…"
        }
        ctx.fillText(displayName, textX, cy - (isTop ? 8 : 6) * sf)

        ctx.fillStyle = "#888"
        ctx.font = `${Math.round((isTop ? 24 : 20) * sf)}px ${font}`
        let displayParty = party
        while (ctx.measureText(displayParty).width > textMaxW && displayParty.length > 5) {
          displayParty = displayParty.slice(0, -3) + "…"
        }
        ctx.fillText(displayParty, textX, cy + (isTop ? 30 : 26) * sf)

        // ===== Score =====
        ctx.textAlign = "right"
        ctx.fillStyle = isTop ? "#FFDE3A" : "#bbb"
        ctx.font = `bold ${Math.round((isTop ? 72 : 52) * sf)}px ${font}`
        ctx.fillText(`${scoreVal}%`, cardX + cardW - padX, cy + (isTop ? 22 : 16) * sf)

        return y + h
      }

      // ============ CANDIDATO ELEGIDO (si no está en top y no es especial) ============
      let curY = 410
      const hasInit = !!initialNotInTop3 && !!initialCandidate && !!initialResult

      if (hasInit && initialCandidate && initialResult) {
        ctx.fillStyle = "#999"
        ctx.font = `28px ${font}`
        ctx.textAlign = "center"
        ctx.fillText("Candidato que escogiste antes de hacer el test", W / 2, curY)
        curY += 50

        const endY = await drawScaledCard(
          curY,
          150, // h fijo para candidato elegido
          initialRank,
          initialCandidate.name,
          initialCandidate.party,
          initialCandidate.color,
          initialCandidate.photo,
          initialResult.score,
          false,
          true, // dashed border
        )
        curY = endY + 40

        // Separador
        ctx.beginPath()
        ctx.moveTo(cardX + 80, curY)
        ctx.lineTo(W - cardX - 80, curY)
        ctx.strokeStyle = "#2a2a40"
        ctx.lineWidth = 2
        ctx.stroke()
        curY += 40
      }

      // ============ TÍTULO RANKING ============
      ctx.fillStyle = "#bbb"
      ctx.font = `28px ${font}`
      ctx.textAlign = "center"

      // Texto largo en 2 líneas
      const titleLine1 = "Candidatos con los que tienes afinidad"
      const titleLine2 = "asociado a su plan de gobierno"
      ctx.fillText(titleLine1, W / 2, curY)
      ctx.fillText(titleLine2, W / 2, curY + 36)
      curY += 80

      // ============ TODOS LOS CANDIDATOS ============
      // Calcular cuánto espacio hay disponible para que quepa todo
      const footerH = 220
      const availableH = H - curY - footerH
      const totalCandidates = allCandidates.length
      const topH = 200
      const otherH = 150
      const gap = 16
      const neededH = topH + (totalCandidates - 1) * (otherH + gap) + gap

      // Si no cabe todo, ajustar (caso raro pero por seguridad)
      const scaleFactor = neededH > availableH ? availableH / neededH : 1
      const adjustedTopH = Math.floor(topH * scaleFactor)
      const adjustedOtherH = Math.floor(otherH * scaleFactor)
      const adjustedGap = Math.floor(gap * scaleFactor)

      // Si no necesitamos escalar, usar tamaños originales
      const useTop = scaleFactor < 1 ? adjustedTopH : topH
      const useOther = scaleFactor < 1 ? adjustedOtherH : otherH
      const useGap = scaleFactor < 1 ? adjustedGap : gap

      for (let i = 0; i < allCandidates.length; i++) {
        const item = allCandidates[i]
        if (!item.candidate) continue
        const isFirst = i === 0
        const h = isFirst ? useTop : useOther
        await drawScaledCard(
          curY,
          h,
          i + 1,
          item.candidate.name,
          item.candidate.party,
          item.candidate.color,
          item.candidate.photo,
          item.score,
          isFirst,
          false,
        )
        curY += h + useGap
      }

      // ============ FOOTER ============
      ctx.textAlign = "center"
      ctx.fillStyle = "#666"
      ctx.font = `26px ${font}`
      ctx.fillText("Descubre tu afinidad programática", W / 2, H - 140)

      ctx.fillStyle = "#FFDE3A"
      ctx.font = `bold 36px ${font}`
      ctx.fillText(host, W / 2, H - 90)

      return new Promise((resolve) => canvas.toBlob(resolve, "image/png"))
    } catch (err) {
      console.error("Error generando imagen:", err)
      return null
    }
  }, [allCandidates, isMatch, initialNotInTop3, initialCandidate, initialResult, initialRank])

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

  const handleDownloadImage = useCallback(async () => {
    const blob = await generateShareImage()
    if (!blob) { toast.error("No se pudo generar la imagen"); return }
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "votai-resultado.png"; a.click()
    URL.revokeObjectURL(url)
    toast.success("Imagen descargada")
  }, [generateShareImage])

  const handleInstagramStory = useCallback(async () => {
    const blob = await generateShareImage()
    if (!blob) { toast.error("No se pudo generar la imagen"); return }

    const host = typeof window !== "undefined" ? window.location.host : ""
    const file = new File([blob], "votoloco-historia.png", { type: "image/png" })

    // Intentar Web Share API (abre menú nativo donde aparece Instagram en móvil)
    if (navigator.share) {
      try {
        const canShareFiles = navigator.canShare?.({ files: [file] })
        await navigator.share({
          title: "Mi afinidad programática — VotoLoco",
          text: `Hice el test en ${host} — descubre el tuyo`,
          ...(canShareFiles ? { files: [file] } : {}),
        })
        return
      } catch (err) {
        const errorName = (err as Error)?.name
        // Si el usuario canceló, no hacer nada
        if (errorName === "AbortError") return
        // Si no se pudo compartir por otra razón, caer al fallback
      }
    }

    // Fallback: descargar la imagen
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "votoloco-historia.png"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Imagen descargada — súbela a tu historia desde Instagram", { duration: 5000 })
  }, [generateShareImage])

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
                <p className="mb-2 text-center text-xs text-text-subtle">Candidato que escogiste antes de hacer el test</p>
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

            <p className="mb-4 text-sm text-text-muted">Candidatos con los que tienes afinidad asociado a su plan de gobierno</p>

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
                Compartir
              </Button>
              <Button variant="outline" size="sm" onClick={handleInstagramStory} className="gap-2 text-xs">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Historia IG
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
