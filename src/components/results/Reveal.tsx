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

  // Generar imagen story con fotos de candidatos
  const generateShareImage = useCallback(async (): Promise<Blob | null> => {
    try {
      const W = 540, scale = 2, pad = 32
      const rowH = 90, rowGap = 12
      const hasInit = initialNotInTop3 && initialCandidate && initialResult
      const visibleCandidates = allCandidates.filter(
        (item) => !(hasInit && item.candidateId === initialCandidate?.id)
      )
      const totalRows = visibleCandidates.length + (hasInit ? 1 : 0)
      const H = 220 + totalRows * (rowH + rowGap) + (hasInit ? 50 : 0) + 100

      const canvas = document.createElement("canvas")
      canvas.width = W * scale; canvas.height = H * scale
      const ctx = canvas.getContext("2d")
      if (!ctx) return null
      ctx.scale(scale, scale)

      const font = "system-ui, -apple-system, sans-serif"

      // Fondo
      const bg = ctx.createLinearGradient(0, 0, W, H)
      bg.addColorStop(0, "#0c0c18"); bg.addColorStop(1, "#161630")
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

      // Barra decorativa
      const acc = ctx.createLinearGradient(0, 0, W, 0)
      acc.addColorStop(0, "#7c3aed"); acc.addColorStop(0.5, "#f59e0b"); acc.addColorStop(1, "#7c3aed")
      ctx.fillStyle = acc; ctx.fillRect(0, 0, W, 5)

      // Branding
      const host = typeof window !== "undefined" ? window.location.host : ""
      ctx.fillStyle = "#7c3aed"; ctx.font = `bold 28px ${font}`; ctx.textAlign = "center"
      ctx.fillText("VotAI", W / 2, 45)
      ctx.fillStyle = "#666"; ctx.font = `bold 13px ${font}`
      ctx.fillText(host.toUpperCase(), W / 2, 68)

      // Badge match/gap
      const badgeText = isMatch ? "✓ Preferencia y afinidad coinciden" : "⚡ Preferencia y afinidad NO coinciden"
      const badgeColor = isMatch ? "#22c55e" : "#f59e0b"
      ctx.fillStyle = badgeColor; ctx.font = `bold 14px ${font}`
      ctx.fillText(badgeText, W / 2, 100)

      // Separador
      ctx.strokeStyle = "#2a2a40"; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(pad + 20, 115); ctx.lineTo(W - pad - 20, 115); ctx.stroke()

      let curY = 130
      const cardX = pad, cardW = W - pad * 2

      // Helper para dibujar una fila con foto
      const drawCandRow = async (
        y: number, rank: number, name: string, party: string,
        color: string, photo: string | undefined, scoreVal: number,
        isFirst: boolean, isDashed: boolean
      ) => {
        // Fondo tarjeta con rounded rect
        ctx.beginPath(); ctx.roundRect(cardX, y, cardW, rowH, 14)
        ctx.fillStyle = isFirst ? color + "18" : "#1a1a30"; ctx.fill()
        ctx.strokeStyle = isFirst ? color + "50" : isDashed ? color + "50" : "#2a2a45"
        ctx.lineWidth = isFirst ? 2 : 1
        if (isDashed) ctx.setLineDash([8, 5])
        ctx.stroke(); ctx.setLineDash([])

        const cy = y + rowH / 2
        const rowPad = 16

        // Badge numero
        ctx.beginPath(); ctx.arc(cardX + rowPad + 14, cy, 14, 0, Math.PI * 2)
        ctx.fillStyle = isFirst ? "#7c3aed" : "#2a2a45"; ctx.fill()
        ctx.fillStyle = "#fff"; ctx.font = `bold 14px ${font}`; ctx.textAlign = "center"
        ctx.fillText(String(rank), cardX + rowPad + 14, cy + 5)

        // Foto del candidato
        const avatarX = cardX + rowPad + 42, avatarR = 18
        ctx.beginPath(); ctx.arc(avatarX, cy, avatarR, 0, Math.PI * 2)
        ctx.fillStyle = color + "25"; ctx.fill()

        if (photo) {
          try {
            const img = await loadImg(photo)
            ctx.save()
            ctx.beginPath(); ctx.arc(avatarX, cy, avatarR - 1, 0, Math.PI * 2); ctx.clip()
            ctx.drawImage(img, avatarX - avatarR + 1, cy - avatarR + 1, (avatarR - 1) * 2, (avatarR - 1) * 2)
            ctx.restore()
          } catch {
            ctx.beginPath(); ctx.arc(avatarX, cy, 7, 0, Math.PI * 2)
            ctx.fillStyle = color; ctx.fill()
          }
        } else {
          ctx.beginPath(); ctx.arc(avatarX, cy, 7, 0, Math.PI * 2)
          ctx.fillStyle = color; ctx.fill()
        }

        // Nombre
        const textX = avatarX + avatarR + 12
        ctx.textAlign = "left"; ctx.fillStyle = "#fff"
        ctx.font = isFirst ? `bold 16px ${font}` : `500 15px ${font}`
        ctx.fillText(name, textX, cy - 6)

        // Partido
        ctx.fillStyle = "#777"; ctx.font = `12px ${font}`
        let p = party
        const maxPW = cardW - (textX - cardX) - 60
        while (ctx.measureText(p).width > maxPW && p.length > 5) p = p.slice(0, -4) + "..."
        ctx.fillText(p, textX, cy + 12)

        // Score
        ctx.textAlign = "right"; ctx.fillStyle = isFirst ? "#7c3aed" : "#bbb"
        ctx.font = isFirst ? `bold 26px ${font}` : `bold 20px ${font}`
        ctx.fillText(`${scoreVal}%`, cardX + cardW - rowPad, cy + 7)
      }

      // Candidato elegido primero
      if (hasInit && initialCandidate && initialResult) {
        ctx.fillStyle = "#999"; ctx.font = `13px ${font}`; ctx.textAlign = "center"
        ctx.fillText("Tu candidato elegido", W / 2, curY + 4)
        curY += 16
        await drawCandRow(curY, initialRank, initialCandidate.name, initialCandidate.party, initialCandidate.color, initialCandidate.photo, initialResult.score, false, true)
        curY += rowH + rowGap + 8
        ctx.strokeStyle = "#2a2a40"; ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(pad + 20, curY); ctx.lineTo(W - pad - 20, curY); ctx.stroke()
        curY += 12
      }

      // Titulo
      ctx.fillStyle = "#999"; ctx.font = `13px ${font}`; ctx.textAlign = "center"
      ctx.fillText("Ranking de afinidad programática", W / 2, curY + 4)
      curY += 16

      // Todos los candidatos
      for (const item of visibleCandidates) {
        if (!item.candidate) continue
        const idx = allCandidates.indexOf(item)
        await drawCandRow(curY, idx + 1, item.candidate.name, item.candidate.party, item.candidate.color, item.candidate.photo, item.score, idx === 0, false)
        curY += rowH + rowGap
      }

      // CTA
      ctx.textAlign = "center"; ctx.fillStyle = "#555"; ctx.font = `13px ${font}`
      ctx.fillText("Descubre tu afinidad programática", W / 2, H - 55)
      ctx.fillStyle = "#7c3aed"; ctx.font = `bold 15px ${font}`
      ctx.fillText(host, W / 2, H - 35)
      ctx.fillStyle = "#444"; ctx.font = `10px ${font}`
      ctx.fillText("David E. Palacio · Ing. Software & IA  |  Ricardo Palacio · Estratega de Producto", W / 2, H - 15)

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

    // En móvil, usar Web Share API con la imagen (abre Instagram directo)
    if (navigator.share) {
      try {
        const file = new File([blob], "votai-resultado.png", { type: "image/png" })
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file] })
          return
        }
      } catch { /* cancelled */ }
    }

    // Fallback: descargar y mostrar instrucciones
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "votai-resultado.png"; a.click()
    URL.revokeObjectURL(url)
    toast.success("Imagen descargada. Ábrela en Instagram → Historia → Sticker de link para agregar el URL", { duration: 6000 })
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
