import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { mockCandidates } from "@/lib/mock/candidates"
import { AXIS_LABELS, AXES } from "@/types/domain"
import { Header } from "@/components/common/Header"
import { LegalFooter } from "@/components/common/LegalFooter"
import { Disclaimer } from "@/components/common/Disclaimer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Quote, User } from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return mockCandidates.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const candidate = mockCandidates.find((c) => c.slug === slug)
  if (!candidate) return {}
  return {
    title: `${candidate.name} - Perfil`,
    description: `Conoce las propuestas de ${candidate.name} (${candidate.party}) en los 10 ejes temáticos.`,
  }
}

export default async function CandidatePage({ params }: Props) {
  const { slug } = await params
  const candidate = mockCandidates.find((c) => c.slug === slug)
  if (!candidate) notFound()

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <div className="mx-auto max-w-3xl flex-1 px-4 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver al inicio
        </Link>

        {/* Profile header */}
        <div className="flex items-start gap-6">
          <div
            className="flex size-20 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: candidate.color + "20" }}
          >
            {candidate.photo ? (
              <img src={candidate.photo} alt={candidate.name} className="size-full rounded-full object-cover" />
            ) : (
              <User className="size-10" style={{ color: candidate.color }} />
            )}
          </div>
          <div>
            <h1 className="font-display text-display-sm font-bold text-text">
              {candidate.name}
            </h1>
            <p className="mt-1 text-text-muted">{candidate.party}</p>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {candidate.bio}
            </p>
          </div>
        </div>

        {/* Axes grid with real mock data */}
        <div className="mt-12">
          <h2 className="mb-6 font-display text-xl font-bold text-text">
            Posiciones por eje temático
          </h2>
          <div className="grid gap-4">
            {AXES.map((axis) => {
              const pos = candidate.positions?.[axis]
              return (
                <div
                  key={axis}
                  className="rounded-brutal border-2 border-surface-border bg-surface p-5"
                >
                  <h3
                    className="font-display text-sm font-bold"
                    style={{ color: candidate.color }}
                  >
                    {AXIS_LABELS[axis]}
                  </h3>
                  {pos ? (
                    <>
                      <p className="mt-2 text-sm leading-relaxed text-text-muted">
                        {pos.summary}
                      </p>
                      <blockquote className="mt-3 flex items-start gap-2 border-l-2 pl-3 text-sm italic text-text-subtle" style={{ borderColor: candidate.color + "60" }}>
                        <Quote className="mt-0.5 size-3 shrink-0" style={{ color: candidate.color }} />
                        <span>&ldquo;{pos.quote}&rdquo;</span>
                      </blockquote>
                      <p className="mt-2 flex items-center gap-1 text-xs text-text-subtle">
                        <FileText className="size-3" />
                        Programa oficial, pág. {pos.page}
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-xs text-text-subtle italic">
                      No se encontraron propuestas específicas para este eje en el programa oficial.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8">
          <Disclaimer variant="compact" />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/comparar">
            <Button variant="brutal">Comparar con otro candidato</Button>
          </Link>
          <Link href="/onboarding">
            <Button variant="outline">Hacer el test</Button>
          </Link>
        </div>
      </div>
      <LegalFooter />
    </div>
  )
}
