import type { RunoffStats } from "@/types/domain"

export const mockRunoffStats: RunoffStats = {
  total_sessions: 1832,
  last_updated: "2026-06-12T14:30:00Z",
  aggregate_affinity: [
    { candidateId: "c1", count: 976, pct: 53.3, avgScore: 68.4 },
    { candidateId: "c2", count: 856, pct: 46.7, avgScore: 65.9 },
  ],
  runoff_intention_counts: [
    { value: "c2", count: 802, pct: 43.8 },
    { value: "c1", count: 721, pct: 39.4 },
    { value: "undecided", count: 172, pct: 9.4 },
    { value: "blank", count: 99, pct: 5.4 },
    { value: "na", count: 38, pct: 2.1 },
  ],
  first_round_vote_counts: [
    { value: "c2", count: 701, pct: 38.3 },
    { value: "c1", count: 563, pct: 30.7 },
    { value: "c3", count: 198, pct: 10.8 },
    { value: "blank", count: 145, pct: 7.9 },
    { value: "no_vote", count: 121, pct: 6.6 },
    { value: "c5", count: 104, pct: 5.7 },
  ],
  transfer_from_first_round: [
    {
      fromCandidateId: "c2",
      total: 701,
      to: [
        { candidateId: "c2", count: 456, pct: 65.0 },
        { candidateId: "c1", count: 245, pct: 35.0 },
      ],
    },
    {
      fromCandidateId: "c1",
      total: 563,
      to: [
        { candidateId: "c1", count: 439, pct: 78.0 },
        { candidateId: "c2", count: 124, pct: 22.0 },
      ],
    },
    {
      fromCandidateId: "c3",
      total: 198,
      to: [
        { candidateId: "c2", count: 111, pct: 56.1 },
        { candidateId: "c1", count: 87, pct: 43.9 },
      ],
    },
    {
      fromCandidateId: "blank",
      total: 145,
      to: [
        { candidateId: "c1", count: 82, pct: 56.6 },
        { candidateId: "c2", count: 63, pct: 43.4 },
      ],
    },
  ],
  intention_vs_affinity: [
    {
      fromCandidateId: "c2",
      total: 802,
      to: [
        { candidateId: "c2", count: 486, pct: 60.6 },
        { candidateId: "c1", count: 316, pct: 39.4 },
      ],
    },
    {
      fromCandidateId: "c1",
      total: 721,
      to: [
        { candidateId: "c1", count: 525, pct: 72.8 },
        { candidateId: "c2", count: 196, pct: 27.2 },
      ],
    },
    {
      fromCandidateId: "undecided",
      total: 172,
      to: [
        { candidateId: "c1", count: 93, pct: 54.1 },
        { candidateId: "c2", count: 79, pct: 45.9 },
      ],
    },
  ],
  preference_match_pct: 66.4,
  preference_match_total: 1523,
  vote_choice_counts: [
    { value: "affinity", count: 312, pct: 57.8 },
    { value: "intention", count: 228, pct: 42.2 },
  ],
  blank_vote_pct: 14.7,
  closest_race_pct: 28.1,
  avg_margin: 8.6,
  by_region: [
    {
      segment: "andina",
      total: 841,
      distribution: [
        { candidateId: "c1", count: 471, pct: 56.0 },
        { candidateId: "c2", count: 370, pct: 44.0 },
      ],
      matchPct: 67.1,
      blankPct: 13.8,
    },
    {
      segment: "caribe",
      total: 327,
      distribution: [
        { candidateId: "c2", count: 182, pct: 55.7 },
        { candidateId: "c1", count: 145, pct: 44.3 },
      ],
      matchPct: 62.4,
      blankPct: 15.9,
    },
    {
      segment: "pacifica",
      total: 291,
      distribution: [
        { candidateId: "c1", count: 175, pct: 60.1 },
        { candidateId: "c2", count: 116, pct: 39.9 },
      ],
      matchPct: 70.2,
      blankPct: 14.1,
    },
  ],
  by_age: [
    {
      segment: "18-24",
      total: 426,
      distribution: [
        { candidateId: "c1", count: 267, pct: 62.7 },
        { candidateId: "c2", count: 159, pct: 37.3 },
      ],
      matchPct: 61.8,
      blankPct: 17.2,
    },
    {
      segment: "25-34",
      total: 512,
      distribution: [
        { candidateId: "c1", count: 283, pct: 55.3 },
        { candidateId: "c2", count: 229, pct: 44.7 },
      ],
      matchPct: 66.0,
      blankPct: 14.9,
    },
    {
      segment: "35-49",
      total: 479,
      distribution: [
        { candidateId: "c2", count: 249, pct: 52.0 },
        { candidateId: "c1", count: 230, pct: 48.0 },
      ],
      matchPct: 68.3,
      blankPct: 13.0,
    },
  ],
  by_gender: [
    {
      segment: "f",
      total: 816,
      distribution: [
        { candidateId: "c1", count: 466, pct: 57.1 },
        { candidateId: "c2", count: 350, pct: 42.9 },
      ],
      matchPct: 69.2,
      blankPct: 14.4,
    },
    {
      segment: "m",
      total: 789,
      distribution: [
        { candidateId: "c2", count: 416, pct: 52.7 },
        { candidateId: "c1", count: 373, pct: 47.3 },
      ],
      matchPct: 64.5,
      blankPct: 14.0,
    },
  ],
  by_estrato: [
    {
      segment: "1",
      total: 174,
      distribution: [
        { candidateId: "c1", count: 103, pct: 59.2 },
        { candidateId: "c2", count: 71, pct: 40.8 },
      ],
      matchPct: 65.4,
      blankPct: 15.2,
    },
    {
      segment: "2",
      total: 431,
      distribution: [
        { candidateId: "c1", count: 251, pct: 58.2 },
        { candidateId: "c2", count: 180, pct: 41.8 },
      ],
      matchPct: 66.9,
      blankPct: 14.3,
    },
    {
      segment: "3",
      total: 602,
      distribution: [
        { candidateId: "c2", count: 314, pct: 52.2 },
        { candidateId: "c1", count: 288, pct: 47.8 },
      ],
      matchPct: 63.7,
      blankPct: 13.9,
    },
  ],
  by_academic_level: [
    {
      segment: "pregrado",
      total: 612,
      distribution: [
        { candidateId: "c1", count: 344, pct: 56.2 },
        { candidateId: "c2", count: 268, pct: 43.8 },
      ],
      matchPct: 67.6,
      blankPct: 13.6,
    },
    {
      segment: "bachillerato",
      total: 388,
      distribution: [
        { candidateId: "c2", count: 211, pct: 54.4 },
        { candidateId: "c1", count: 177, pct: 45.6 },
      ],
      matchPct: 64.0,
      blankPct: 15.6,
    },
    {
      segment: "posgrado",
      total: 255,
      distribution: [
        { candidateId: "c1", count: 151, pct: 59.2 },
        { candidateId: "c2", count: 104, pct: 40.8 },
      ],
      matchPct: 70.1,
      blankPct: 12.4,
    },
  ],
  decisive_axes: [
    { axis: "seguridad", avgWeight: 2.7 },
    { axis: "economia", avgWeight: 2.5 },
    { axis: "empleo", avgWeight: 2.4 },
    { axis: "salud", avgWeight: 2.2 },
  ],
  polarization_by_axis: [
    { axis: "seguridad", polarizationScore: 0.82 },
    { axis: "reforma_politica", polarizationScore: 0.74 },
    { axis: "economia", polarizationScore: 0.69 },
    { axis: "politica_social", polarizationScore: 0.61 },
  ],
}
