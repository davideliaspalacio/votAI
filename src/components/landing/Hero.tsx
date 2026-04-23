import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { SessionCounter } from "./SessionCounter"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-20 md:pb-24 md:pt-32">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[300px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Mascota */}
        <div className="mb-8 animate-fade-up">
          <Image
            src="/votolocoimage.png"
            alt="VotAI"
            width={192}
            height={192}
            priority
            className="mx-auto size-32 sm:size-40 md:size-48 drop-shadow-2xl animate-float"
          />
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-4 py-1.5 text-sm text-text-muted">
            Elecciones Colombia 2026
          </div>
        </div>

        <h1
          className="font-display text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl md:text-display-xl animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          ¿Estás seguro por quién{" "}
          <span className="text-primary">vas a votar?</span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl text-lg text-text-muted md:text-xl animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          Responde 10 preguntas y descubre si tu candidato realmente representa
          lo que piensas. Sin sesgos, sin enredos.
        </p>

        <div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Link href="/onboarding">
            <Button variant="brutal" size="lg" className="gap-2 px-8 py-6 text-lg">
              Empezar test
              <ArrowRight className="size-5" />
            </Button>
          </Link>
        </div>

        <SessionCounter />
      </div>
    </section>
  )
}
