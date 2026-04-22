"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import { formatNumber } from "@/lib/utils"
import { api } from "@/lib/api"

export function Hero() {
  const prefersReduced = useReducedMotion()
  const [sessionCount, setSessionCount] = useState<number | null>(null)

  useEffect(() => {
    api
      .getPublicStats()
      .then((stats) => setSessionCount(stats.total_sessions))
      .catch(() => setSessionCount(null))
  }, [])

  const animate = prefersReduced
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }

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
        <motion.div
          {...animate}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-4 py-1.5 text-sm text-text-muted">
            <Zap className="size-3.5 text-primary" />
            Elecciones Colombia 2026
          </div>
        </motion.div>

        <motion.h1
          className="font-display text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl md:text-display-xl"
          {...animate}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          ¿Estás seguro por quién{" "}
          <span className="text-primary">vas a votar?</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-text-muted md:text-xl"
          {...animate}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Responde 10 preguntas y descubre si tu candidato realmente representa
          lo que piensas. Sin sesgos, sin enredos.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          {...animate}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/onboarding">
            <Button variant="brutal" size="lg" className="gap-2 px-8 py-6 text-lg">
              Empezar test
              <ArrowRight className="size-5" />
            </Button>
          </Link>
        </motion.div>

        {sessionCount !== null && sessionCount > 0 && (
          <motion.p
            className="mt-6 text-sm text-text-subtle"
            {...animate}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="font-display font-semibold text-primary">
              {formatNumber(sessionCount)}+
            </span>{" "}
            colombianos ya descubrieron su afinidad programática
          </motion.p>
        )}
      </div>
    </section>
  )
}
