import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3 } from "lucide-react"
import { firstRoundStats } from "@/lib/mock/firstRoundStats"
import { BrechaPrimeraVuelta } from "./BrechaPrimeraVuelta"
import { LoQueDetectamos } from "./LoQueDetectamos"

const total = firstRoundStats.total_sessions.toLocaleString("es-CO")

export function FirstRoundStatsHome() {
  return (
    <div className="space-y-16 border-t border-surface-border py-16">
      {/* Intro */}
      <section className="mx-auto max-w-3xl px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-4 py-1.5 text-sm text-text-muted">
          <BarChart3 className="size-4 text-primary" />
          Primera vuelta · {total} tests
        </div>
        <h2 className="mt-4 font-display text-display-sm font-bold text-text">
          Lo que descubrimos con{" "}
          <span className="text-primary">{total}</span> colombianos
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-text-muted">
          Antes de la segunda vuelta, esto fue lo que el test reveló sobre cómo
          piensa el país de verdad.
        </p>
      </section>

      {/* La brecha: lo que dijeron vs con quién coinciden */}
      <BrechaPrimeraVuelta />

      {/* Lo que logramos detectar: predicción vs realidad */}
      <LoQueDetectamos />

      {/* Disclaimer + CTA */}
      <section className="mx-auto max-w-3xl px-4">
        <div className="rounded-brutal border border-accent/30 bg-accent/5 px-4 py-3 text-center text-sm text-text-muted">
          Esto <strong className="text-text">NO</strong> es una encuesta electoral.
          Son datos de afinidad programática de una muestra autoseleccionada; no
          predicen el resultado de la segunda vuelta.
        </div>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/segunda-vuelta/onboarding">
            <Button variant="brutal" size="lg" className="gap-2">
              Haz tu test de segunda vuelta
              <ArrowRight className="size-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
