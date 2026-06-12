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
  ai_enriched?: boolean
}

// ── Segunda vuelta (runoff): Cepeda y Abelardo ──

// IDs de los dos candidatos que disputan la segunda vuelta.
export const RUNOFF_CANDIDATE_IDS = ["c1", "c2"] as const

export type Estrato = "1" | "2" | "3" | "4" | "5" | "6" | "na"

export const STRATA: { value: Estrato; label: string }[] = [
  { value: "1", label: "Estrato 1" },
  { value: "2", label: "Estrato 2" },
  { value: "3", label: "Estrato 3" },
  { value: "4", label: "Estrato 4" },
  { value: "5", label: "Estrato 5" },
  { value: "6", label: "Estrato 6" },
  { value: "na", label: "Prefiero no decir" },
]

export type AcademicLevel =
  | "primaria"
  | "bachillerato"
  | "tecnico"
  | "pregrado"
  | "posgrado"
  | "na"

export const ACADEMIC_LEVELS: { value: AcademicLevel; label: string }[] = [
  { value: "primaria", label: "Primaria" },
  { value: "bachillerato", label: "Bachillerato" },
  { value: "tecnico", label: "Técnico / Tecnológico" },
  { value: "pregrado", label: "Pregrado" },
  { value: "posgrado", label: "Posgrado" },
  { value: "na", label: "Prefiero no decir" },
]

export interface RunoffSessionStartPayload {
  age_range: AgeRange
  region: Region
  gender?: Gender
  estrato: Estrato
  academic_level: AcademicLevel
  // candidateId (c1..c6) | "blank" | "no_vote" | "na"
  first_round_vote: string
  // "c1" | "c2" | "blank" | "undecided" | "na"
  runoff_intention: string
}

export interface RunoffMatchResult {
  status: "processing" | "done" | "failed"
  runoff_intention: string
  first_round_vote: string
  results: CandidateResult[]
  preference_match: boolean
  ai_enriched?: boolean
  // A la hora de votar, ¿se va por su afinidad o por su intención?
  vote_choice?: "affinity" | "intention" | null
  // % de temas donde eligió "ninguno de los dos" (voto en blanco).
  blank_pct?: number
  // Demográficos del test, para adjuntar al suscribirse (solo demográficos).
  demographics?: {
    age_range?: string | null
    region?: string | null
    gender?: string | null
    estrato?: string | null
    academic_level?: string | null
  }
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
    to: { candidateId: string; pct: number }[]
  }[]
  gap_national_pct: number
  decisive_axes: { axis: string; avgWeight: number }[]
  polarization_by_axis: { axis: string; polarizationScore: number }[]
  undecided_pct: number
}

export interface CountPct {
  value: string
  count: number
  pct: number
}

export interface RunoffAffinityStat {
  candidateId: string
  count: number
  pct: number
  avgScore: number
}

export interface RunoffFlowStat {
  fromCandidateId: string
  total: number
  to: { candidateId: string; count: number; pct: number }[]
}

export interface RunoffSegmentStat {
  segment: string
  total: number
  distribution: { candidateId: string; count: number; pct: number }[]
  matchPct: number
  blankPct: number
}

export interface RunoffStats {
  total_sessions: number
  last_updated: string
  aggregate_affinity: RunoffAffinityStat[]
  runoff_intention_counts: CountPct[]
  first_round_vote_counts: CountPct[]
  transfer_from_first_round: RunoffFlowStat[]
  intention_vs_affinity: RunoffFlowStat[]
  preference_match_pct: number
  preference_match_total: number
  vote_choice_counts: CountPct[]
  blank_vote_pct: number
  closest_race_pct: number
  avg_margin: number
  by_region: RunoffSegmentStat[]
  by_age: RunoffSegmentStat[]
  by_gender: RunoffSegmentStat[]
  by_estrato: RunoffSegmentStat[]
  by_academic_level: RunoffSegmentStat[]
  decisive_axes: { axis: string; avgWeight: number }[]
  polarization_by_axis: { axis: string; polarizationScore: number }[]
}
