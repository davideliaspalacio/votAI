import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AgeRange, Region, Gender } from "@/types/domain"

interface SessionState {
  sessionId: string | null
  ageRange: AgeRange | null
  region: Region | null
  gender: Gender | null
  initialPreference: string | null
  setSessionId: (id: string) => void
  setDemographics: (data: {
    ageRange: AgeRange
    region: Region
    gender?: Gender
    initialPreference: string
  }) => void
  reset: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionId: null,
      ageRange: null,
      region: null,
      gender: null,
      initialPreference: null,
      setSessionId: (sessionId) => set({ sessionId }),
      setDemographics: ({ ageRange, region, gender, initialPreference }) =>
        set({
          ageRange,
          region,
          gender: gender ?? "na",
          initialPreference,
        }),
      reset: () =>
        set({
          sessionId: null,
          ageRange: null,
          region: null,
          gender: null,
          initialPreference: null,
        }),
    }),
    { name: "votoloco:session" }
  )
)
