"use client"

import Link from "next/link"
import { useState } from "react"
import { BookOpen } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getGlossaryEntry, type GlossaryEntry } from "@/lib/glossary"
import { cn } from "@/lib/utils"

interface GlossaryTermProps {
  term: string
  children?: React.ReactNode
  className?: string
}

export function GlossaryTerm({ term, children, className }: GlossaryTermProps) {
  const entry = getGlossaryEntry(term)
  const [open, setOpen] = useState(false)

  if (!entry) {
    return <>{children ?? term}</>
  }

  const label = children ?? term

  return (
    <>
      <TooltipProvider delay={200}>
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setOpen(true)
                }}
                className={cn(
                  "cursor-help underline decoration-dotted decoration-primary/60 underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  className,
                )}
              />
            }
          >
            {label}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs px-3 py-2 text-xs">
            <span className="block font-semibold">{entry.term}</span>
            <span className="mt-1 block text-[11px] opacity-90">
              {entry.shortDef}
            </span>
            <span className="mt-1.5 block text-[10px] opacity-70">
              Toca para ver más
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <GlossaryDialog entry={entry} open={open} onOpenChange={setOpen} />
    </>
  )
}

interface GlossaryDialogProps {
  entry: GlossaryEntry
  open: boolean
  onOpenChange: (open: boolean) => void
}

function GlossaryDialog({ entry, open, onOpenChange }: GlossaryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {entry.term}
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            {entry.longDef}
          </DialogDescription>
        </DialogHeader>

        {entry.related && entry.related.length > 0 && (
          <div className="mt-2 border-t border-surface-border pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-subtle">
              Términos relacionados
            </p>
            <div className="flex flex-wrap gap-1.5">
              {entry.related.map((rel) => (
                <span
                  key={rel}
                  className="rounded-md bg-surface px-2 py-0.5 text-xs text-text-muted"
                >
                  {rel}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href={`/glosario#${entry.slug}`}
          onClick={() => onOpenChange(false)}
          className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary hover:underline"
        >
          <BookOpen className="size-4" />
          Ver glosario completo
        </Link>
      </DialogContent>
    </Dialog>
  )
}

interface AutoGlossaryProps {
  text: string
  className?: string
}

export function AutoGlossary({ text, className }: AutoGlossaryProps) {
  return <span className={className}>{text}</span>
}
