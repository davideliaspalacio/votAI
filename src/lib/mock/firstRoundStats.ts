// Estadísticas REALES de los 11.846 tests de PRIMERA VUELTA.
// Data estática (sin llamadas al backend) — extraída una sola vez con SQL.
// Insight clave: la gente DECLARÓ a Abelardo (42%) / Cepeda (27%), pero su
// afinidad programática real se reparte en el centro (Fajardo, Paloma, Claudia).

export interface FirstRoundStats {
  total_sessions: number
  last_updated: string
  // % de quienes declararon un candidato y terminaron coincidiendo más con OTRO.
  gap_national_pct: number
  aggregate_affinity: {
    candidateId: string
    name: string
    party: string
    count: number
    pct: number
  }[]
  initial_preference_counts: { preference: string; count: number; pct: number }[]
  by_region: { region: string; top3: { candidateId: string; pct: number }[] }[]
  by_age: { range: string; distribution: { candidateId: string; pct: number }[] }[]
}

export const firstRoundStats: FirstRoundStats = {
  total_sessions: 11846,
  last_updated: "2026-05-30",
  gap_national_pct: 78.8,

  // Con qué plan coincidió más cada persona (afinidad programática, #1).
  aggregate_affinity: [
    { candidateId: "c5", name: "Sergio Fajardo", party: "Dignidad y Compromiso", count: 2484, pct: 21.0 },
    { candidateId: "c3", name: "Paloma Valencia", party: "Centro Democrático / Gran Coalición", count: 2442, pct: 20.6 },
    { candidateId: "c4", name: "Claudia López", party: "Con Claudia, imparables", count: 2374, pct: 20.0 },
    { candidateId: "c0", name: "Voto en Blanco", party: "Ningún partido", count: 1836, pct: 15.5 },
    { candidateId: "c2", name: "Abelardo de la Espriella", party: "Defensores de la Patria", count: 1026, pct: 8.7 },
    { candidateId: "c1", name: "Iván Cepeda", party: "Pacto Histórico", count: 971, pct: 8.2 },
    { candidateId: "c6", name: "Roy Barreras", party: "La Fuerza / Frente por la Vida", count: 713, pct: 6.0 },
  ],

  // Por quién pensaban votar ANTES de hacer el test (intención declarada).
  initial_preference_counts: [
    { preference: "c2", count: 5005, pct: 42.3 },
    { preference: "c1", count: 3236, pct: 27.3 },
    { preference: "c3", count: 1135, pct: 9.6 },
    { preference: "undecided", count: 1099, pct: 9.3 },
    { preference: "c5", count: 633, pct: 5.3 },
    { preference: "c0", count: 477, pct: 4.0 },
    { preference: "na", count: 131, pct: 1.1 },
    { preference: "c4", count: 100, pct: 0.8 },
    { preference: "c6", count: 30, pct: 0.3 },
  ],

  by_region: [
    { region: "andina", top3: [{ candidateId: "c4", pct: 21.3 }, { candidateId: "c3", pct: 20.8 }, { candidateId: "c5", pct: 20.0 }] },
    { region: "caribe", top3: [{ candidateId: "c5", pct: 21.0 }, { candidateId: "c3", pct: 20.7 }, { candidateId: "c4", pct: 19.9 }] },
    { region: "pacifica", top3: [{ candidateId: "c5", pct: 21.1 }, { candidateId: "c3", pct: 18.9 }, { candidateId: "c0", pct: 16.8 }] },
    { region: "orinoquia", top3: [{ candidateId: "c5", pct: 33.3 }, { candidateId: "c4", pct: 23.1 }, { candidateId: "c0", pct: 20.5 }] },
    { region: "amazonia", top3: [{ candidateId: "c5", pct: 25.0 }, { candidateId: "c4", pct: 20.0 }, { candidateId: "c2", pct: 15.0 }] },
    { region: "insular", top3: [{ candidateId: "c5", pct: 33.3 }, { candidateId: "c0", pct: 20.0 }, { candidateId: "c4", pct: 16.7 }] },
  ],

  by_age: [
    { range: "18-24", distribution: [{ candidateId: "c5", pct: 22.0 }, { candidateId: "c4", pct: 21.5 }, { candidateId: "c0", pct: 17.0 }] },
    { range: "25-34", distribution: [{ candidateId: "c4", pct: 22.3 }, { candidateId: "c5", pct: 21.4 }, { candidateId: "c3", pct: 19.7 }] },
    { range: "35-49", distribution: [{ candidateId: "c3", pct: 23.6 }, { candidateId: "c5", pct: 20.7 }, { candidateId: "c4", pct: 17.4 }] },
    { range: "50-64", distribution: [{ candidateId: "c3", pct: 22.0 }, { candidateId: "c4", pct: 18.9 }, { candidateId: "c5", pct: 18.6 }] },
    { range: "65+", distribution: [{ candidateId: "c4", pct: 21.4 }, { candidateId: "c5", pct: 20.7 }, { candidateId: "c0", pct: 19.6 }] },
  ],
}

// Resultados REALES de la primera vuelta (Registraduría/CNE, 31 may 2026) y la
// predicción que sacamos con los tests. Para la sección "Lo que detectamos".
export interface RealResult {
  candidateId: string
  name: string
  realPct: number
  predictedPct: number | null
  note?: string
}

export const firstRoundReal = {
  boletin: "Escrutinio CNE (cierre 4 jun 2026) · 1ª vuelta del 31 may 2026",
  results: [
    { candidateId: "c2", name: "Abelardo de la Espriella", realPct: 43.78, predictedPct: 42.8, note: "Predijimos que ganaba — y ganó." },
    { candidateId: "c1", name: "Iván Cepeda", realPct: 40.98, predictedPct: null, note: "Predijimos que pasaba 2º a segunda vuelta." },
    { candidateId: "c3", name: "Paloma Valencia", realPct: 6.9, predictedPct: 9.7 },
    { candidateId: "c5", name: "Sergio Fajardo", realPct: 4.26, predictedPct: 4.7, note: "Predijimos que quedaba lejos." },
  ] as RealResult[],
}
