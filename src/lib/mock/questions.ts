import type { Question } from "@/types/domain"

export const mockQuestions: Question[] = [
  {
    id: "q1",
    text: "El Estado debería controlar los precios de los alimentos básicos de la canasta familiar.",
    axis: "economia",
    context:
      "Colombia enfrenta una inflación acumulada que afecta los productos de primera necesidad. Algunos candidatos proponen intervención directa en precios, otros apuestan por subsidios focalizados o libre mercado.",
  },
  {
    id: "q2",
    text: "El sistema de salud debe garantizar cobertura universal sin intermediarios privados (EPS).",
    axis: "salud",
    context:
      "La reforma al sistema de salud ha sido un tema central en las últimas legislaturas. Las propuestas van desde eliminar las EPS hasta fortalecerlas con mayor regulación.",
  },
  {
    id: "q3",
    text: "La educación superior pública debería ser completamente gratuita para todos los estratos.",
    axis: "educacion",
    context:
      "Actualmente existen programas como Generación E que subsidian parcialmente. La discusión es si la gratuidad total es fiscalmente sostenible y si beneficiaría equitativamente.",
  },
  {
    id: "q4",
    text: "Colombia necesita aumentar la presencia militar en las zonas más afectadas por el conflicto.",
    axis: "seguridad",
    context:
      "Las zonas rurales siguen enfrentando violencia de grupos armados ilegales. Los enfoques varían entre mayor presencia militar, inversión social, o una combinación de ambos.",
  },
  {
    id: "q5",
    text: "Se debe prohibir la minería a gran escala en páramos y reservas naturales, sin excepciones.",
    axis: "ambiente",
    context:
      "Colombia tiene el 50% de los páramos del mundo. La tensión entre desarrollo económico y protección ambiental es un eje central del debate electoral.",
  },
  {
    id: "q6",
    text: "El gobierno debe ampliar significativamente los programas de transferencias monetarias a familias vulnerables.",
    axis: "politica_social",
    context:
      "Programas como Familias en Acción y Renta Ciudadana han mostrado resultados mixtos. El debate es sobre su eficiencia, cobertura y posible desincentivo al trabajo formal.",
  },
  {
    id: "q7",
    text: "Colombia debería buscar mayor integración económica con los países latinoamericanos, incluso si eso implica distanciarse de EE.UU.",
    axis: "politica_exterior",
    context:
      "La política exterior colombiana históricamente ha estado alineada con Estados Unidos. Algunos candidatos proponen diversificar relaciones y fortalecer bloques como la CAN o CELAC.",
  },
  {
    id: "q8",
    text: "Es necesaria una asamblea constituyente para reformar profundamente las instituciones políticas del país.",
    axis: "reforma_politica",
    context:
      "La Constitución de 1991 ha tenido más de 50 reformas. Algunos consideran que se necesita un cambio estructural, mientras otros prefieren reformas graduales dentro del marco actual.",
  },
  {
    id: "q9",
    text: "El gobierno debe priorizar la creación de empleo formal a través de incentivos fiscales a las empresas.",
    axis: "empleo",
    context:
      "La informalidad laboral en Colombia supera el 55%. Las propuestas incluyen desde incentivos tributarios hasta programas de empleo público y fortalecimiento de la economía popular.",
  },
  {
    id: "q10",
    text: "Colombia debe invertir masivamente en inteligencia artificial y automatización, aunque esto transforme el mercado laboral.",
    axis: "tecnologia",
    context:
      "La revolución tecnológica ofrece oportunidades pero también riesgos de desempleo. Los candidatos difieren en qué tan agresivamente adoptar estas tecnologías y cómo mitigar su impacto social.",
  },
]
