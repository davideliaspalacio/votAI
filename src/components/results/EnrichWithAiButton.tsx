"use client"

import { useState, useRef } from "react"
import { Sparkles, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

interface EnrichWithAiButtonProps {
  sessionId: string
  onEnriched: () => Promise<void> | void
}

type State = "idle" | "loading" | "error"

export function EnrichWithAiButton({
  sessionId,
  onEnriched,
}: EnrichWithAiButtonProps) {
  const [state, setState] = useState<State>("idle")
  const inFlight = useRef(false)

  const handleClick = async () => {
    if (inFlight.current || state === "loading") return
    inFlight.current = true
    setState("loading")
    try {
      const res = await api.enrichMatchWithAi(sessionId)
      if (!res.enriched) {
        setState("error")
        return
      }
      await onEnriched()
    } catch {
      setState("error")
    } finally {
      inFlight.current = false
    }
  }

  if (state === "loading") {
    return (
      <div className="rounded-brutal border-2 border-primary/40 bg-primary/5 p-6 text-center">
        <Loader2 className="mx-auto size-8 animate-spin text-primary" />
        <p className="mt-3 font-display text-base font-bold text-text">
          Generando tu análisis personalizado...
        </p>
        <p className="mt-1 text-sm text-text-muted">
          Esto puede tardar hasta 15 segundos.
        </p>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="rounded-brutal border-2 border-accent/40 bg-accent/5 p-6 text-center">
        <p className="font-display text-base font-bold text-text">
          No pudimos generar el análisis
        </p>
        <p className="mt-1 text-sm text-text-muted">
          Intenta de nuevo en unos segundos.
        </p>
        <Button
          variant="brutal"
          onClick={() => {
            setState("idle")
          }}
          className="mt-4 gap-2"
        >
          <RefreshCw className="size-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-brutal border-2 border-primary/40 bg-primary/5 p-6 text-center">
      <div className="flex justify-center">
        <Sparkles className="size-8 text-primary" />
      </div>
      <h3 className="mt-3 font-display text-lg font-bold text-text">
        Genera tu análisis personalizado con IA
      </h3>
      <p className="mt-2 text-sm text-text-muted">
        Te explicaremos en detalle por qué coincides con cada candidato y tu
        postura en cada tema.
      </p>
      <Button
        variant="brutal"
        onClick={handleClick}
        className="mt-5 gap-2"
      >
        <Sparkles className="size-4" />
        Generar análisis con IA
      </Button>
    </div>
  )
}
