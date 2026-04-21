"use client"

import type { Region } from "@/types/domain"
import { REGIONS } from "@/types/domain"
import { cn } from "@/lib/utils"
import { MapPin } from "lucide-react"

interface StepRegionProps {
  value: Region | null
  onChange: (v: Region) => void
}

export function StepRegion({ value, onChange }: StepRegionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-display-sm font-bold text-text">
          ¿En qué región vives?
        </h2>
        <p className="mt-2 text-text-muted">
          Selecciona tu región natural
        </p>
      </div>

      <div
        className="mx-auto grid max-w-md grid-cols-2 gap-3"
        role="radiogroup"
        aria-label="Región"
      >
        {REGIONS.map((region) => (
          <button
            key={region.value}
            type="button"
            role="radio"
            aria-checked={value === region.value}
            onClick={() => onChange(region.value)}
            className={cn(
              "flex items-center gap-3 rounded-brutal border-2 px-5 py-4 text-left transition-all",
              value === region.value
                ? "border-primary bg-primary/10 text-text shadow-brutal-sm"
                : "border-surface-border bg-surface text-text-muted hover:border-surface-hover hover:bg-surface-hover"
            )}
          >
            <MapPin
              className={cn(
                "size-5 shrink-0",
                value === region.value ? "text-primary" : "text-text-subtle"
              )}
            />
            <span className="font-display text-sm font-semibold">
              {region.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
