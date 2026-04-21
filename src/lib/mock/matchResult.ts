import type { MatchResult } from "@/types/domain"

export const mockMatchResult: MatchResult = {
  status: "done",
  initial_preference: "c3",
  preference_match: false,
  results: [
    {
      candidateId: "c1",
      score: 82,
      summary:
        "Alta afinidad en ambiente, política social y economía. Cepeda propone paz total e inversión social, alineada con tus respuestas.",
      byAxis: [
        {
          axis: "Economía",
          userStance: "Favorece intervención estatal moderada",
          candidateStance: "Propone reforma tributaria progresiva y banca pública",
          quote: "Sin justicia tributaria no hay justicia social",
          programPage: 18,
        },
        {
          axis: "Salud",
          userStance: "Apoya reforma al sistema de salud",
          candidateStance: "Sistema público universal sin intermediación de EPS",
          quote: "La salud no puede seguir siendo un negocio",
          programPage: 42,
        },
        {
          axis: "Educación",
          userStance: "Favorece ampliación de educación pública gratuita",
          candidateStance: "Gratuidad total en educación superior pública",
          quote: "Educación pública gratuita para transformar a Colombia",
          programPage: 61,
        },
        {
          axis: "Seguridad",
          userStance: "Prefiere enfoque integral sobre militarización",
          candidateStance: "Paz total como política de seguridad con inversión social",
          quote: "La paz es la mejor política de seguridad",
          programPage: 85,
        },
        {
          axis: "Ambiente",
          userStance: "Fuerte protección ambiental",
          candidateStance: "Prohibición de minería en páramos y transición energética",
          quote: "No podemos sacrificar el agua por el oro",
          programPage: 33,
        },
        {
          axis: "Política social",
          userStance: "Apoya transferencias condicionadas",
          candidateStance: "Renta básica para familias vulnerables y reforma agraria",
          quote: "La deuda social con los más pobres no puede esperar",
          programPage: 54,
        },
        {
          axis: "Política exterior",
          userStance: "Favorece integración latinoamericana",
          candidateStance: "Integración latinoamericana y diplomacia de paz",
          quote: "Colombia debe ser líder de la paz en la región",
          programPage: 76,
        },
        {
          axis: "Reforma política",
          userStance: "Apoya reformas graduales",
          candidateStance: "Reforma política profunda con listas cerradas paritarias",
          quote: "La democracia necesita más participación popular",
          programPage: 11,
        },
        {
          axis: "Empleo",
          userStance: "Empleo formal como prioridad",
          candidateStance: "Empleos verdes y formalización de la economía popular",
          quote: "Un millón de empleos dignos desde la economía popular",
          programPage: 93,
        },
        {
          axis: "Tecnología",
          userStance: "Adopción cautelosa con protección social",
          candidateStance: "Soberanía digital e internet como servicio público rural",
          quote: "La tecnología debe cerrar brechas, no ampliarlas",
          programPage: 105,
        },
      ],
    },
    {
      candidateId: "c5",
      score: 74,
      summary:
        "Fuerte afinidad en reforma política y educación. Fajardo apuesta por transparencia y transformación desde la educación.",
      byAxis: [
        {
          axis: "Economía",
          userStance: "Favorece intervención estatal moderada",
          candidateStance: "Economía de mercado con Estado inteligente y responsabilidad fiscal",
          quote: "Ni Estado ausente ni Estado que ahogue al emprendedor",
          programPage: 15,
        },
        {
          axis: "Ambiente",
          userStance: "Fuerte protección ambiental",
          candidateStance: "Transición energética responsable y protección de cuencas hídricas",
          quote: "Proteger el agua es proteger el futuro de Colombia",
          programPage: 45,
        },
      ],
    },
    {
      candidateId: "c4",
      score: 68,
      summary:
        "Coincidencia importante en anticorrupción y política social. López prioriza transparencia y equidad de género.",
      byAxis: [
        {
          axis: "Reforma política",
          userStance: "Apoya reformas graduales",
          candidateStance: "Reforma anticorrupción profunda con transparencia total",
          quote: "Que cada peso público sea rastreable por cualquier ciudadano",
          programPage: 9,
        },
      ],
    },
    {
      candidateId: "c6",
      score: 55,
      summary:
        "Coincidencia parcial en salud y vivienda social. Barreras propone reforma al sistema sanitario y vivienda masiva.",
      byAxis: [
        {
          axis: "Salud",
          userStance: "Apoya reforma al sistema de salud",
          candidateStance: "Reforma profunda con red pública fortalecida",
          quote: "La salud es un derecho que no puede depender de EPS quebradas",
          programPage: 12,
        },
      ],
    },
    {
      candidateId: "c3",
      score: 35,
      summary:
        "Baja afinidad general. Valencia tiene posiciones opuestas en economía y ambiente a tus respuestas.",
      byAxis: [
        {
          axis: "Seguridad",
          userStance: "Prefiere enfoque integral sobre militarización",
          candidateStance: "Aumento del presupuesto de defensa y erradicación forzada",
          quote: "La seguridad es el primer derecho de los colombianos",
          programPage: 22,
        },
      ],
    },
    {
      candidateId: "c2",
      score: 28,
      summary:
        "Menor afinidad. De la Espriella prioriza mano dura y libre mercado radical, opuesto a tus preferencias.",
      byAxis: [
        {
          axis: "Seguridad",
          userStance: "Prefiere enfoque integral sobre militarización",
          candidateStance: "Mano dura, régimen de excepción y cero tolerancia",
          quote: "Cero tolerancia con la delincuencia, como Bukele",
          programPage: 14,
        },
      ],
    },
    {
      candidateId: "c0",
      score: 50,
      summary:
        "Tu posición neutral en varios ejes se alinea con el escepticismo del voto en blanco.",
      byAxis: [
        {
          axis: "Reforma política",
          userStance: "Apoya reformas graduales",
          candidateStance: "El problema no es la Constitución sino la clase política",
          quote: "Reformar con los mismos políticos no funciona",
          programPage: 0,
        },
      ],
    },
  ],
}
