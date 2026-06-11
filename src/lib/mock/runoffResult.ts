import type { RunoffMatchResult } from "@/types/domain"
import { mockMatchResult } from "./matchResult"

// Mock para desarrollo local (NEXT_PUBLIC_USE_MOCKS=true).
// Reutiliza las entradas de Cepeda (c1) y Abelardo (c2) del mock de primera vuelta.
const c1 = mockMatchResult.results.find((r) => r.candidateId === "c1")!
const c2 = mockMatchResult.results.find((r) => r.candidateId === "c2")!

export const mockRunoffResult: RunoffMatchResult = {
  status: "done",
  runoff_intention: "c1",
  first_round_vote: "c3",
  preference_match: true,
  ai_enriched: false,
  // Reparto: c1 + c2 + voto en blanco suman 100.
  blank_pct: 15,
  results: [
    { ...c1, score: 60 },
    { ...c2, score: 25 },
  ],
}
