"use client"

import { motion, useReducedMotion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { mockCandidates } from "@/lib/mock/candidates"
import { formatNumber } from "@/lib/utils"
import Link from "next/link"
import { HelpCircle, Crown } from "lucide-react"

interface AggregateAffinityProps {
  data: { candidateId: string; pct: number }[]
  total: number
}

export function AggregateAffinity({ data, total }: AggregateAffinityProps) {
  const prefersReduced = useReducedMotion()
  const MIN_N = 1000

  if (total < MIN_N) {
    return (
      <div className="brutal-card flex flex-col items-center justify-center p-8 text-center">
        <p className="font-display text-2xl font-bold text-text">
          Calibrando...
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Necesitamos al menos {formatNumber(MIN_N)} tests para mostrar estos datos.
          <br />
          <span className="font-semibold text-primary">
            Faltan {formatNumber(MIN_N - total)}.
          </span>
        </p>
        <div className="mt-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-surface-border">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(total / MIN_N) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  const chartData = data.map((d) => {
    const candidate = mockCandidates.find((c) => c.id === d.candidateId)
    return {
      name: candidate?.name ?? d.candidateId,
      value: d.pct,
      color: candidate?.color ?? "#666",
    }
  })

  const top = chartData[0]

  return (
    <div className="brutal-card p-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-text">
          ¿Con quién hay más afinidad?
        </h3>
        <Link href="/metodologia" className="text-text-subtle hover:text-primary">
          <HelpCircle className="size-4" />
        </Link>
      </div>

      {/* Insight callout */}
      {top && (
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-md border border-surface-border bg-surface-hover px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <Crown className="size-4" style={{ color: top.color }} />
            <p className="text-sm text-text">
              <strong style={{ color: top.color }}>{top.name}</strong> es el
              candidato con mayor afinidad programática agregada:{" "}
              <strong className="text-primary">{top.value}%</strong> de los
              usuarios tiene mayor coincidencia con sus propuestas.
            </p>
          </div>
        </motion.div>
      )}

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#14141B",
              border: "1px solid #2A2A3A",
              borderRadius: "4px",
              color: "#FAFAFA",
              fontSize: "12px",
            }}
            formatter={(value) => [`${Number(value).toFixed(1)}%`, ""]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Ranking list below chart */}
      <div className="mt-2 space-y-1.5">
        {chartData.map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="w-5 text-right text-xs font-bold text-text-subtle">
              {i + 1}.
            </span>
            <div
              className="size-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="flex-1 text-xs text-text-muted">{entry.name}</span>
            <span className="text-xs font-bold text-text">{entry.value}%</span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[10px] text-text-subtle">
        Basado en {formatNumber(total)} tests completados. Muestra el % de
        usuarios cuyo candidato #1 de afinidad es cada uno.
      </p>
    </div>
  )
}
