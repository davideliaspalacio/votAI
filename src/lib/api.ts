import type {
  Candidate,
  Question,
  SessionStartPayload,
  QuizAnswer,
  MatchResult,
  PublicStats,
  RunoffStats,
  RunoffSessionStartPayload,
  RunoffMatchResult,
} from "@/types/domain"
import { mockCandidates } from "@/lib/mock/candidates"
import { mockQuestions } from "@/lib/mock/questions"
import { mockMatchResult } from "@/lib/mock/matchResult"
import { mockRunoffResult } from "@/lib/mock/runoffResult"
import { mockStats } from "@/lib/mock/stats"
import { mockRunoffStats } from "@/lib/mock/runoffStats"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true"

async function fetcher<T>(
  path: string,
  options?: RequestInit,
  baseUrl = API_BASE
): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const msg = body?.message || `API error: ${res.status} ${res.statusText}`
    const err = new Error(msg) as Error & { status: number; code: string; retryAfterHours?: number }
    err.status = res.status
    err.code = body?.error || ""
    err.retryAfterHours = body?.retryAfterHours
    throw err
  }
  return res.json()
}

export const api = {
  getCandidates: async (): Promise<Candidate[]> => {
    if (USE_MOCKS) return mockCandidates
    const res = await fetcher<{ candidates: Candidate[] }>("/api/candidates")
    return res.candidates
  },

  getQuestions: async (sessionId?: string): Promise<Question[]> => {
    if (USE_MOCKS) return mockQuestions.slice(0, 10)
    const res = await fetcher<{ questions: Question[] }>(
      `/api/quiz/questions?sessionId=${sessionId}`
    )
    return res.questions
  },

  startSession: async (
    payload: SessionStartPayload
  ): Promise<{ sessionId: string }> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 300))
      return { sessionId: "mock-session-" + Date.now() }
    }
    return fetcher("/api/session/start", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  submitMatch: async (
    sessionId: string,
    answers: QuizAnswer[]
  ): Promise<{ status: "processing" | "done" }> => {
    if (USE_MOCKS) {
      return { status: "processing" }
    }
    return fetcher("/api/match", {
      method: "POST",
      body: JSON.stringify({ sessionId, answers }),
    })
  },

  getMatchResult: async (sessionId: string): Promise<MatchResult> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 500))
      return mockMatchResult
    }
    return fetcher<MatchResult>(`/api/match/${sessionId}`)
  },

  enrichMatchWithAi: async (
    sessionId: string
  ): Promise<{ enriched: boolean; cached?: boolean; reason?: string }> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 2000))
      return { enriched: true, cached: false }
    }
    return fetcher(`/api/match/${sessionId}/enrich-ai`, { method: "POST" })
  },

  // ── Segunda vuelta (runoff): Cepeda y Abelardo ──

  getRunoffQuestions: async (sessionId?: string): Promise<Question[]> => {
    if (USE_MOCKS) return mockQuestions.slice(0, 10)
    const res = await fetcher<{ questions: Question[] }>(
      `/api/runoff/questions?sessionId=${sessionId}`
    )
    return res.questions
  },

  startRunoffSession: async (
    payload: RunoffSessionStartPayload
  ): Promise<{ sessionId: string }> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 300))
      return { sessionId: "mock-runoff-" + Date.now() }
    }
    return fetcher("/api/runoff/session/start", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  submitRunoffMatch: async (
    sessionId: string,
    answers: QuizAnswer[]
  ): Promise<{ status: "processing" | "done" }> => {
    if (USE_MOCKS) {
      return { status: "processing" }
    }
    return fetcher("/api/runoff/match", {
      method: "POST",
      body: JSON.stringify({ sessionId, answers }),
    })
  },

  getRunoffMatchResult: async (
    sessionId: string
  ): Promise<RunoffMatchResult> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 500))
      return mockRunoffResult
    }
    return fetcher<RunoffMatchResult>(`/api/runoff/match/${sessionId}`)
  },

  enrichRunoffMatchWithAi: async (
    sessionId: string
  ): Promise<{ enriched: boolean; cached?: boolean; reason?: string }> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 2000))
      return { enriched: true, cached: false }
    }
    return fetcher(`/api/runoff/match/${sessionId}/enrich-ai`, {
      method: "POST",
    })
  },

  submitRunoffVoteFeedback: async (
    sessionId: string,
    voteChoice: "affinity" | "intention"
  ): Promise<{ saved: boolean }> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 300))
      return { saved: true }
    }
    return fetcher(`/api/runoff/match/${sessionId}/vote-feedback`, {
      method: "POST",
      body: JSON.stringify({ voteChoice }),
    })
  },

  getPublicStats: async (): Promise<PublicStats> => {
    if (USE_MOCKS) return mockStats
    return fetcher<PublicStats>("/api/stats/public", undefined, "")
  },

  getRunoffStats: async (): Promise<RunoffStats> => {
    if (USE_MOCKS) return mockRunoffStats
    return fetcher<RunoffStats>("/api/stats/runoff", undefined, "")
  },

  getSessionCount: async (): Promise<{ total_sessions: number }> => {
    if (USE_MOCKS) return { total_sessions: 535 }
    return fetcher<{ total_sessions: number }>("/api/stats/count")
  },

  subscribe: async (payload: {
    email: string
    consent: boolean
    source?: string
    website?: string
    // Demográficos del test (opcionales), adjuntados desde los resultados.
    age_range?: string
    region?: string
    gender?: string
    estrato?: string
    academic_level?: string
  }): Promise<{ subscribed: boolean }> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 500))
      return { subscribed: true }
    }
    return fetcher("/api/subscribers", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  updateSubscriberDetails: async (payload: {
    email: string
    name?: string
    age_range?: string
    city?: string
    occupation?: string
    heard_from?: string
  }): Promise<{ updated: boolean }> => {
    if (USE_MOCKS) {
      await new Promise((r) => setTimeout(r, 500))
      return { updated: true }
    }
    return fetcher("/api/subscribers/details", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
}
