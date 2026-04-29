import Link from "next/link"
import { ArrowRight, BookOpen, CalendarDays, Vote } from "lucide-react"

const UTILITIES = [
  {
    href: "/como-voto",
    icon: Vote,
    title: "¿Cómo voto?",
    description:
      "Guía paso a paso: documentos, horarios y todo lo que necesitas para no equivocarte el día de las elecciones.",
    cta: "Ver la guía",
  },
  {
    href: "/calendario",
    icon: CalendarDays,
    title: "Calendario electoral",
    description:
      "Debates, plazos, primera vuelta, segunda vuelta y posesión presidencial. Agrégalos a tu calendario.",
    cta: "Ver fechas",
  },
  {
    href: "/glosario",
    icon: BookOpen,
    title: "Glosario político",
    description:
      "Términos del debate público colombiano explicados sin sesgo: EPS, Paz Total, Asamblea Constituyente y más.",
    cta: "Explorar términos",
  },
]

export function CivicUtilities() {
  return (
    <section className="border-t border-surface-border bg-background py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-primary">
            Más allá del test
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-text md:text-3xl">
            Antes de votar, prepárate
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-text-muted md:text-base">
            VotoLoco no es solo un test. Es tu kit cívico para llegar a las
            urnas con toda la información que necesitas.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {UTILITIES.map((u) => (
            <Link
              key={u.href}
              href={u.href}
              className="group flex flex-col rounded-xl border border-surface-border bg-surface/50 p-6 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-primary hover:shadow-brutal"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <u.icon className="size-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-text">
                {u.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-text-muted">
                {u.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                {u.cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
