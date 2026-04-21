"use client"

import { cn } from "@/lib/utils"
import { Info } from "lucide-react"

interface DisclaimerProps {
  variant?: "compact" | "full"
  className?: string
}

export function Disclaimer({ variant = "compact", className }: DisclaimerProps) {
  if (variant === "compact") {
    return (
      <div
        role="note"
        className={cn(
          "flex items-start gap-2 rounded-brutal border border-surface-border bg-surface px-4 py-3 text-sm text-text-muted",
          className
        )}
      >
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          VotoLoco <strong className="text-text">NO</strong> es una encuesta electoral.
          Mide afinidad entre tus respuestas y las propuestas oficiales publicadas
          por cada candidato. No predice resultados electorales.
        </p>
      </div>
    )
  }

  return (
    <div
      role="note"
      className={cn(
        "space-y-3 rounded-brutal border border-surface-border bg-surface px-6 py-5 text-sm text-text-muted",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Info className="size-5 text-primary" />
        <h3 className="font-display text-base font-semibold text-text">
          Aviso importante
        </h3>
      </div>
      <p>
        VotoLoco <strong className="text-text">NO</strong> es una encuesta
        electoral. Esta herramienta mide la afinidad programática entre tus
        respuestas y las propuestas oficiales publicadas por cada candidato.
      </p>
      <p>
        No predice resultados electorales, no constituye una recomendación de
        voto y no está registrada ante el CNE como encuesta porque no lo es.
      </p>
      <p>
        Tu voto es libre, secreto y personal. Tus datos son anónimos y se
        tratan conforme a la Ley 1581 de 2012 (Habeas Data).
      </p>
      <p>
        <a
          href="/metodologia"
          className="text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Conoce nuestra metodología →
        </a>
      </p>
    </div>
  )
}
