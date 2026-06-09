import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Swords } from "lucide-react"

export function RunoffCta() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-brutal border-2 border-accent bg-surface px-6 py-8 shadow-brutal-sm sm:px-10 sm:py-10">
          <div
            className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-accent/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-center gap-5 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
              <Swords className="size-4" />
              Nuevo · Segunda vuelta
            </div>

            <h2 className="font-display text-2xl font-bold text-text sm:text-3xl">
              Cepeda <span className="text-text-subtle">vs</span> Abelardo:{" "}
              <span className="text-accent">¿con cuál plan coincides?</span>
            </h2>

            <p className="max-w-xl text-text-muted">
              Responde 10 preguntas y descubre con cuál de los dos planes de
              gobierno tienes más afinidad programática. Anónimo y sin enredos.
            </p>

            <Link href="/segunda-vuelta/onboarding">
              <Button variant="brutal" size="lg" className="gap-2">
                Hacer el test de segunda vuelta
                <ArrowRight className="size-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
