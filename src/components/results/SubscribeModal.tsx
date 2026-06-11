"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SubscribeCard } from "./SubscribeCard"

interface SubscribeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  source?: string
  /** Demográficos del test, se adjuntan al suscribirse (solo demográficos). */
  demographics?: {
    age_range?: string | null
    region?: string | null
    gender?: string | null
    estrato?: string | null
    academic_level?: string | null
  }
}

export function SubscribeModal({
  open,
  onOpenChange,
  source = "segunda-vuelta-resultados",
  demographics,
}: SubscribeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Suscríbete a VotoLoco</DialogTitle>
        </DialogHeader>
        <SubscribeCard
          source={source}
          demographics={demographics}
          skipDetails
          bare
          onSubscribed={() => {
            // Cerrar tras un momento para que se vea el "¡Gracias!".
            setTimeout(() => onOpenChange(false), 2200)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
