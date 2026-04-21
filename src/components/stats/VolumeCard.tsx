"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Users, TrendingUp, Calendar } from "lucide-react"
import { formatNumber } from "@/lib/utils"

interface VolumeCardProps {
  total: number
  lastUpdated: string
}

export function VolumeCard({ total, lastUpdated }: VolumeCardProps) {
  const prefersReduced = useReducedMotion()

  // Mock extra data
  const today = Math.round(total * 0.04)
  const thisWeek = Math.round(total * 0.18)

  return (
    <div className="brutal-card overflow-hidden p-0">
      <div className="bg-primary/10 px-6 py-8 text-center">
        <Users className="mx-auto mb-3 size-8 text-primary" />
        <motion.p
          className="font-display text-5xl font-bold text-text md:text-6xl"
          initial={prefersReduced ? {} : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {formatNumber(total)}
        </motion.p>
        <p className="mt-2 text-base text-text-muted">
          colombianos ya descubrieron su afinidad programática
        </p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-surface-border border-t border-surface-border">
        <div className="px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-success">
            <TrendingUp className="size-3.5" />
            <span className="font-display text-xl font-bold">{formatNumber(today)}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-text-subtle">hoy</p>
        </div>
        <div className="px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-primary">
            <Calendar className="size-3.5" />
            <span className="font-display text-xl font-bold">{formatNumber(thisWeek)}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-text-subtle">esta semana</p>
        </div>
      </div>

      <p className="border-t border-surface-border px-4 py-2 text-center text-[10px] text-text-subtle">
        Actualizado:{" "}
        {new Date(lastUpdated).toLocaleDateString("es-CO", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  )
}
