import { z } from "zod"

export const onboardingSchema = z.object({
  ageRange: z.enum(["18-24", "25-34", "35-49", "50-64", "65+"], {
    error: "Selecciona tu rango de edad",
  }),
  region: z.enum(
    ["caribe", "andina", "pacifica", "orinoquia", "amazonia", "insular"],
    { error: "Selecciona tu región" }
  ),
  gender: z.enum(["m", "f", "nb", "na"]).default("na"),
  initialPreference: z
    .string({ error: "Selecciona una opción" })
    .min(1, "Selecciona una opción"),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>
