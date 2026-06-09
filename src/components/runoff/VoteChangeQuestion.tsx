"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { Check, HelpCircle } from "lucide-react"

interface VoteChangeQuestionProps {
  sessionId: string
  // Nombre del candidato que la persona pensaba votar; null si no había decidido.
  intentionName: string | null
  // Nombre del candidato con mayor afinidad.
  topName: string
  initialAnswer?: "yes" | "no" | null
}

export function VoteChangeQuestion({
  sessionId,
  intentionName,
  topName,
  initialAnswer,
}: VoteChangeQuestionProps) {
  const prefersReduced = useReducedMotion()
  const [answer, setAnswer] = useState<"yes" | "no" | null>(initialAnswer ?? null)
  const [saving, setSaving] = useState(false)

  const handle = async (v: "yes" | "no") => {
    if (saving || answer) return
    setSaving(true)
    setAnswer(v) // optimista
    try {
      await api.submitRunoffVoteFeedback(sessionId, v)
    } catch {
      // es opcional: si falla, no molestamos al usuario
    } finally {
      setSaving(false)
    }
  }

  const question = intentionName
    ? `Pensabas votar por ${intentionName}, pero tu mayor afinidad es con el plan de ${topName}. Sabiendo esto, ¿reconsiderarías tu voto?`
    : `Ahora que sabes que coincides más con el plan de ${topName}, ¿votarías por ese plan?`

  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-brutal border-2 border-primary/40 bg-primary/5 p-6 text-center"
    >
      {answer ? (
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-success/15">
            <Check className="size-5 text-success" />
          </div>
          <p className="font-display text-base font-bold text-text">
            ¡Gracias por responder!
          </p>
          <p className="max-w-md text-sm text-text-muted">
            Tu respuesta (anónima) nos ayuda a entender la brecha entre la
            intención de voto y la afinidad programática.
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
            {question}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Button
              variant="brutal"
              onClick={() => handle("yes")}
              disabled={saving}
              className="min-w-28"
            >
              Sí
            </Button>
            <Button
              variant="outline"
              onClick={() => handle("no")}
              disabled={saving}
              className="min-w-28"
            >
              No
            </Button>
          </div>
          <p className="mt-3 text-xs text-text-subtle">Opcional y anónimo.</p>
        </>
      )}
    </motion.div>
  )
}
