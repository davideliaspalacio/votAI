import type { PublicStats } from "@/types/domain"

export const mockStats: PublicStats = {
  total_sessions: 2547,
  last_updated: "2026-04-21T14:30:00Z",
  aggregate_affinity: [
    { candidateId: "c1", pct: 25.0 },
    { candidateId: "c2", pct: 20.2 },
    { candidateId: "c5", pct: 17.5 },
    { candidateId: "c4", pct: 14.8 },
    { candidateId: "c3", pct: 13.2 },
    { candidateId: "c6", pct: 9.3 },
    { candidateId: "c0", pct: 5.0 },
  ],
  by_region: [
    {
      region: "andina",
      top3: [
        { candidateId: "c1", pct: 24.1 },
        { candidateId: "c2", pct: 19.5 },
        { candidateId: "c5", pct: 16.2 },
      ],
    },
    {
      region: "caribe",
      top3: [
        { candidateId: "c4", pct: 21.8 },
        { candidateId: "c1", pct: 20.3 },
        { candidateId: "c6", pct: 15.1 },
      ],
    },
    {
      region: "pacifica",
      top3: [
        { candidateId: "c4", pct: 28.5 },
        { candidateId: "c1", pct: 22.1 },
        { candidateId: "c6", pct: 14.7 },
      ],
    },
    {
      region: "orinoquia",
      top3: [
        { candidateId: "c3", pct: 28.6 },
        { candidateId: "c2", pct: 22.1 },
        { candidateId: "c5", pct: 18.5 },
      ],
    },
    {
      region: "amazonia",
      top3: [
        { candidateId: "c1", pct: 31.2 },
        { candidateId: "c4", pct: 24.5 },
        { candidateId: "c5", pct: 12.8 },
      ],
    },
    {
      region: "insular",
      top3: [
        { candidateId: "c5", pct: 30.1 },
        { candidateId: "c2", pct: 26.3 },
        { candidateId: "c6", pct: 18.4 },
      ],
    },
  ],
  by_age: [
    {
      range: "18-24",
      distribution: [
        { candidateId: "c1", pct: 34.5 },
        { candidateId: "c4", pct: 23.4 },
        { candidateId: "c5", pct: 17.2 },
        { candidateId: "c2", pct: 12.8 },
        { candidateId: "c6", pct: 7.1 },
        { candidateId: "c3", pct: 5.0 },
      ],
    },
    {
      range: "25-34",
      distribution: [
        { candidateId: "c1", pct: 26.8 },
        { candidateId: "c2", pct: 23.1 },
        { candidateId: "c5", pct: 19.2 },
        { candidateId: "c4", pct: 13.9 },
        { candidateId: "c3", pct: 11.3 },
        { candidateId: "c6", pct: 5.7 },
      ],
    },
    {
      range: "35-49",
      distribution: [
        { candidateId: "c2", pct: 23.4 },
        { candidateId: "c1", pct: 21.6 },
        { candidateId: "c5", pct: 17.9 },
        { candidateId: "c3", pct: 17.1 },
        { candidateId: "c4", pct: 11.2 },
        { candidateId: "c6", pct: 8.8 },
      ],
    },
    {
      range: "50-64",
      distribution: [
        { candidateId: "c3", pct: 26.2 },
        { candidateId: "c2", pct: 22.1 },
        { candidateId: "c5", pct: 17.8 },
        { candidateId: "c1", pct: 17.3 },
        { candidateId: "c6", pct: 10.9 },
        { candidateId: "c4", pct: 5.7 },
      ],
    },
    {
      range: "65+",
      distribution: [
        { candidateId: "c3", pct: 32.4 },
        { candidateId: "c2", pct: 22.5 },
        { candidateId: "c5", pct: 18.3 },
        { candidateId: "c6", pct: 13.5 },
        { candidateId: "c1", pct: 9.3 },
        { candidateId: "c4", pct: 4.0 },
      ],
    },
  ],
  preference_vs_match: [
    {
      fromCandidateId: "c1",
      to: [
        { candidateId: "c1", pct: 68 },
        { candidateId: "c4", pct: 15 },
        { candidateId: "c5", pct: 10 },
        { candidateId: "c2", pct: 7 },
      ],
    },
    {
      fromCandidateId: "c2",
      to: [
        { candidateId: "c2", pct: 55 },
        { candidateId: "c5", pct: 22 },
        { candidateId: "c1", pct: 15 },
        { candidateId: "c3", pct: 8 },
      ],
    },
    {
      fromCandidateId: "c3",
      to: [
        { candidateId: "c3", pct: 45 },
        { candidateId: "c2", pct: 28 },
        { candidateId: "c5", pct: 17 },
        { candidateId: "c6", pct: 10 },
      ],
    },
    {
      fromCandidateId: "c4",
      to: [
        { candidateId: "c4", pct: 60 },
        { candidateId: "c1", pct: 25 },
        { candidateId: "c6", pct: 10 },
        { candidateId: "c5", pct: 5 },
      ],
    },
    {
      fromCandidateId: "c5",
      to: [
        { candidateId: "c5", pct: 50 },
        { candidateId: "c2", pct: 28 },
        { candidateId: "c1", pct: 14 },
        { candidateId: "c3", pct: 8 },
      ],
    },
    {
      fromCandidateId: "c6",
      to: [
        { candidateId: "c6", pct: 52 },
        { candidateId: "c1", pct: 20 },
        { candidateId: "c4", pct: 15 },
        { candidateId: "c5", pct: 13 },
      ],
    },
  ],
  gap_national_pct: 43.2,
  decisive_axes: [
    { axis: "economia", avgWeight: 2.7 },
    { axis: "seguridad", avgWeight: 2.5 },
    { axis: "salud", avgWeight: 2.4 },
    { axis: "educacion", avgWeight: 2.3 },
    { axis: "empleo", avgWeight: 2.2 },
    { axis: "ambiente", avgWeight: 2.1 },
    { axis: "politica_social", avgWeight: 2.0 },
    { axis: "reforma_politica", avgWeight: 1.8 },
    { axis: "politica_exterior", avgWeight: 1.6 },
    { axis: "tecnologia", avgWeight: 1.5 },
  ],
  polarization_by_axis: [
    { axis: "seguridad", polarizationScore: 0.85 },
    { axis: "economia", polarizationScore: 0.78 },
    { axis: "reforma_politica", polarizationScore: 0.72 },
    { axis: "politica_exterior", polarizationScore: 0.65 },
    { axis: "ambiente", polarizationScore: 0.58 },
    { axis: "politica_social", polarizationScore: 0.52 },
    { axis: "salud", polarizationScore: 0.45 },
    { axis: "educacion", polarizationScore: 0.38 },
    { axis: "empleo", polarizationScore: 0.35 },
    { axis: "tecnologia", polarizationScore: 0.28 },
  ],
  undecided_pct: 18.5,
}
