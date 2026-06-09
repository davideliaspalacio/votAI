"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Vote, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SessionCounter } from "./SessionCounter"
import { mockCandidates } from "@/lib/mock/candidates"
import type { Candidate } from "@/types/domain"

const cepeda = mockCandidates.find((c) => c.id === "c1")!
const abelardo = mockCandidates.find((c) => c.id === "c2")!

export function Hero() {
  const prefersReduced = useReducedMotion()

  const side = (dir: number) => ({
    hidden: prefersReduced ? { opacity: 0 } : { opacity: 0, x: dir * 70 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring" as const, stiffness: 120, damping: 16 },
    },
  })

  const fadeUp = {
    hidden: prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.4 + i * 0.1 },
    }),
  }

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-16 md:pb-24 md:pt-24">
      {/* Background glows tinted per candidate */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute left-0 top-10 h-[420px] w-[520px] -translate-x-1/3 rounded-full blur-[130px]"
          style={{ backgroundColor: "#FF4D6D1A" }}
        />
        <div
          className="absolute right-0 top-10 h-[420px] w-[520px] translate-x-1/3 rounded-full blur-[130px]"
          style={{ backgroundColor: cepeda.color + "1A" }}
        />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent"
        >
          <Vote className="size-4" />
          Segunda vuelta · Colombia 2026
        </motion.div>

        {/* Los dos candidatos */}
        <div className="mb-10 flex items-start justify-center gap-8 sm:gap-16">
          <motion.div
            variants={side(-1)}
            initial="hidden"
            animate="show"
            className="flex flex-1 flex-col items-center gap-3 sm:flex-none"
          >
            <CandidatePhoto candidate={abelardo} />
            <div>
              <p className="font-display text-base font-bold text-text sm:text-lg">
                {abelardo.name}
              </p>
              <p className="text-xs text-text-subtle sm:text-sm">
                {abelardo.party}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={side(1)}
            initial="hidden"
            animate="show"
            className="flex flex-1 flex-col items-center gap-3 sm:flex-none"
          >
            <CandidatePhoto candidate={cepeda} />
            <div>
              <p className="font-display text-base font-bold text-text sm:text-lg">
                {cepeda.name}
              </p>
              <p className="text-xs text-text-subtle sm:text-sm">{cepeda.party}</p>
            </div>
          </motion.div>
        </div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
          className="font-display text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl md:text-display-xl"
        >
          ¿Estás seguro de tu voto en{" "}
          <span className="text-primary">segunda vuelta?</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="mx-auto mt-6 max-w-2xl text-lg text-text-muted md:text-xl"
        >
          Responde 10 preguntas y descubre con cuál de los dos planes —Cepeda o
          Abelardo— tienes más afinidad programática. Anónimo y sin enredos.
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link href="/segunda-vuelta/onboarding">
            <Button variant="brutal" size="lg" className="gap-2 px-8 py-6 text-lg">
              Hacer test de segunda vuelta
              <ArrowRight className="size-5" />
            </Button>
          </Link>
        </motion.div>

        <SessionCounter />
      </div>
    </section>
  )
}

function CandidatePhoto({ candidate }: { candidate: Candidate }) {
  return (
    <div
      className="size-24 overflow-hidden rounded-full border-4 animate-float sm:size-28 md:size-32"
      style={{
        borderColor: candidate.color,
        boxShadow: `0 0 28px ${candidate.color}55`,
      }}
    >
      {candidate.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={candidate.photo}
          alt={candidate.name}
          className="size-full object-cover"
        />
      ) : (
        <div
          className="flex size-full items-center justify-center"
          style={{ backgroundColor: candidate.color + "22" }}
        >
          <User className="size-10" style={{ color: candidate.color }} />
        </div>
      )}
    </div>
  )
}
