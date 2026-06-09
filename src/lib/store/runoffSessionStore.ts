import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  AgeRange,
  Region,
  Gender,
  Estrato,
  AcademicLevel,
} from "@/types/domain"

interface RunoffSessionState {
  sessionId: string | null
  ageRange: AgeRange | null
  region: Region | null
  gender: Gender | null
  estrato: Estrato | null
  academicLevel: AcademicLevel | null
  firstRoundVote: string | null
  runoffIntention: string | null
  setSessionId: (id: string) => void
  setDemographics: (data: {
    ageRange: AgeRange
    region: Region
    gender?: Gender
    estrato: Estrato
    academicLevel: AcademicLevel
    firstRoundVote: string
    runoffIntention: string
  }) => void
  reset: () => void
}

export const useRunoffSessionStore = create<RunoffSessionState>()(
  persist(
    (set) => ({
      sessionId: null,
      ageRange: null,
      region: null,
      gender: null,
      estrato: null,
      academicLevel: null,
      firstRoundVote: null,
      runoffIntention: null,
      setSessionId: (sessionId) => set({ sessionId }),
      setDemographics: ({
        ageRange,
        region,
        gender,
        estrato,
        academicLevel,
        firstRoundVote,
        runoffIntention,
      }) =>
        set({
          ageRange,
          region,
          gender: gender ?? "na",
          estrato,
          academicLevel,
          firstRoundVote,
          runoffIntention,
        }),
      reset: () =>
        set({
          sessionId: null,
          ageRange: null,
          region: null,
          gender: null,
          estrato: null,
          academicLevel: null,
          firstRoundVote: null,
          runoffIntention: null,
        }),
    }),
    { name: "votoloco:sv:session" }
  )
)
