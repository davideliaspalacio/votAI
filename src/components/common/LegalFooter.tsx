import Link from "next/link"
import { Zap } from "lucide-react"

export function LegalFooter() {
  return (
    <footer className="border-t border-surface-border bg-surface/50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="size-6 text-primary" />
              <span className="font-display text-xl font-bold text-text">
                VotoLoco
              </span>
            </Link>
            <p className="text-sm text-text-muted">
              10 preguntas. Tu candidato real. Sin enredos.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-semibold text-text">
              Navegación
            </h3>
            <nav className="flex flex-col gap-2 text-sm text-text-muted">
              <Link href="/" className="hover:text-primary transition-colors">
                Inicio
              </Link>
              <Link
                href="/metodologia"
                className="hover:text-primary transition-colors"
              >
                Metodología
              </Link>
              <Link
                href="/comparar"
                className="hover:text-primary transition-colors"
              >
                Comparar candidatos
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-semibold text-text">
              Legal
            </h3>
            <div className="space-y-2 text-xs text-text-subtle">
              <p>
                Esta herramienta <strong className="text-text-muted">NO</strong>{" "}
                es una encuesta electoral ni está registrada ante el CNE.
                Mide afinidad programática, no intención de voto.
              </p>
              <p>
                Datos anónimos tratados conforme a la Ley 1581 de 2012 (Habeas
                Data). No se almacenan datos personales identificables.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-surface-border pt-6 text-center text-xs text-text-subtle space-y-2">
          <p>
            © {new Date().getFullYear()} VotoLoco. Herramienta de afinidad
            programática. No es una encuesta. No predice resultados electorales.
          </p>
          <p>
            Construido por{" "}
            <a
              href="https://www.davidpalacio.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted transition-colors hover:text-primary"
            >
              David Elias Palacio
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
