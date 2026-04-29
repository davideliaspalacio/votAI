import { ExternalLink, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface RegistraduriaCTAProps {
  className?: string
}

export function RegistraduriaCTA({ className }: RegistraduriaCTAProps) {
  return (
    <a
      href="https://wsr.registraduria.gov.co/censo/"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-center gap-4 rounded-xl border-2 border-primary bg-primary/5 p-5 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal",
        className,
      )}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <MapPin className="size-6" />
      </div>
      <div className="flex-1">
        <h3 className="font-display text-base font-bold text-text">
          Consulta tu puesto de votación
        </h3>
        <p className="mt-0.5 text-xs text-text-muted">
          En el sitio oficial de la Registraduría con tu cédula
        </p>
      </div>
      <ExternalLink className="size-4 shrink-0 text-text-subtle transition-colors group-hover:text-primary" />
    </a>
  )
}
