import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="text-center">
        <p className="font-display text-8xl font-bold text-primary">404</p>
        <h1 className="mt-4 font-display text-display-sm font-bold text-text">
          Página no encontrada
        </h1>
        <p className="mt-2 text-text-muted">
          La página que buscas no existe o fue movida.
        </p>
        <Link href="/" className="mt-8 inline-block">
          <Button variant="brutal" className="gap-2">
            <Home className="size-4" />
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  )
}
