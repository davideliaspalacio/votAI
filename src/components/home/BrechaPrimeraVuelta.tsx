"use client"

import { motion, useReducedMotion } from "framer-motion"
import { mockCandidates } from "@/lib/mock/candidates"
import { firstRoundStats } from "@/lib/mock/firstRoundStats"
import { User } from "lucide-react"

const SPECIAL: Record<string, { name: string; color: string }> = {
  undecided: { name: "Aún no decidía", color: "#9CA3AF" },
  na: { name: "No respondía", color: "#9CA3AF" },
  blank: { name: "Voto en blanco", color: "#9CA3AF" },
}

function info(id: string) {
  const c = mockCandidates.find((m) => m.id === id)
  if (c) return { name: c.name, color: c.color, photo: c.photo }
  return { ...(SPECIAL[id] ?? { name: id, color: "#9CA3AF" }), photo: undefined }
}

// Top 4 de cada lado.
const declared = firstRoundStats.initial_preference_counts
  .filter((p) => p.preference !== "na")
  .slice(0, 4)
  .map((p) => ({ ...info(p.preference), pct: p.pct }))

const affinity = firstRoundStats.aggregate_affinity
  .slice(0, 4)
  .map((a) => ({ ...info(a.candidateId), pct: a.pct }))

function Column({
  title,
  subtitle,
  rows,
}: {
  title: string
  subtitle: string
  rows: { name: string; color: string; photo?: string; pct: number }[]
}) {
  const max = Math.max(...rows.map((r) => r.pct))
  return (
    <div className="brutal-card p-5">
      <p className="font-display text-base font-bold text-text">{title}</p>
      <p className="mb-4 text-xs text-text-subtle">{subtitle}</p>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-3">
            <div
              className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full"
              style={{ backgroundColor: r.color + "22" }}
            >
              {r.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.photo} alt={r.name} className="size-full object-cover" />
              ) : (
                <User className="size-4" style={{ color: r.color }} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-semibold text-text">{r.name}</span>
                <span className="font-display text-sm font-bold text-text">{r.pct}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-border">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(r.pct / max) * 100}%`, backgroundColor: r.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BrechaPrimeraVuelta() {
  const prefersReduced = useReducedMotion()

  return (
    <section className="mx-auto max-w-4xl px-4">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-text sm:text-3xl">
          La gente no vota lo que{" "}
          <span className="text-primary">realmente piensa</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-text-muted">
          Casi <strong className="text-accent">8 de cada 10</strong> declararon un
          candidato, pero su afinidad programática coincidía más con otro.
        </p>
      </div>

      {/* Stat gigante */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-8 max-w-md rounded-brutal border-2 border-accent bg-accent/10 px-6 py-5 text-center shadow-brutal-accent"
      >
        <p className="font-display text-5xl font-bold text-accent">
          {firstRoundStats.gap_national_pct}%
        </p>
        <p className="mt-1 text-sm text-text-muted">
          votaba distinto a su propio plan de gobierno
        </p>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Column
          title="Lo que DIJERON"
          subtitle="Por quién pensaban votar antes del test"
          rows={declared}
        />
        <Column
          title="Con quién COINCIDEN"
          subtitle="Con qué plan se alineó su afinidad real"
          rows={affinity}
        />
      </div>

      <p className="mx-auto mt-5 max-w-2xl text-center text-sm text-text-muted">
        El <strong className="text-text">42%</strong> dijo que votaría por Abelardo,
        pero solo el <strong className="text-text">8,7%</strong> coincide de verdad
        con su plan. La afinidad real se reparte en el centro.
      </p>
    </section>
  )
}
