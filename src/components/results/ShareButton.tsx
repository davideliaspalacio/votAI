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
}

function getAffinityMessage(score: number): string {
  if (score >= 80) return "Muy alta afinidad programatica"
  if (score >= 60) return "Alta afinidad programatica"
  if (score >= 40) return "Afinidad programatica moderada"
  return "Baja afinidad programatica"
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function ShareButton({
  candidateName,
  score,
  sessionId,
  topResults,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const prefersReduced = useReducedMotion()

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/resultados/${sessionId}`
    : `https://votoloco.com/resultados/${sessionId}`

  const shareText = `Hice el test de afinidad en VotoLoco.com \u2014 mi mayor afinidad es con ${candidateName} (${score}%)`

  const affinityMessage = getAffinityMessage(score)

  const top3 = topResults
    ? topResults.slice(0, 3).map((r) => {
        const c = mockCandidates.find((mc) => mc.id === r.candidateId)
        return { ...r, candidate: c }
      })
    : null

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    if (!top3 || top3.length === 0) return null
    try {
      const W = 600
      const H = 480
      const canvas = document.createElement("canvas")
      canvas.width = W * 2
      canvas.height = H * 2
      const ctx = canvas.getContext("2d")
      if (!ctx) return null
      ctx.scale(2, 2)

      // Fondo
      const bg = ctx.createLinearGradient(0, 0, W, H)
      bg.addColorStop(0, "#0f0f14")
      bg.addColorStop(1, "#1a1a2e")
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Barra decorativa superior
      const accent = ctx.createLinearGradient(0, 0, W, 0)
      accent.addColorStop(0, "#7c3aed")
      accent.addColorStop(0.5, "#f59e0b")
      accent.addColorStop(1, "#7c3aed")
      ctx.fillStyle = accent
      ctx.fillRect(0, 0, W, 4)

      // Branding
      ctx.fillStyle = "#888888"
      ctx.font = "bold 11px system-ui, sans-serif"
      ctx.textAlign = "center"
      ctx.letterSpacing = "3px"
      ctx.fillText("VOTOLOCO.COM", W / 2, 40)

      // Mensaje de afinidad
      ctx.fillStyle = "#cccccc"
      ctx.font = "500 14px system-ui, sans-serif"
      ctx.letterSpacing = "0px"
      ctx.fillText(affinityMessage, W / 2, 68)

      // Linea separadora
      ctx.strokeStyle = "#333333"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(60, 85)
      ctx.lineTo(W - 60, 85)
      ctx.stroke()

      // Top 3 candidatos
      ctx.textAlign = "left"
      const startY = 110
      const rowH = 100

      top3.forEach((item, i) => {
        if (!item.candidate) return
        const y = startY + i * rowH
        const isFirst = i === 0

        // Fondo de la fila
        if (isFirst) {
          ctx.fillStyle = item.candidate.color + "15"
          ctx.strokeStyle = item.candidate.color + "60"
          ctx.lineWidth = 2
          const rx = 40, ry = y, rw = W - 80, rh = 80, r = 12
          ctx.beginPath()
          ctx.moveTo(rx + r, ry); ctx.lineTo(rx + rw - r, ry)
          ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + r)
          ctx.lineTo(rx + rw, ry + rh - r)
          ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - r, ry + rh)
          ctx.lineTo(rx + r, ry + rh)
          ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - r)
          ctx.lineTo(rx, ry + r)
          ctx.quadraticCurveTo(rx, ry, rx + r, ry)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
        } else {
          ctx.fillStyle = "#1a1a2e"
          ctx.strokeStyle = "#333333"
          ctx.lineWidth = 1
          const rx = 40, ry = y, rw = W - 80, rh = 80, r = 12
          ctx.beginPath()
          ctx.moveTo(rx + r, ry); ctx.lineTo(rx + rw - r, ry)
          ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + r)
          ctx.lineTo(rx + rw, ry + rh - r)
          ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - r, ry + rh)
          ctx.lineTo(rx + r, ry + rh)
          ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - r)
          ctx.lineTo(rx, ry + r)
          ctx.quadraticCurveTo(rx, ry, rx + r, ry)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
        }

        // Numero de posicion
        const badgeX = 60, badgeY = y + 28
        ctx.beginPath()
        ctx.arc(badgeX + 14, badgeY + 14, 14, 0, Math.PI * 2)
        ctx.fillStyle = isFirst ? "#7c3aed" : "#333333"
        ctx.fill()
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 13px system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(String(i + 1), badgeX + 14, badgeY + 18)

        // Circulo de color del candidato
        ctx.beginPath()
        ctx.arc(badgeX + 48, badgeY + 14, 16, 0, Math.PI * 2)
        ctx.fillStyle = item.candidate.color + "30"
        ctx.fill()
        ctx.beginPath()
        ctx.arc(badgeX + 48, badgeY + 14, 6, 0, Math.PI * 2)
        ctx.fillStyle = item.candidate.color
        ctx.fill()

        // Nombre
        ctx.textAlign = "left"
        ctx.fillStyle = "#ffffff"
        ctx.font = isFirst ? "bold 16px system-ui, sans-serif" : "500 15px system-ui, sans-serif"
        ctx.fillText(item.candidate.name, badgeX + 76, badgeY + 10)

        // Partido
        ctx.fillStyle = "#888888"
        ctx.font = "12px system-ui, sans-serif"
        const party = item.candidate.party.length > 35
          ? item.candidate.party.substring(0, 35) + "..."
          : item.candidate.party
        ctx.fillText(party, badgeX + 76, badgeY + 28)

        // Score
        ctx.textAlign = "right"
        ctx.fillStyle = isFirst ? "#7c3aed" : "#cccccc"
        ctx.font = isFirst ? "bold 24px system-ui, sans-serif" : "bold 18px system-ui, sans-serif"
        ctx.fillText(`${item.score}%`, W - 60, badgeY + 18)
        ctx.textAlign = "left"
      })

      // CTA
      ctx.textAlign = "center"
      ctx.fillStyle = "#666666"
      ctx.font = "12px system-ui, sans-serif"
      ctx.fillText("Descubre tu afinidad programática en votoloco.com", W / 2, H - 30)

      return new Promise((resolve) => canvas.toBlob(resolve, "image/png"))
    } catch (err) {
      console.error("Error generando imagen:", err)
      return null
    }
  }, [top3, affinityMessage])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = await generateImage()
        const files = blob
          ? [new File([blob], "votoloco-resultado.png", { type: "image/png" })]
          : undefined

        const canShareFiles = files && navigator.canShare?.({ files })

        await navigator.share({
          title: "Mi afinidad programatica \u2014 VotoLoco",
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
    a.download = "votoloco-resultado.png"
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
      {/* Share Preview Card */}
      <Card
        className="relative overflow-hidden border-2 border-surface-border bg-gradient-to-br from-surface via-surface to-primary/5"
      >
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

        <CardContent className="space-y-5 pb-6">
          {/* Preview Card (what the share "looks like") */}
          <div className="rounded-brutal border-2 border-surface-border bg-background p-5">
            {/* VotoLoco branding */}
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-text-subtle">
              VotoLoco.com
            </p>

            {/* Affinity message */}
            <p className="mb-4 text-center font-display text-sm font-medium text-text-muted">
              {affinityMessage}
            </p>

            {/* Top 3 mini ranking */}
            {top3 && top3.length > 0 && (
              <div className="space-y-2.5">
                {top3.map((item, i) => {
                  if (!item.candidate) return null
                  const isFirst = i === 0
                  return (
                    <div
                      key={item.candidateId}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
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
                        className={`flex size-7 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold ${
                          isFirst
                            ? "bg-primary text-primary-foreground"
                            : "bg-surface-border text-text-subtle"
                        }`}
                      >
                        {i + 1}
                      </span>

                      {/* Candidate avatar */}
                      <div
                        className="flex size-8 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: item.candidate.color + "20",
                        }}
                      >
                        <User
                          className="size-4"
                          style={{ color: item.candidate.color }}
                        />
                      </div>

                      {/* Name & party */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate font-display text-sm ${
                            isFirst
                              ? "font-bold text-text"
                              : "font-medium text-text"
                          }`}
                        >
                          {item.candidate.name}
                        </p>
                        <p className="truncate text-xs text-text-subtle">
                          {item.candidate.party}
                        </p>
                      </div>

                      {/* Score */}
                      <div className="shrink-0 text-right">
                        <span
                          className={`font-display font-bold ${
                            isFirst
                              ? "text-lg text-primary"
                              : "text-sm text-text-muted"
                          }`}
                        >
                          {item.score}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Call to action */}
            <p className="mt-4 text-center text-xs text-text-subtle">
              Descubre tu afinidad programatica en VotoLoco.com
            </p>
          </div>

          {/* Share buttons */}
          <div className="flex flex-col gap-3">
            {/* Primary share button */}
            <Button
              variant="brutal"
              size="lg"
              onClick={handleShare}
              className="w-full gap-2"
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  Enlace copiado
                </>
              ) : (
                <>
                  <Share2 className="size-4" />
                  Compartir mis resultados
                </>
              )}
            </Button>

            {/* Download image */}
            <Button
              variant="outline"
              size="lg"
              onClick={handleDownloadImage}
              className="w-full gap-2"
            >
              <Download className="size-4" />
              Descargar imagen
            </Button>

            {/* Social share row */}
            <div className="flex gap-2">
              {/* WhatsApp */}
              <Button
                variant="outline"
                size="lg"
                onClick={handleWhatsApp}
                className="flex-1 gap-2 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30"
              >
                <WhatsAppIcon className="size-4" />
                WhatsApp
              </Button>

              {/* Twitter/X */}
              <Button
                variant="outline"
                size="lg"
                onClick={handleTwitter}
                className="flex-1 gap-2 hover:bg-foreground/5"
              >
                <XIcon className="size-4" />
                Publicar en X
              </Button>

              {/* Copy link */}
              <Button
                variant="outline"
                size="icon-lg"
                onClick={copyToClipboard}
                title="Copiar enlace"
                className="shrink-0"
              >
                {copied ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Link2 className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}
