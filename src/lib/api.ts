import type {
  Candidate,
  Question,
  SessionStartPayload,
  QuizAnswer,
  MatchResult,
  PublicStats,
} from "@/types/domain"
import { mockCandidates } from "@/lib/mock/candidates"
import { mockQuestions } from "@/lib/mock/questions"
import { mockMatchResult } from "@/lib/mock/matchResult"
import { mockStats } from "@/lib/mock/stats"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true"

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
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

  getPublicStats: async (): Promise<PublicStats> => {
    if (USE_MOCKS) return mockStats
    return fetcher<PublicStats>("/api/stats/public")
  },

  getSessionCount: async (): Promise<{ total_sessions: number }> => {
    if (USE_MOCKS) return { total_sessions: 535 }
    return fetcher<{ total_sessions: number }>("/api/stats/count")
  },
}
