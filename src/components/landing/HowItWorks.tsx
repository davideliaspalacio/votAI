import { ClipboardList, Brain, BarChart3 } from "lucide-react"

const steps = [
  {
    icon: ClipboardList,
    title: "Responde",
    description:
      "10 preguntas sobre los temas que importan: economía, salud, seguridad, ambiente y más. Indica qué tan importante es cada tema para ti.",
  },
  {
    icon: Brain,
    title: "Analizamos",
    description:
      "Comparamos tus respuestas con las propuestas oficiales publicadas por cada candidato usando inteligencia artificial.",
  },
  {
    icon: BarChart3,
    title: "Descubre",
    description:
      "Conoce tu ranking de afinidad programática. Puede que te sorprendas... o puede que confirmes lo que ya sabías.",
  },
]

export function HowItWorks() {
  return (
    <section className="border-t border-surface-border bg-surface/30 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-display-sm font-bold text-text md:text-display-md">
          ¿Cómo funciona?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-text-muted">
          Tres pasos. Sin registro. Sin datos personales. Resultados inmediatos.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="brutal-card p-6 animate-fade-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-brutal bg-primary/10">
                <step.icon className="size-6 text-primary" />
              </div>
              <div className="mb-1 font-display text-xs font-semibold uppercase tracking-wider text-text-subtle">
                Paso {i + 1}
              </div>
              <h3 className="mb-2 font-display text-xl font-bold text-text">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
