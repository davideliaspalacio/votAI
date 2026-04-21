"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="text-center">
        <p className="font-display text-6xl font-bold text-accent">Oops</p>
        <h1 className="mt-4 font-display text-display-sm font-bold text-text">
          Algo salió mal
        </h1>
        <p className="mt-2 text-text-muted">
          Ocurrió un error inesperado. Intenta de nuevo.
        </p>
        <Button
          variant="brutal"
          onClick={reset}
          className="mt-8 gap-2"
        >
          <RefreshCw className="size-4" />
          Reintentar
        </Button>
      </div>
    </div>
  )
}
