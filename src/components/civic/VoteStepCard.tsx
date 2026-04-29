import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoteStepCardProps {
  step: number
  icon: LucideIcon
  title: string
  description: string
  highlight?: string
  className?: string
}

export function VoteStepCard({
  step,
  icon: Icon,
  title,
  description,
  highlight,
  className,
}: VoteStepCardProps) {
  return (
    <article
      className={cn(
        "relative flex gap-4 rounded-xl border border-surface-border bg-surface/50 p-5",
        className,
      )}
    >
      <div className="flex flex-col items-center">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-brutal-sm">
          <Icon className="size-5" />
        </div>
        <span className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-text-subtle">
          Paso {step}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="font-display text-base font-bold text-text">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
          {description}
        </p>
        {highlight && (
          <p className="mt-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs text-primary">
            {highlight}
          </p>
        )}
      </div>
    </article>
  )
}
