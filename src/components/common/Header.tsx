"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

const baseLinks = [
  { href: "/", label: "Inicio" },
  { href: "/metodologia", label: "Metodología" },
  { href: "/comparar", label: "Comparar" },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [statsEnabled, setStatsEnabled] = useState(false)

  useEffect(() => {
    setStatsEnabled(process.env.NEXT_PUBLIC_SHOW_PUBLIC_STATS === "true")
  }, [])

  const links = statsEnabled
    ? [...baseLinks, { href: "/estadisticas", label: "Estadísticas" }]
    : baseLinks

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/votolocoimage.png" alt="VotAI" className="size-8" />
          <span className="font-display text-lg font-bold text-text">
            VotAI
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-muted transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground shadow-brutal-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal active:translate-x-0 active:translate-y-0 active:shadow-none"
          >
            Empezar test
          </Link>
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
            render={<Button variant="ghost" size="icon" />}
          >
            <Menu className="size-5" />
            <span className="sr-only">Abrir menú</span>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-72 border-surface-border bg-background"
          >
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <div className="flex flex-col gap-6 pt-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-lg text-text-muted transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/onboarding"
                onClick={() => setOpen(false)}
                className="rounded-brutal bg-primary px-4 py-3 text-center font-display font-bold text-primary-foreground shadow-brutal transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-hover active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                Empezar test
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
