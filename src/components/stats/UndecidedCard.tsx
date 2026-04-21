"use client"

import { motion, useReducedMotion } from "framer-motion"
import { HelpCircle, Scale, AlertCircle } from "lucide-react"
import Link from "next/link"

interface UndecidedCardProps {
  pct: number
}

export function UndecidedCard({ pct }: UndecidedCardProps) {
  const prefersReduced = useReducedMotion()

  return (
    <div className="brutal-card p-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-text">
          ¿Cuántos están realmente indecisos?
        </h3>
        <Link href="/metodologia" className="text-text-subtle hover:text-primary">
          <HelpCircle className="size-4" />
        </Link>
      </div>

      <motion.div
        initial={prefersReduced ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 flex items-center gap-5"
      >
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-warning/10">
          <Scale className="size-8 text-warning" />
        </div>
        <div>
          <p className="font-display text-4xl font-bold text-warning">
            {pct.toFixed(1)}%
          </p>
          <p className="mt-0.5 text-sm text-text-muted">
            de los usuarios
          </p>
        </div>
      </motion.div>

      <p className="mt-4 text-sm leading-relaxed text-text-muted">
        Tienen a sus <strong className="text-text">2 candidatos más afines a menos de 5 puntos</strong>{" "}
        de diferencia. Es decir: no hay un candidato que destaque claramente
        para ellos.
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-md border border-warning/20 bg-warning/5 px-3 py-2">
        <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-warning" />
        <p className="text-xs text-text-muted">
          <strong className="text-text">¿Qué significa?</strong> Casi 1 de
          cada 5 personas podría cambiar de opinión fácilmente porque sus
          propuestas favoritas están repartidas entre varios candidatos.
        </p>
      </div>
    </div>
  )
}
