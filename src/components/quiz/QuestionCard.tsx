"use client"

import { useState } from "react"
import type { Question } from "@/types/domain"
import { LikertScale } from "./LikertScale"
import { ImportanceSlider } from "./ImportanceSlider"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"

interface QuestionCardProps {
  question: Question
  likertValue?: number
  importanceValue: 1 | 2 | 3
  onLikertChange: (v: number) => void
  onImportanceChange: (v: 1 | 2 | 3) => void
}

export function QuestionCard({
  question,
  likertValue,
  importanceValue,
  onLikertChange,
  onImportanceChange,
}: QuestionCardProps) {
  const [showContext, setShowContext] = useState(false)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-xl font-bold leading-snug text-text sm:text-2xl md:text-display-sm">
          {question.text}
        </h2>
      </div>

      {question.context && (
        <div className="mx-auto max-w-lg">
          <button
            type="button"
            onClick={() => setShowContext(!showContext)}
            className="flex items-center gap-2 text-sm text-text-subtle hover:text-text-muted transition-colors"
          >
            <HelpCircle className="size-4" />
            ¿Por qué es importante?
            {showContext ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
          </button>
          {showContext && (
            <div className="mt-3 rounded-brutal border border-surface-border bg-surface p-4 text-sm text-text-muted">
              {question.context}
            </div>
          )}
        </div>
      )}

      <div className="mx-auto max-w-lg space-y-6">
        <LikertScale value={likertValue} onChange={onLikertChange} />
        <ImportanceSlider
          value={importanceValue}
          onChange={onImportanceChange}
        />
      </div>
    </div>
  )
}
