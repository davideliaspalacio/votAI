import Link from "next/link"

export function LegalFooter() {
  return (
    <footer className="border-t border-surface-border bg-surface/50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="/votolocoimage.png" alt="VotoLoco" className="size-10" />
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

        <div className="mt-10 border-t border-surface-border pt-6 text-center text-xs text-text-subtle space-y-3">
          <p>
            © {new Date().getFullYear()} VotoLoco. Herramienta de afinidad
            programática. No es una encuesta. No predice resultados electorales.
          </p>
          <div className="space-y-1">
            <p>
              <a
                href="https://www.instagram.com/richarpalacio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted transition-colors hover:text-primary"
              >
                Ricardo Palacio B.
              </a>
              {" — "}Director de Proyecto
            </p>
            <p>
              <a
                href="https://www.davidpalacio.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted transition-colors hover:text-primary"
              >
                David Elias Palacio G.
              </a>
              {" — "}AI Full Stack Developer
            </p>
            <p className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-text-subtle">
                Consultores
              </span>
            </p>
            <p>Julio César Novoa F.</p>
            <p>
              <a
                href="https://www.instagram.com/oscarmass/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted transition-colors hover:text-primary"
              >
                Oscar Mass P.
              </a>
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 pt-4">
            <span className="text-[11px] uppercase tracking-wider text-text-subtle">
              Aliados
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              <a
                href="https://hbconsultoresdelcaribe.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 transition-opacity hover:opacity-100"
                aria-label="HB Consultores del Caribe (abre en una nueva pestaña)"
              >
                <img
                  src="/logo-hb-web.png"
                  alt="HB Consultores del Caribe"
                  className="h-10 w-auto"
                />
              </a>
              <a
                href="https://ceipa.edu.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 transition-opacity hover:opacity-100"
                aria-label="CEIPA (abre en una nueva pestaña)"
              >
                <img
                  src="/logo-ceipa.png"
                  alt="CEIPA"
                  className="h-10 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
