"use client"

import { Progress } from "@/components/ui/progress"
import { AXIS_LABELS, type Axis } from "@/types/domain"
import { Badge } from "@/components/ui/badge"

interface ProgressBarProps {
  current: number
  total: number
  axis?: Axis
}

export function QuizProgressBar({ current, total, axis }: ProgressBarProps) {
  const pct = ((current + 1) / total) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text">
            {current + 1}/{total}
          </span>
          {axis && (
            <Badge variant="secondary" className="text-xs">
              {AXIS_LABELS[axis]}
            </Badge>
          )}
        </div>
        <span className="text-xs text-text-subtle">{Math.round(pct)}%</span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  )
}
