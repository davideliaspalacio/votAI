"use client"

import { useState } from "react"
import type { Question } from "@/types/domain"
import { LikertScale } from "./LikertScale"
import { ImportanceSlider } from "./ImportanceSlider"
import { ChevronDown, ChevronUp, HelpCircle, Check } from "lucide-react"

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

  const hasOptions = question.options && question.options.length > 0

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
        {hasOptions ? (
          <OptionsList
            options={question.options!}
            selectedValue={likertValue}
            onChange={onLikertChange}
          />
        ) : (
          <LikertScale value={likertValue} onChange={onLikertChange} />
        )}
        <ImportanceSlider
          value={importanceValue}
          onChange={onImportanceChange}
        />
      </div>
    </div>
  )
}

function OptionsList({
  options,
  selectedValue,
  onChange,
}: {
  options: { label: string; value: number }[]
  selectedValue?: number
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-center text-xs text-text-subtle">
        Elige la opción que más se acerque a lo que piensas
      </p>
      {options.map((option, i) => {
        const isSelected = selectedValue === option.value
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex w-full items-start gap-3 rounded-brutal border-2 px-4 py-3 text-left text-sm transition-all ${
              isSelected
                ? "border-primary bg-primary/5 text-text"
                : "border-surface-border bg-surface text-text-muted hover:border-surface-hover hover:bg-surface/80"
            }`}
          >
            <span
              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                isSelected
                  ? "border-primary bg-primary"
                  : "border-surface-border"
              }`}
            >
              {isSelected && <Check className="size-3 text-primary-foreground" />}
            </span>
            <span className="leading-relaxed">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
