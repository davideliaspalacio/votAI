"use client"

import { useState, useRef } from "react"
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"

interface SubscribeCardProps {
  source?: string
}

type Phase = "form" | "details" | "thanks"

// Validación de formato (no verifica que exista, solo que tenga forma correcta)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function isValidEmail(email: string): boolean {
  const trimmed = email.trim()
  return EMAIL_REGEX.test(trimmed) && trimmed.length <= 254
}

const AGE_RANGES = [
  { value: "18-24", label: "18 a 24" },
  { value: "25-34", label: "25 a 34" },
  { value: "35-49", label: "35 a 49" },
  { value: "50-64", label: "50 a 64" },
  { value: "65+", label: "65 o más" },
]

const OCCUPATIONS = [
  { value: "estudiante", label: "Estudiante" },
  { value: "profesional", label: "Profesional" },
  { value: "independiente", label: "Independiente" },
  { value: "empleado_publico", label: "Empleado público" },
  { value: "empleado_privado", label: "Empleado privado" },
  { value: "pensionado", label: "Pensionado" },
  { value: "otro", label: "Otro" },
]

const HEARD_FROM = [
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter / X" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "tiktok", label: "TikTok" },
  { value: "radio", label: "Radio" },
  { value: "amigo", label: "Un amigo" },
  { value: "google", label: "Google" },
  { value: "otro", label: "Otro" },
]

export function SubscribeCard({ source = "resultados" }: SubscribeCardProps) {
  const [phase, setPhase] = useState<Phase>("form")
  const [email, setEmail] = useState("")
  const [emailTouched, setEmailTouched] = useState(false)
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const inFlight = useRef(false)

  const emailValid = isValidEmail(email)
  const showEmailError = emailTouched && email.length > 0 && !emailValid
  const canSubmit = emailValid && consent && !loading

  const [name, setName] = useState("")
  const [ageRange, setAgeRange] = useState("")
  const [city, setCity] = useState("")
  const [occupation, setOccupation] = useState("")
  const [heardFrom, setHeardFrom] = useState("")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inFlight.current || loading) return
    setError(null)
    if (!emailValid) {
      setEmailTouched(true)
      return
    }
    if (!consent) {
      setError("Debes aceptar el consentimiento para suscribirte.")
      return
    }
    inFlight.current = true
    setLoading(true)
    try {
      await api.subscribe({ email: email.trim(), consent, source })
      setPhase("details")
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "No se pudo guardar la suscripción"
      setError(msg)
    } finally {
      setLoading(false)
      inFlight.current = false
    }
  }

  const handleSaveDetails = async () => {
    if (inFlight.current || loading) return
    inFlight.current = true
    setLoading(true)
    try {
      await api.updateSubscriberDetails({
        email: email.trim(),
        name: name.trim() || undefined,
        age_range: ageRange || undefined,
        city: city.trim() || undefined,
        occupation: occupation || undefined,
        heard_from: heardFrom || undefined,
      })
      setPhase("thanks")
    } catch {
      setPhase("thanks")
    } finally {
      setLoading(false)
      inFlight.current = false
    }
  }

  if (phase === "thanks") {
    return (
      <div className="rounded-brutal border-2 border-primary/40 bg-primary/5 p-6 text-center">
        <CheckCircle2 className="mx-auto size-10 text-primary" />
        <h3 className="mt-3 font-display text-lg font-bold text-text">
          ¡Gracias por suscribirte!
        </h3>
        <p className="mt-2 text-sm text-text-muted">
          Te avisaremos cuando publiquemos un nuevo test. Sin spam, lo prometemos.
        </p>
      </div>
    )
  }

  if (phase === "details") {
    return (
      <div className="rounded-brutal border-2 border-primary/40 bg-primary/5 p-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-primary" />
          <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
            Suscrito · Paso opcional
          </span>
        </div>
        <h3 className="mt-2 font-display text-lg font-bold text-text">
          ¿Nos cuentas algo más?
        </h3>
        <p className="mt-1 text-sm text-text-muted">
          Todo es opcional. Nos ayudas a mejorar VotoLoco. Puedes saltarlo.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-semibold text-text">Nombre</span>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Cómo te llamas"
              maxLength={120}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-semibold text-text">Edad</span>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="h-9 rounded-md border border-surface-border bg-background px-3 text-sm text-text outline-none transition-colors focus:border-primary"
            >
              <option value="">Selecciona</option>
              {AGE_RANGES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-semibold text-text">Ciudad</span>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Bogotá, Medellín…"
              maxLength={120}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-semibold text-text">A qué te dedicas</span>
            <select
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="h-9 rounded-md border border-surface-border bg-background px-3 text-sm text-text outline-none transition-colors focus:border-primary"
            >
              <option value="">Selecciona</option>
              {OCCUPATIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs sm:col-span-2">
            <span className="font-semibold text-text">
              ¿Cómo conociste VotoLoco?
            </span>
            <select
              value={heardFrom}
              onChange={(e) => setHeardFrom(e.target.value)}
              className="h-9 rounded-md border border-surface-border bg-background px-3 text-sm text-text outline-none transition-colors focus:border-primary"
            >
              <option value="">Selecciona</option>
              {HEARD_FROM.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setPhase("thanks")}
            className="text-sm text-text-muted underline-offset-4 hover:text-text hover:underline"
          >
            Listo, gracias
          </button>
          <Button
            variant="brutal"
            onClick={handleSaveDetails}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Guardando…
              </>
            ) : (
              "Guardar mis datos"
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubscribe}
      className="rounded-brutal border-2 border-surface-border bg-surface p-6"
    >
      <div className="flex items-center gap-2">
        <Mail className="size-5 text-primary" />
        <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
          Mantente al tanto
        </span>
      </div>
      <h3 className="mt-2 font-display text-lg font-bold text-text">
        Avísame cuando publiquen un nuevo test
      </h3>
      <p className="mt-1 text-sm text-text-muted">
        Te escribimos solo cuando saquemos un nuevo test, debate o análisis
        electoral. Sin spam.
      </p>

      <div className="mt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="tu@correo.com"
                disabled={loading}
                aria-invalid={showEmailError}
                aria-describedby={showEmailError ? "email-error" : undefined}
                className={
                  showEmailError
                    ? "border-accent pr-9 focus-visible:ring-accent/30"
                    : emailValid
                      ? "border-primary/60 pr-9 focus-visible:ring-primary/30"
                      : ""
                }
              />
              {email.length > 0 && (
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  {showEmailError ? (
                    <AlertCircle className="size-4 text-accent" />
                  ) : emailValid ? (
                    <CheckCircle2 className="size-4 text-primary" />
                  ) : null}
                </span>
              )}
            </div>
            {showEmailError && (
              <p
                id="email-error"
                className="mt-1.5 text-xs text-accent"
                role="alert"
              >
                Ingresa un correo válido (ej. tu@correo.com).
              </p>
            )}
          </div>
          <Button
            variant="brutal"
            type="submit"
            disabled={!canSubmit}
            className="gap-2 sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Enviando…
              </>
            ) : (
              "Suscribirme"
            )}
          </Button>
        </div>
      </div>

      <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs text-text-muted">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 cursor-pointer accent-primary"
        />
        <span>
          Acepto recibir correos de VotoLoco sobre nuevos tests electorales.
          Mis datos se tratan conforme a la{" "}
          <span className="text-text">Ley 1581 de 2012 (Habeas Data)</span>.
          Puedo cancelar la suscripción en cualquier momento.
        </span>
      </label>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-accent/40 bg-accent/5 p-3 text-sm text-text-muted">
          <AlertCircle className="size-4 shrink-0 text-accent" />
          <span>{error}</span>
        </div>
      )}
    </form>
  )
}
