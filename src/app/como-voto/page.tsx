import {
  AlertTriangle,
  Check,
  Clock,
  IdCard,
  MapPin,
  Pencil,
  ShieldQuestion,
  Vote,
  XCircle,
} from "lucide-react"
import { Header } from "@/components/common/Header"
import { LegalFooter } from "@/components/common/LegalFooter"
import { VoteStepCard } from "@/components/civic/VoteStepCard"
import { RegistraduriaCTA } from "@/components/civic/RegistraduriaCTA"

const STEPS = [
  {
    icon: IdCard,
    title: "Lleva tu cédula amarilla con hologramas",
    description:
      "Solo se admite la cédula amarilla con hologramas (la versión vigente). La contraseña sirve únicamente si está en trámite y dentro de la vigencia indicada por la Registraduría.",
    highlight:
      "Sin cédula no puedes votar. Otros documentos (pasaporte, licencia) no son válidos.",
  },
  {
    icon: Clock,
    title: "Vota entre 8:00 AM y 4:00 PM",
    description:
      "Las urnas abren a las 8:00 AM y cierran a las 4:00 PM. Si llegas a tu puesto antes de las 4:00 PM y estás en la fila, tienes derecho a votar aunque la jornada haya cerrado.",
  },
  {
    icon: MapPin,
    title: "Verifica tu puesto de votación",
    description:
      "Si te mudaste o nunca has votado, revisa en qué mesa te corresponde sufragar. La Registraduría tiene un consultor en línea con tu cédula.",
    highlight:
      "Hazlo días antes — el día de elecciones, los puestos están saturados.",
  },
  {
    icon: Vote,
    title: "Marca con una X dentro del recuadro",
    description:
      "Recibes un tarjetón con las fotos y nombres de todos los candidatos. Marca con un lápiz una sola X dentro del recuadro del candidato de tu preferencia. Si marcas más de uno, el voto se anula.",
  },
  {
    icon: Pencil,
    title: "Si te equivocas, pide otro tarjetón",
    description:
      "Tienes derecho a un nuevo tarjetón si te equivocas o lo dañas, antes de depositarlo en la urna. Avísale al jurado de votación con calma y entrega el dañado.",
  },
  {
    icon: Check,
    title: "Deposita tu voto y conserva tu certificado",
    description:
      "Dobla el tarjetón, deposítalo en la urna y firma el formulario E-11. El jurado te entrega un certificado electoral que da beneficios: medio día compensatorio, descuento en trámites y rebajas en multas de tránsito.",
    highlight:
      "El certificado es tuyo por ley — exígelo si no te lo entregan.",
  },
]

const FAQS = [
  {
    icon: ShieldQuestion,
    title: "¿Qué pasa si no aparezco en el censo?",
    description:
      "Acércate al jurado de votación. Si tu cédula está activa, te pueden remitir al PMT (Puesto de Mesa de Trabajo) o a la sede de Registraduría más cercana. Sin estar inscrito en una mesa específica no puedes votar para presidente.",
  },
  {
    icon: XCircle,
    title: "Voto en blanco vs voto nulo vs no votar",
    description:
      "El voto en blanco es VÁLIDO: si gana mayoría absoluta en primera vuelta presidencial, la elección debe repetirse con candidatos diferentes. El voto nulo es un error de marcación (varias casillas, tachones) y no se cuenta. No votar es abstenerse y no tiene efectos legales.",
  },
  {
    icon: AlertTriangle,
    title: "¿Hay sanciones por no votar?",
    description:
      "No. Votar en Colombia es un derecho, no una obligación. Pero quienes votan reciben un certificado electoral que da beneficios económicos y administrativos durante 4 años.",
  },
]

export default function ComoVotoPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <div className="mb-10">
          <h1 className="font-display text-display-sm font-bold text-text md:text-display-md">
            ¿Cómo voto?
          </h1>
          <p className="mt-3 text-base text-text-muted md:text-lg">
            Guía paso a paso para votar en las elecciones presidenciales de
            Colombia 2026. Sin enredos, sin tecnicismos.
          </p>
        </div>

        <RegistraduriaCTA className="mb-10" />

        <section className="mb-12">
          <h2 className="mb-4 font-display text-xl font-bold text-text">
            El día de las elecciones, paso a paso
          </h2>
          <div className="space-y-3">
            {STEPS.map((step, idx) => (
              <VoteStepCard
                key={idx}
                step={idx + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
                highlight={step.highlight}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-display text-xl font-bold text-text">
            Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <article
                key={idx}
                className="rounded-xl border border-surface-border bg-surface/50 p-5"
              >
                <div className="flex items-center gap-3">
                  <faq.icon className="size-5 text-primary" />
                  <h3 className="font-display text-base font-bold text-text">
                    {faq.title}
                  </h3>
                </div>
                <p className="mt-2 pl-8 text-sm leading-relaxed text-text-muted">
                  {faq.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-surface-border bg-surface/30 p-5">
          <h3 className="font-display text-sm font-bold text-text">Fuentes</h3>
          <ul className="mt-2 space-y-1 text-xs text-text-muted">
            <li>
              ·{" "}
              <a
                href="https://www.registraduria.gov.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Registraduría Nacional del Estado Civil
              </a>
            </li>
            <li>
              ·{" "}
              <a
                href="https://www.cne.gov.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Consejo Nacional Electoral (CNE)
              </a>
            </li>
            <li>
              ·{" "}
              <a
                href="https://moe.org.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Misión de Observación Electoral (MOE)
              </a>
            </li>
          </ul>
        </section>

        <RegistraduriaCTA className="mt-10" />
      </main>
      <LegalFooter />
    </div>
  )
}
