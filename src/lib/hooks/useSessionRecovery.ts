"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSessionStore } from "@/lib/store/sessionStore"
import { api } from "@/lib/api"

type RecoveryState = "idle" | "checking" | "redirected" | "available"

/**
 * Verifica si hay una sesión persistida en localStorage y la "rescata":
 * - status === 'done'        → redirige a /resultados/{sessionId}
 * - status === 'processing'  → redirige a /analyzing
 * - 404 / created / answering → no hace nada (continúa el flujo normal)
 *
 * Útil para que un usuario que cerró el navegador durante el procesamiento
 * pueda volver a su resultado sin tener que repetir el test.
 */
export function useSessionRecovery() {
  const router = useRouter()
  const sessionId = useSessionStore((s) => s.sessionId)
  const reset = useSessionStore((s) => s.reset)
  const [state, setState] = useState<RecoveryState>("idle")

  useEffect(() => {
    if (!sessionId) {
      setState("available")
      return
    }

    let cancelled = false
    setState("checking")

    api
      .getMatchResult(sessionId)
      .then((result) => {
        if (cancelled) return
        if (result.status === "done") {
          setState("redirected")
          router.replace(`/resultados/${sessionId}`)
        } else if (result.status === "processing") {
          setState("redirected")
          router.replace("/analyzing")
        } else {
          setState("available")
        }
      })
      .catch(() => {
        if (cancelled) return
        reset()
        setState("available")
      })

    return () => {
      cancelled = true
    }
  }, [sessionId, router, reset])

  return state
}
