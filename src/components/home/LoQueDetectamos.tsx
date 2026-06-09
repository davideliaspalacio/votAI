"use client"

import { motion, useReducedMotion } from "framer-motion"
import { mockCandidates } from "@/lib/mock/candidates"
import { firstRoundReal } from "@/lib/mock/firstRoundStats"
import { Target, Check, User } from "lucide-react"

export function LoQueDetectamos() {
  const prefersReduced = useReducedMotion()

  return (
    <section className="mx-auto max-w-3xl px-4">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-4 py-1.5 text-sm font-semibold text-success">
          <Target className="size-4" />
          Lo que logramos detectar
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-text sm:text-3xl">
          Predijimos la primera vuelta, y{" "}
          <span className="text-success">acertamos</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-text-muted">
          Semanas antes, con las respuestas del test, anticipamos el orden y los
          márgenes de la votación real.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {firstRoundReal.results.map((r, i) => {
          const c = mockCandidates.find((m) => m.id === r.candidateId)
          const color = c?.color ?? "#9CA3AF"
          return (
            <motion.div
              key={r.candidateId}
              initial={prefersReduced ? {} : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="brutal-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full"
                  style={{ backgroundColor: color + "22" }}
                >
                  {c?.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.photo} alt={r.name} className="size-full object-cover" />
                  ) : (
                    <User className="size-5" style={{ color }} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-bold text-text">
                    {r.name}
                  </p>
                  {r.note && (
                    <p className="truncate text-xs text-text-subtle">{r.note}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                {r.predictedPct != null && (
                  <div className="text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-text-subtle">
                      Predijimos
                    </p>
                    <p className="font-display text-lg font-bold text-text-muted">
                      {r.predictedPct.toFixed(1)}%
                    </p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-subtle">
                    Real
                  </p>
                  <p className="font-display text-lg font-bold" style={{ color }}>
                    {r.realPct.toFixed(2)}%
                  </p>
                </div>
                <Check className="size-5 shrink-0 text-success" />
              </div>
            </motion.div>
          )
        })}
      </div>

      <p className="mt-4 text-center text-xs text-text-subtle">
        {firstRoundReal.boletin}. Resultados oficiales de la Registraduría / CNE.
      </p>
    </section>
  )
}
