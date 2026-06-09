"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { api } from "@/lib/api"
import { Check, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Choice = "affinity" | "intention"

interface VoteChangeQuestionProps {
  sessionId: string
  // Candidato que la persona pensaba votar (intención declarada).
  intentionName: string
  // Candidato con el que tiene mayor afinidad programática.
  topName: string
  initialChoice?: Choice | null
}

export function VoteChangeQuestion({
  sessionId,
  intentionName,
  topName,
  initialChoice,
}: VoteChangeQuestionProps) {
  const prefersReduced = useReducedMotion()
  const [choice, setChoice] = useState<Choice | null>(initialChoice ?? null)
  const [saving, setSaving] = useState(false)

  const handle = async (c: Choice) => {
    if (saving || choice) return
    setSaving(true)
    setChoice(c) // optimista
    try {
      await api.submitRunoffVoteFeedback(sessionId, c)
    } catch {
      // es opcional: si falla, no molestamos al usuario
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-brutal border-2 border-primary/40 bg-primary/5 p-6 text-center"
    >
      {choice ? (
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-success/15">
            <Check className="size-5 text-success" />
          </div>
          <p className="font-display text-base font-bold text-text">
            ¡Gracias por responder!
          </p>
          <p className="max-w-md text-sm text-text-muted">
            {choice === "affinity"
              ? `Vas a votar por tu afinidad programática (${topName}).`
              : `Vas a mantener tu intención de voto (${intentionName}).`}
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <HelpCircle className="size-7 text-primary" />
          </div>
          <h3 className="mt-3 font-display text-lg font-bold text-text">
            Una última pregunta
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
            Pensabas votar por <strong className="text-text">{intentionName}</strong>,
            pero tu mayor afinidad es con el plan de{" "}
            <strong className="text-text">{topName}</strong>. A la hora de votar,
            ¿qué vas a seguir?
          </p>
          <div className="mx-auto mt-5 flex max-w-sm flex-col gap-3">
            <Option
              onClick={() => handle("affinity")}
              disabled={saving}
              title="Mi afinidad programática"
              subtitle={`Votaría por ${topName}`}
            />
            <Option
              onClick={() => handle("intention")}
              disabled={saving}
              title="Mi intención de voto"
              subtitle={`Mantengo mi voto por ${intentionName}`}
            />
          </div>
          <p className="mt-3 text-xs text-text-subtle">Opcional y anónimo.</p>
        </>
      )}
    </motion.div>
  )
}

function Option({
  onClick,
  disabled,
  title,
  subtitle,
}: {
  onClick: () => void
  disabled: boolean
  title: string
  subtitle: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-brutal border-2 border-surface-border bg-surface px-4 py-3 text-left transition-all",
        "hover:border-primary hover:bg-primary/5 disabled:opacity-60"
      )}
    >
      <span className="block font-display text-sm font-bold text-text">
        {title}
      </span>
      <span className="block text-xs text-text-subtle">{subtitle}</span>
    </button>
  )
}
