"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

const baseLinks = [
  { href: "/", label: "Inicio" },
  { href: "/metodologia", label: "Metodología" },
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
          <img src="/votolocoimage.png" alt="VotoLoco" className="size-8" />
          <span className="font-display text-lg font-bold text-text">
            VotoLoco
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
            <div className="flex h-full flex-col px-2 pt-6">
              {/* Logo */}
              <div className="mb-8 flex items-center gap-2 px-3">
                <img src="/votolocoimage.png" alt="VotoLoco" className="size-8" />
                <span className="font-display text-lg font-bold text-text">
                  VotoLoco
                </span>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 font-display text-base text-text-muted transition-colors hover:bg-surface hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Separator + CTA */}
              <div className="mt-6 border-t border-surface-border pt-6 px-3">
                <Link
                  href="/onboarding"
                  onClick={() => setOpen(false)}
                  className="block rounded-brutal bg-primary px-4 py-3 text-center font-display font-bold text-primary-foreground shadow-brutal transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-hover active:translate-x-0 active:translate-y-0 active:shadow-none"
                >
                  Empezar test
                  <ArrowRight className="ml-2 inline-block size-4" />
                </Link>
              </div>

              {/* Footer */}
              <p className="mt-auto pb-6 px-3 text-xs text-text-subtle">
                Elecciones Colombia 2026
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
