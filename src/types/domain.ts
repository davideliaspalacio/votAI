// ── Candidates ──

export interface CandidateAxisPosition {
  summary: string
  quote: string
  page: number
}

export interface Candidate {
  id: string
  slug: string
  name: string
  party: string
  color: string
  bio: string
  photo?: string
  programPdfUrl?: string
  positions?: Partial<Record<Axis, CandidateAxisPosition>>
}

// ── Thematic Axes (10) ──

export const AXES = [
  "economia",
  "salud",
  "educacion",
  "seguridad",
  "ambiente",
  "politica_social",
  "politica_exterior",
  "reforma_politica",
  "empleo",
  "tecnologia",
] as const

export type Axis = (typeof AXES)[number]

export const AXIS_LABELS: Record<Axis, string> = {
  economia: "Economía",
  salud: "Salud",
  educacion: "Educación",
  seguridad: "Seguridad",
  ambiente: "Ambiente",
  politica_social: "Política social",
  politica_exterior: "Política exterior",
  reforma_politica: "Reforma política",
  empleo: "Empleo",
  tecnologia: "Tecnología",
}

// ── Quiz ──

export interface QuestionOption {
  label: string
  value: number
}

export interface Question {
  id: string
  text: string
  axis: Axis
  context?: string
  options?: QuestionOption[]
}

export interface QuizAnswer {
  questionId: string
  value: number | string
  weight: 1 | 2 | 3
}

// ── Onboarding / Session ──

export type AgeRange = "18-24" | "25-34" | "35-49" | "50-64" | "65+"

export type Region =
  | "caribe"
  | "andina"
  | "pacifica"
  | "orinoquia"
  | "amazonia"
  | "insular"

export const REGIONS: { value: Region; label: string }[] = [
  { value: "caribe", label: "Caribe" },
  { value: "andina", label: "Andina" },
  { value: "pacifica", label: "Pacífica" },
  { value: "orinoquia", label: "Orinoquía" },
  { value: "amazonia", label: "Amazonía" },
  { value: "insular", label: "Insular" },
]

export type Gender = "m" | "f" | "nb" | "na"

export interface SessionStartPayload {
  age_range: AgeRange
  region: Region
  gender?: Gender
  initial_preference: string // candidateId | "undecided" | "blank" | "na"
}

// ── Match Results ──

export interface AxisResult {
  axis: string
  userStance: string
  candidateStance: string
  quote: string
  programPage?: number
}

export interface CandidateResult {
  candidateId: string
  score: number // 0-100
  summary: string
  byAxis: AxisResult[]
}

export interface MatchResult {
  status: "processing" | "done"
  initial_preference: string
  results: CandidateResult[]
  preference_match: boolean
}

// ── Public Stats ──

export interface PublicStats {
  total_sessions: number
  last_updated: string
  aggregate_affinity: { candidateId: string; pct: number }[]
  by_region: {
    region: string
    top3: { candidateId: string; pct: number }[]
  }[]
  by_age: {
    range: string
    distribution: { candidateId: string; pct: number }[]
  }[]
  preference_vs_match: {
    fromCandidateId: string
    fromTotal?: number
    to: { candidateId: string; pct: number; count?: number }[]
  }[]
  initial_preference_counts?: {
    preference: string
    count: number
    pct: number
  }[]
  gap_national_pct: number
  decisive_axes: { axis: string; avgWeight: number }[]
  polarization_by_axis: { axis: string; polarizationScore: number }[]
  undecided_pct: number
}
