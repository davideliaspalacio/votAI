"use client"

import { useState, useCallback } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Share2, Check, Link2, User, Download } from "lucide-react"
import { toast } from "sonner"
import { mockCandidates } from "@/lib/mock/candidates"
import type { CandidateResult } from "@/types/domain"

interface ShareButtonProps {
  candidateName: string
  score: number
  sessionId: string
  topResults?: CandidateResult[]
  initialPreference?: string
}

function getAffinityMessage(score: number): string {
  if (score >= 80) return "Muy alta afinidad programatica"
  if (score >= 60) return "Alta afinidad programatica"
  if (score >= 40) return "Afinidad programatica moderada"
  return "Baja afinidad programatica"
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export function ShareButton({
  candidateName,
  score,
  sessionId,
  topResults,
  initialPreference,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const prefersReduced = useReducedMotion()

  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const host = typeof window !== "undefined" ? window.location.host : ""
  const shareUrl = `${origin}/resultados/${sessionId}`

  const shareText = `Hice el test de afinidad en ${host} \u2014 mi mayor afinidad es con ${candidateName} (${score}%)`

  const affinityMessage = getAffinityMessage(score)

  const top3 = topResults
    ? topResults.slice(0, 3).map((r) => {
        const c = mockCandidates.find((mc) => mc.id === r.candidateId)
        return { ...r, candidate: c }
      })
    : null

  const allRanked = topResults
    ? topResults.map((r) => ({
        ...r,
        candidate: mockCandidates.find((mc) => mc.id === r.candidateId),
      }))
    : []

  const specialPref = ["undecided", "blank", "na"].includes(initialPreference ?? "")
  const initialCand = !specialPref ? mockCandidates.find((c) => c.id === initialPreference) : null
  const initialInRanking = initialCand && allRanked.find((t) => t.candidateId === initialCand.id)
  const showInitial = !!initialCand && !!initialInRanking

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    if (!allRanked || allRanked.length === 0) return null
    try {
      const W = 540
      const rowCount = allRanked.length
      const H = (showInitial ? 280 : 165) + rowCount * 90 + 80
      const scale = 2
      const pad = 32
      const canvas = document.createElement("canvas")
      canvas.width = W * scale
      canvas.height = H * scale
      const ctx = canvas.getContext("2d")
      if (!ctx) return null
      ctx.scale(scale, scale)

      // Fondo con gradiente
      const bg = ctx.createLinearGradient(0, 0, W, H)
      bg.addColorStop(0, "#0c0c18")
      bg.addColorStop(1, "#161630")
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Barra decorativa superior
      const accent = ctx.createLinearGradient(0, 0, W, 0)
      accent.addColorStop(0, "#7c3aed")
      accent.addColorStop(0.5, "#f59e0b")
      accent.addColorStop(1, "#7c3aed")
      ctx.fillStyle = accent
      ctx.fillRect(0, 0, W, 5)

      // Branding
      ctx.fillStyle = "#666666"
      ctx.font = "bold 13px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(host.toUpperCase(), W / 2, 48)

      // Titulo
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 22px system-ui, -apple-system, sans-serif"
      ctx.fillText("Mi afinidad programatica", W / 2, 88)

      // Mensaje de afinidad
      ctx.fillStyle = "#aaaaaa"
      ctx.font = "16px system-ui, -apple-system, sans-serif"
      ctx.fillText(affinityMessage, W / 2, 118)

      // Linea separadora
      ctx.strokeStyle = "#2a2a40"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(pad + 20, 140)
      ctx.lineTo(W - pad - 20, 140)
      ctx.stroke()

      const rowH = 75
      const rowGap = 10
      const rowPad = 16
      let curY = 165
      const cardX = pad
      const cardW = W - pad * 2

      // Candidato elegido primero (si no está en ranking #1)
      if (showInitial && initialCand && initialInRanking) {
        ctx.fillStyle = "#999999"
        ctx.font = "13px system-ui, -apple-system, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Candidato que escogiste antes de hacer el test", W / 2, curY - 5)
        curY += 8

        ctx.beginPath(); ctx.roundRect(cardX, curY, cardW, 70, 14)
        ctx.fillStyle = "#1a1a30"; ctx.fill()
        ctx.strokeStyle = initialCand.color + "50"; ctx.lineWidth = 2
        ctx.setLineDash([8, 5]); ctx.stroke(); ctx.setLineDash([])

        const cy = curY + 35
        ctx.beginPath(); ctx.arc(cardX + rowPad + 20, cy, 16, 0, Math.PI * 2)
        ctx.fillStyle = initialCand.color + "25"; ctx.fill()
        ctx.beginPath(); ctx.arc(cardX + rowPad + 20, cy, 6, 0, Math.PI * 2)
        ctx.fillStyle = initialCand.color; ctx.fill()

        ctx.textAlign = "left"; ctx.fillStyle = "#ffffff"
        ctx.font = "500 15px system-ui, -apple-system, sans-serif"
        ctx.fillText(initialCand.name, cardX + rowPad + 46, cy - 4)
        ctx.fillStyle = "#777777"; ctx.font = "11px system-ui, -apple-system, sans-serif"
        ctx.fillText(initialCand.party, cardX + rowPad + 46, cy + 12)

        ctx.textAlign = "right"; ctx.fillStyle = "#999999"
        ctx.font = "bold 18px system-ui, -apple-system, sans-serif"
        ctx.fillText(`${initialInRanking.score}%`, cardX + cardW - rowPad, cy + 6)

        curY += 85
        ctx.strokeStyle = "#2a2a40"; ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(pad + 20, curY); ctx.lineTo(W - pad - 20, curY); ctx.stroke()
        curY += 15
      }

      // Titulo ranking
      ctx.fillStyle = "#999999"; ctx.font = "13px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Candidatos con los que tienes afinidad asociado a su plan de gobierno", W / 2, curY)
      curY += 15

      // TODOS los candidatos
      allRanked.forEach((item, i) => {
        if (!item.candidate) return
        const isFirst = i === 0

        if (isFirst) {
          ctx.fillStyle = item.candidate.color + "18"
          ctx.strokeStyle = item.candidate.color + "50"
          ctx.lineWidth = 2
        } else {
          ctx.fillStyle = "#1a1a30"
          ctx.strokeStyle = "#2a2a45"
          ctx.lineWidth = 1
        }
        drawRoundedRect(ctx, cardX, curY, cardW, rowH, 14)
        ctx.fill()
        ctx.stroke()

        const centerY = curY + rowH / 2

        // Badge numero
        const badgeX = cardX + rowPad
        ctx.beginPath(); ctx.arc(badgeX + 14, centerY, 14, 0, Math.PI * 2)
        ctx.fillStyle = isFirst ? "#7c3aed" : "#2a2a45"; ctx.fill()
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 13px system-ui, -apple-system, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(String(i + 1), badgeX + 14, centerY + 5)

        // Circulo color
        const avatarX = badgeX + 42
        ctx.beginPath(); ctx.arc(avatarX, centerY, 16, 0, Math.PI * 2)
        ctx.fillStyle = item.candidate.color + "25"; ctx.fill()
        ctx.beginPath(); ctx.arc(avatarX, centerY, 6, 0, Math.PI * 2)
        ctx.fillStyle = item.candidate.color; ctx.fill()

        // Nombre y partido
        const textX = avatarX + 26
        ctx.textAlign = "left"; ctx.fillStyle = "#ffffff"
        ctx.font = isFirst ? "bold 15px system-ui, -apple-system, sans-serif" : "500 14px system-ui, -apple-system, sans-serif"
        ctx.fillText(item.candidate.name, textX, centerY - 6)
        ctx.fillStyle = "#777777"; ctx.font = "11px system-ui, -apple-system, sans-serif"
        let party = item.candidate.party
        const maxPW = cardW - (textX - cardX) - 60
        while (ctx.measureText(party).width > maxPW && party.length > 5) party = party.slice(0, -4) + "..."
        ctx.fillText(party, textX, centerY + 12)

        // Score
        ctx.textAlign = "right"
        ctx.fillStyle = isFirst ? "#7c3aed" : "#bbbbbb"
        ctx.font = isFirst ? "bold 22px system-ui, -apple-system, sans-serif" : "bold 18px system-ui, -apple-system, sans-serif"
        ctx.fillText(`${item.score}%`, cardX + cardW - rowPad, centerY + 6)

        curY += rowH + rowGap
      })

      // CTA
      curY += 5
      ctx.textAlign = "center"; ctx.fillStyle = "#555555"
      ctx.font = "13px system-ui, -apple-system, sans-serif"
      ctx.fillText("Descubre tu afinidad programática", W / 2, curY)
      ctx.fillStyle = "#7c3aed"; ctx.font = "bold 14px system-ui, -apple-system, sans-serif"
      ctx.fillText(host, W / 2, curY + 22)

      ctx.fillStyle = "#444444"; ctx.font = "11px system-ui, -apple-system, sans-serif"
      ctx.fillText("David E. Palacio · Desarrollador & IA  |  Ricardo Palacio · Estratega de Producto", W / 2, H - 18)

      return new Promise((resolve) => canvas.toBlob(resolve, "image/png"))
    } catch (err) {
      console.error("Error generando imagen:", err)
      return null
    }
  }, [allRanked, affinityMessage, showInitial, initialCand, initialInRanking])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = await generateImage()
        const files = blob
          ? [new File([blob], "votai-resultado.png", { type: "image/png" })]
          : undefined

        const canShareFiles = files && navigator.canShare?.({ files })

        await navigator.share({
          title: "Mi afinidad programatica \u2014 VotAI",
          text: shareText,
          url: shareUrl,
          ...(canShareFiles ? { files } : {}),
        })
      } catch {
        // User cancelled share
      }
    } else {
      await copyToClipboard()
    }
  }

  const handleDownloadImage = async () => {
    const blob = await generateImage()
    if (!blob) {
      toast.error("No se pudo generar la imagen")
      return
    }
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "votai-resultado.png"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Imagen descargada")
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      setCopied(true)
      toast.success("Enlace copiado al portapapeles")
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error("No se pudo copiar el enlace")
    }
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${shareText}\n${shareUrl}`)
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer")
  }

  const handleTwitter = () => {
    const text = encodeURIComponent(shareText)
    const url = encodeURIComponent(shareUrl)
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  return (
    <motion.section
      initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="relative overflow-hidden border-2 border-surface-border bg-gradient-to-br from-surface via-surface to-primary/5">
        {/* Decorative accent bar */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

        <CardHeader className="pb-2 pt-6">
          <div className="flex items-center justify-center gap-2">
            <div className="rounded-full bg-primary/10 p-1.5">
              <Share2 className="size-4 text-primary" />
            </div>
            <CardTitle className="font-display text-lg font-bold text-text">
              Compartir mis resultados
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pb-6">
          {/* Preview Card */}
          <div className="rounded-brutal border-2 border-surface-border bg-background p-3 sm:p-5">
            <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-text-subtle sm:text-xs sm:mb-3">
              VotAI
            </p>

            <p className="mb-3 text-center font-display text-xs font-medium text-text-muted sm:text-sm sm:mb-4">
              {affinityMessage}
            </p>

            {/* Top 3 mini ranking */}
            {top3 && top3.length > 0 && (
              <div className="space-y-2">
                {top3.map((item, i) => {
                  if (!item.candidate) return null
                  const isFirst = i === 0
                  return (
                    <div
                      key={item.candidateId}
                      className={`flex items-center gap-2 rounded-lg px-2 py-2 sm:gap-3 sm:px-3 sm:py-2.5 ${
                        isFirst
                          ? "border-2 bg-primary/5"
                          : "border border-surface-border bg-surface/50"
                      }`}
                      style={
                        isFirst
                          ? { borderColor: item.candidate.color + "60" }
                          : undefined
                      }
                    >
                      {/* Position badge */}
                      <span
                        className={`flex size-6 shrink-0 items-center justify-center rounded-full font-display text-[10px] font-bold sm:size-7 sm:text-xs ${
                          isFirst
                            ? "bg-primary text-primary-foreground"
                            : "bg-surface-border text-text-subtle"
                        }`}
                      >
                        {i + 1}
                      </span>

                      {/* Candidate avatar */}
                      <div
                        className="hidden size-8 shrink-0 items-center justify-center rounded-full sm:flex"
                        style={{
                          backgroundColor: item.candidate.color + "20",
                        }}
                      >
                        {item.candidate.photo ? (
                          <img src={item.candidate.photo} alt={item.candidate.name} className="size-full rounded-full object-cover" />
                        ) : (
                          <User
                            className="size-4"
                            style={{ color: item.candidate.color }}
                          />
                        )}
                      </div>

                      {/* Name & party */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`font-display text-xs leading-tight sm:text-sm ${
                            isFirst
                              ? "font-bold text-text"
                              : "font-medium text-text"
                          }`}
                        >
                          {item.candidate.name}
                        </p>
                        <p className="text-[10px] leading-tight text-text-subtle sm:text-xs">
                          {item.candidate.party}
                        </p>
                      </div>

                      {/* Score */}
                      <span
                        className={`shrink-0 font-display font-bold ${
                          isFirst
                            ? "text-base text-primary sm:text-lg"
                            : "text-xs text-text-muted sm:text-sm"
                        }`}
                      >
                        {item.score}%
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            <p className="mt-3 text-center text-[10px] text-text-subtle sm:text-xs sm:mt-4">
              Descubre tu afinidad programatica en VotAI
            </p>
          </div>

          {/* Share buttons */}
          <div className="flex flex-col gap-2.5">
            {/* Primary share + download row */}
            <div className="flex gap-2">
              <Button
                variant="brutal"
                size="lg"
                onClick={handleShare}
                className="flex-1 gap-2"
              >
                {copied ? (
                  <>
                    <Check className="size-4" />
                    <span className="text-sm">Copiado</span>
                  </>
                ) : (
                  <>
                    <Share2 className="size-4" />
                    <span className="text-sm">Compartir</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleDownloadImage}
                className="gap-2"
              >
                <Download className="size-4" />
                <span className="hidden sm:inline text-sm">Imagen</span>
              </Button>
            </div>

            {/* Social row */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={handleWhatsApp}
                className="gap-1.5 text-xs hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30 sm:gap-2 sm:text-sm"
              >
                <WhatsAppIcon className="size-3.5 sm:size-4" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={handleTwitter}
                className="gap-1.5 text-xs hover:bg-foreground/5 sm:gap-2 sm:text-sm"
              >
                <XIcon className="size-3.5 sm:size-4" />
                X
              </Button>
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="gap-1.5 text-xs sm:gap-2 sm:text-sm"
              >
                {copied ? (
                  <Check className="size-3.5 text-success sm:size-4" />
                ) : (
                  <Link2 className="size-3.5 sm:size-4" />
                )}
                Copiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}
