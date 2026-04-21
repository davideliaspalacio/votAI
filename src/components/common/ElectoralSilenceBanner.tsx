"use client"

import { useState, useEffect } from "react"
import { AlertTriangle } from "lucide-react"

export function ElectoralSilenceBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(process.env.NEXT_PUBLIC_ELECTORAL_SILENCE === "true")
  }, [])

  if (!show) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
    >
      <AlertTriangle className="size-4" />
      <span>
        Período de silencio electoral. Algunas funciones están temporalmente
        deshabilitadas. Vuelve después de las elecciones.
      </span>
    </div>
  )
}
