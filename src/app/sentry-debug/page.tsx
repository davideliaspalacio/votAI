"use client"

import { useState } from "react"

export default function SentryDebugPage() {
  const [serverTriggered, setServerTriggered] = useState(false)

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 p-6">
      <h1 className="font-display text-2xl font-bold">Sentry debug</h1>
      <p className="max-w-md text-center text-sm text-text-muted">
        Página interna para verificar que Sentry esté capturando errores.
        Cada botón dispara un error distinto y único.
      </p>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 font-bold text-primary-foreground"
          onClick={() => {
            throw new Error(`Sentry client error ${Date.now()}`)
          }}
        >
          Disparar error en cliente (browser)
        </button>

        <button
          type="button"
          className="rounded-lg bg-accent px-4 py-2 font-bold text-accent-foreground"
          onClick={async () => {
            setServerTriggered(true)
            try {
              await fetch(`/api/sentry-debug?ts=${Date.now()}`)
            } catch (err) {
              console.error(err)
            }
          }}
        >
          Disparar error en servidor (API route)
        </button>

        {serverTriggered && (
          <p className="text-xs text-text-subtle">
            Servidor disparado. Revisa Sentry en ~30s.
          </p>
        )}
      </div>
    </main>
  )
}
