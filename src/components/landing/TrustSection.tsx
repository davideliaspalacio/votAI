import { Disclaimer } from "@/components/common/Disclaimer"
import { Shield, Eye, Scale } from "lucide-react"

const trustItems = [
  {
    icon: Scale,
    title: "Neutralidad total",
    description:
      "Sin sesgo partidista. Candidatos en orden aleatorio. Análisis basado en propuestas oficiales publicadas.",
  },
  {
    icon: Shield,
    title: "Privacidad primero",
    description:
      "Sin registro. Sin cédula. Sin datos identificables. Cumplimiento Ley 1581 de 2012.",
  },
  {
    icon: Eye,
    title: "Transparencia",
    description:
      "Metodología abierta. Puedes consultar exactamente cómo se calcula tu afinidad.",
  },
]

export function TrustSection() {
  return (
    <section className="border-t border-surface-border bg-surface/30 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-display-lg font-bold leading-tight tracking-tight text-primary sm:text-display-xl md:text-[4.5rem] md:leading-[1.05]">
          No es una encuesta
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-text-muted">
          VotoLoco mide afinidad programática entre tus respuestas y las
          propuestas reales de cada candidato. Nada más, nada menos.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="rounded-brutal border border-surface-border bg-surface p-6"
            >
              <item.icon className="mb-4 size-8 text-primary" />
              <h3 className="mb-2 font-display text-lg font-bold text-text">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Disclaimer variant="full" />
        </div>
      </div>
    </section>
  )
}
