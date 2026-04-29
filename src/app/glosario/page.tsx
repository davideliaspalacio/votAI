"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import { Header } from "@/components/common/Header"
import { LegalFooter } from "@/components/common/LegalFooter"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  CATEGORY_LABELS,
  GLOSSARY,
  type GlossaryCategory,
} from "@/lib/glossary"

const CATEGORIES: (GlossaryCategory | "todas")[] = [
  "todas",
  "instituciones",
  "politicas",
  "economia",
  "salud",
  "seguridad",
  "ambiente",
  "general",
]

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

export default function GlosarioPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<GlossaryCategory | "todas">("todas")

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    return GLOSSARY.filter((entry) => {
      if (category !== "todas" && entry.category !== category) return false
      if (!q) return true
      const haystack = normalize(`${entry.term} ${entry.shortDef} ${entry.longDef}`)
      return haystack.includes(q)
    })
  }, [query, category])

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <div className="mb-8">
          <h1 className="font-display text-display-sm font-bold text-text md:text-display-md">
            Glosario político
          </h1>
          <p className="mt-3 text-base text-text-muted md:text-lg">
            {GLOSSARY.length} términos del debate público colombiano explicados
            sin sesgo. Buscalos por palabra o filtra por categoría.
          </p>
        </div>

        <div className="sticky top-14 z-30 -mx-4 mb-6 border-b border-surface-border bg-background/95 px-4 py-4 backdrop-blur-md">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-subtle" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar término…"
              className="pl-9 pr-9"
              aria-label="Buscar término en el glosario"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle transition-colors hover:text-text"
                aria-label="Limpiar búsqueda"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5 overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const active = category === cat
              const label =
                cat === "todas" ? "Todas" : CATEGORY_LABELS[cat]
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-surface-border bg-surface text-text-muted hover:text-text",
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-text-muted">
            No encontramos términos para «{query}».
          </p>
        ) : (
          <ul className="space-y-4">
            {filtered.map((entry) => (
              <li
                key={entry.slug}
                id={entry.slug}
                className="scroll-mt-32 rounded-xl border border-surface-border bg-surface/50 p-5 transition-colors hover:bg-surface"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-lg font-bold text-text">
                    {entry.term}
                  </h2>
                  <span className="rounded-full bg-surface-border/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-subtle">
                    {CATEGORY_LABELS[entry.category]}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {entry.longDef}
                </p>
                {entry.related && entry.related.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {entry.related.map((rel) => (
                      <span
                        key={rel}
                        className="rounded-md bg-surface px-2 py-0.5 text-xs text-text-subtle"
                      >
                        {rel}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-12 text-xs text-text-subtle">
          ¿Falta un término? Escríbenos a{" "}
          <a
            href="mailto:hola@votoloco.com"
            className="text-primary underline underline-offset-4"
          >
            hola@votoloco.com
          </a>
          .
        </p>
      </main>
      <LegalFooter />
    </div>
  )
}
