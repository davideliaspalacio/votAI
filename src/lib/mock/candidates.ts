import type { Candidate } from "@/types/domain"

export const mockCandidates: Candidate[] = [
  {
    id: "c1",
    slug: "ivan-cepeda",
    name: "Iván Cepeda",
    party: "Pacto Histórico",
    color: "#FFD700",
    bio: "Senador de larga trayectoria, defensor de derechos humanos y de la paz. Impulsor de la justicia social, la reforma agraria y los acuerdos de paz. Referente de la izquierda colombiana.",
    positions: {
      economia: {
        summary: "Reforma tributaria progresiva, fortalecimiento de la banca pública y economía popular. Redistribución de la riqueza como eje central.",
        quote: "Sin justicia tributaria no hay justicia social.",
        page: 18,
      },
      salud: {
        summary: "Sistema público universal de salud sin intermediación de EPS. Atención primaria territorial y preventiva.",
        quote: "La salud no puede seguir siendo un negocio.",
        page: 42,
      },
      educacion: {
        summary: "Gratuidad total en educación superior pública. Aumento del presupuesto educativo y dignificación docente.",
        quote: "Educación pública gratuita para transformar a Colombia.",
        page: 61,
      },
      seguridad: {
        summary: "Paz total como política de seguridad. Implementación plena de los acuerdos de paz. Inversión social en territorios afectados por el conflicto.",
        quote: "La paz es la mejor política de seguridad.",
        page: 85,
      },
      ambiente: {
        summary: "Prohibición de minería en páramos y transición energética acelerada. Protección de la Amazonía y comunidades ambientales.",
        quote: "No podemos sacrificar el agua por el oro.",
        page: 33,
      },
      politica_social: {
        summary: "Renta básica para familias vulnerables, reforma agraria integral y reconocimiento de la economía del cuidado.",
        quote: "La deuda social con los más pobres no puede esperar.",
        page: 54,
      },
      politica_exterior: {
        summary: "Integración latinoamericana, diplomacia de paz y cooperación Sur-Sur. Relaciones diversificadas más allá de EE.UU.",
        quote: "Colombia debe ser líder de la paz en la región.",
        page: 76,
      },
      reforma_politica: {
        summary: "Reforma política profunda con listas cerradas paritarias, financiación estatal de campañas y curules de paz.",
        quote: "La democracia necesita más participación popular.",
        page: 11,
      },
      empleo: {
        summary: "Empleos verdes, economía del cuidado remunerada y formalización de la economía popular.",
        quote: "Un millón de empleos dignos desde la economía popular.",
        page: 93,
      },
      tecnologia: {
        summary: "Soberanía digital, internet como servicio público en zonas rurales y gobierno electrónico con equidad.",
        quote: "La tecnología debe cerrar brechas, no ampliarlas.",
        page: 105,
      },
    },
  },
  {
    id: "c2",
    slug: "abelardo-de-la-espriella",
    name: "Abelardo de la Espriella",
    party: "Defensores de la Patria",
    color: "#1E3A5F",
    bio: "Abogado penalista de alto perfil, impulsor de un modelo de seguridad al estilo Bukele y Milei. Defiende mano dura, libre mercado radical y reducción drástica del Estado.",
    positions: {
      economia: {
        summary: "Reducción drástica del Estado, eliminación de impuestos innecesarios y desregulación total para atraer inversión.",
        quote: "Menos Estado, más libertad económica para todos.",
        page: 8,
      },
      salud: {
        summary: "Privatización parcial del sistema de salud con competencia entre prestadores. Subsidio a la demanda focalizado.",
        quote: "Que cada colombiano elija dónde atenderse.",
        page: 31,
      },
      educacion: {
        summary: "Vouchers educativos y libertad de elección escolar. Fortalecimiento de la educación técnica con alianzas privadas.",
        quote: "Los padres deben decidir la educación de sus hijos.",
        page: 47,
      },
      seguridad: {
        summary: "Mano dura contra el crimen, régimen de excepción en zonas críticas, aumento masivo del pie de fuerza y cárceles de máxima seguridad.",
        quote: "Cero tolerancia con la delincuencia, como Bukele.",
        page: 14,
      },
      ambiente: {
        summary: "Minería responsable como motor económico. Aprovechamiento racional de recursos sin frenar el desarrollo.",
        quote: "Se puede crecer económicamente y cuidar el ambiente.",
        page: 58,
      },
      politica_social: {
        summary: "Programas sociales temporales y condicionados. El empleo formal como la verdadera política social.",
        quote: "Nada de subsidios eternos: trabajo, no limosna.",
        page: 69,
      },
      politica_exterior: {
        summary: "Alianza estratégica con EE.UU. e Israel. Línea dura con Venezuela y ruptura con el Foro de Sao Paulo.",
        quote: "Colombia debe alinearse con las democracias fuertes.",
        page: 82,
      },
      reforma_politica: {
        summary: "Reducción del Congreso a la mitad, eliminación de burocracia política y revocatoria de mandato express.",
        quote: "Hay que reducir el Congreso y acabar con la politiquería.",
        page: 5,
      },
      empleo: {
        summary: "Flexibilización laboral total, reducción de costos de contratación y zonas francas de empleo.",
        quote: "Si contratar es más fácil, habrá más empleo formal.",
        page: 88,
      },
      tecnologia: {
        summary: "Colombia como hub tecnológico con cero impuestos para startups. Cámaras de vigilancia con IA en todas las ciudades.",
        quote: "La tecnología es la mejor arma contra el crimen.",
        page: 102,
      },
    },
  },
  {
    id: "c3",
    slug: "paloma-valencia",
    name: "Paloma Valencia",
    party: "Centro Democrático / Gran Coalición",
    color: "#0047AB",
    bio: "Senadora por el Centro Democrático, defensora de la seguridad, la libre empresa y la modernización del Estado. Lidera una gran coalición de centro-derecha.",
    positions: {
      economia: {
        summary: "Libre mercado con Estado regulador eficiente. Reducción de impuestos corporativos, incentivos a la inversión extranjera y emprendimiento.",
        quote: "Menos impuestos y más inversión generan empleo real.",
        page: 12,
      },
      salud: {
        summary: "Competencia regulada entre EPS con estándares de calidad estrictos. Telemedicina como eje de expansión rural.",
        quote: "Las EPS deben competir por calidad, no sobrevivir por decreto.",
        page: 35,
      },
      educacion: {
        summary: "Educación bilingüe obligatoria, fortalecimiento del SENA y alianzas público-privadas para educación técnica y tecnológica.",
        quote: "Una Colombia bilingüe es una Colombia competitiva.",
        page: 49,
      },
      seguridad: {
        summary: "Aumento del presupuesto de defensa, erradicación forzada de cultivos ilícitos y presencia militar permanente en zonas de conflicto.",
        quote: "La seguridad es el primer derecho de los colombianos.",
        page: 22,
      },
      ambiente: {
        summary: "Transición energética gradual sin frenar la economía. Minería responsable con compensación ambiental.",
        quote: "Desarrollo sostenible sin destruir empleo legítimo.",
        page: 63,
      },
      politica_social: {
        summary: "Programas sociales focalizados y temporales. Empleo formal como la mejor política social, con graduación de beneficiarios.",
        quote: "La mejor transferencia es un empleo digno.",
        page: 71,
      },
      politica_exterior: {
        summary: "Alianza estratégica con EE.UU. y la OTAN. TLC con más países y cerco diplomático a la dictadura venezolana.",
        quote: "Nuestro aliado natural es Estados Unidos.",
        page: 80,
      },
      reforma_politica: {
        summary: "Reformas graduales dentro del marco constitucional. Voto electrónico, reducción del Congreso y transparencia digital.",
        quote: "Modernizar la democracia con tecnología y transparencia.",
        page: 7,
      },
      empleo: {
        summary: "Incentivos tributarios para formalización, zonas francas regionales y flexibilización laboral regulada.",
        quote: "Más empresas formales significa más empleo formal.",
        page: 86,
      },
      tecnologia: {
        summary: "Colombia como hub tecnológico de América Latina. Incentivos a startups, centros de datos y gobierno digital total.",
        quote: "Seremos el hub digital de América Latina.",
        page: 110,
      },
    },
  },
  {
    id: "c4",
    slug: "claudia-lopez",
    name: "Claudia López",
    party: "Con Claudia imparables",
    color: "#8B5CF6",
    bio: "Exalcaldesa de Bogotá, politóloga y líder anticorrupción. Impulsora de la movilidad sostenible, la transparencia y la equidad de género. Centro-izquierda pragmática.",
    positions: {
      economia: {
        summary: "Economía social de mercado con énfasis en emprendimiento, formalización y competitividad. Reforma tributaria progresiva.",
        quote: "Crecer con equidad es posible si se combate la corrupción.",
        page: 16,
      },
      salud: {
        summary: "Fortalecimiento de la red pública hospitalaria con regulación estricta de EPS. Atención primaria y salud mental como prioridad.",
        quote: "La salud pública debe ser de calidad, no de caridad.",
        page: 39,
      },
      educacion: {
        summary: "Jornada única escolar, educación STEM desde primaria y universidad pública accesible con becas por mérito y necesidad.",
        quote: "La educación es la herramienta más poderosa contra la desigualdad.",
        page: 53,
      },
      seguridad: {
        summary: "Seguridad ciudadana con enfoque preventivo, inteligencia policial, cámaras y presencia estatal integral en territorios.",
        quote: "Seguridad es prevención, inteligencia y presencia estatal.",
        page: 72,
      },
      ambiente: {
        summary: "Transición energética justa, movilidad sostenible, protección de páramos y ríos, y economía circular.",
        quote: "La movilidad sostenible transforma las ciudades y el clima.",
        page: 44,
      },
      politica_social: {
        summary: "Política social basada en evidencia con enfoque de género. Sistema de cuidado remunerado y transferencias condicionadas.",
        quote: "Las mujeres cuidadoras merecen reconocimiento y salario.",
        page: 62,
      },
      politica_exterior: {
        summary: "Diplomacia multilateral, liderazgo climático y cooperación con la OCDE. Relaciones pragmáticas con todos los actores.",
        quote: "Colombia necesita más diplomacia y menos ideología.",
        page: 84,
      },
      reforma_politica: {
        summary: "Reforma anticorrupción profunda: listas cerradas, financiación pública de campañas, transparencia total del gasto público.",
        quote: "Que cada peso público sea rastreable por cualquier ciudadano.",
        page: 9,
      },
      empleo: {
        summary: "Formalización laboral, economía naranja, emprendimiento femenino y empleo verde en ciudades sostenibles.",
        quote: "Emprender debe ser más fácil que pedir un subsidio.",
        page: 95,
      },
      tecnologia: {
        summary: "Gobierno digital, datos abiertos, regulación de IA con propósito social y conectividad universal.",
        quote: "Un Estado digital es un Estado transparente.",
        page: 108,
      },
    },
  },
  {
    id: "c5",
    slug: "sergio-fajardo",
    name: "Sergio Fajardo",
    party: "Dignidad y Compromiso",
    color: "#059669",
    bio: "Matemático, exalcalde de Medellín y exgobernador de Antioquia. Referente del centro político, apuesta por la educación, la transparencia y la infraestructura social.",
    positions: {
      economia: {
        summary: "Economía de mercado con Estado inteligente. Inversión en infraestructura social, apoyo a pymes y responsabilidad fiscal.",
        quote: "Ni Estado ausente ni Estado que ahogue al emprendedor.",
        page: 15,
      },
      salud: {
        summary: "Modelo mixto con red pública fortalecida y regulación estricta de EPS. Hospitales públicos de excelencia como referencia.",
        quote: "La salud pública se transforma con gestión, no con discursos.",
        page: 38,
      },
      educacion: {
        summary: "Educación como eje transformador: jornada única, infraestructura escolar, dignificación docente y universidad pública de calidad.",
        quote: "La educación es el camino más seguro hacia la equidad.",
        page: 8,
      },
      seguridad: {
        summary: "Seguridad con legalidad e inversión social. Presencia estatal integral en territorios, no solo militar.",
        quote: "La seguridad se construye con Estado completo en el territorio.",
        page: 67,
      },
      ambiente: {
        summary: "Transición energética responsable, protección de cuencas hídricas y educación ambiental como política de Estado.",
        quote: "Proteger el agua es proteger el futuro de Colombia.",
        page: 45,
      },
      politica_social: {
        summary: "Política social basada en evidencia con evaluaciones de impacto. Movilidad social como objetivo, no asistencialismo.",
        quote: "Todo programa social debe demostrar que funciona.",
        page: 73,
      },
      politica_exterior: {
        summary: "Diplomacia pragmática y multilateral. Liderazgo en cambio climático y migración. Relaciones equilibradas.",
        quote: "Colombia necesita más puentes y menos muros diplomáticos.",
        page: 87,
      },
      reforma_politica: {
        summary: "Reforma electoral sin constituyente: financiación pública de campañas, transparencia total y voto electrónico.",
        quote: "La política se limpia con transparencia, no con más política.",
        page: 6,
      },
      empleo: {
        summary: "Infraestructura como generadora de empleo. Formalización laboral, economía creativa y turismo regional.",
        quote: "Las obras públicas bien hechas generan empleo y dignidad.",
        page: 91,
      },
      tecnologia: {
        summary: "Conectividad universal, gobierno digital y educación tecnológica desde primaria. Sandbox regulatorio para fintech.",
        quote: "Conectar a Colombia es democratizar las oportunidades.",
        page: 106,
      },
    },
  },
  {
    id: "c6",
    slug: "roy-barreras",
    name: "Roy Barreras",
    party: "La Fuerza / Frente por la Vida",
    color: "#DC2626",
    bio: "Médico cirujano, exsenador y expresidente del Congreso. Pragmático de centro, impulsor de la vivienda social, la reforma de salud y el crecimiento económico.",
    positions: {
      economia: {
        summary: "Crecimiento económico con responsabilidad social. Alianzas público-privadas, vivienda social masiva y estímulo a la industria.",
        quote: "Crecer la economía es la mejor política social.",
        page: 19,
      },
      salud: {
        summary: "Reforma profunda al sistema de salud: red pública fortalecida, eliminación gradual de intermediación y medicina preventiva.",
        quote: "La salud es un derecho que no puede depender de EPS quebradas.",
        page: 12,
      },
      educacion: {
        summary: "Educación técnica y tecnológica para el empleo. Alianzas con el sector productivo y becas en áreas estratégicas.",
        quote: "Formar para el trabajo real, no para el desempleo.",
        page: 51,
      },
      seguridad: {
        summary: "Seguridad pragmática con fuerza pública profesionalizada e inteligencia. Diálogo donde sea posible, fuerza donde sea necesario.",
        quote: "Seguridad sin ideología: lo que funcione se aplica.",
        page: 65,
      },
      ambiente: {
        summary: "Desarrollo sostenible con aprovechamiento responsable de recursos naturales. Bonos verdes y mercados de carbono.",
        quote: "El desarrollo y el ambiente no son enemigos.",
        page: 41,
      },
      politica_social: {
        summary: "Vivienda social como eje de política social. Un millón de viviendas en cuatro años con subsidios y crédito accesible.",
        quote: "Un millón de familias con techo propio en cuatro años.",
        page: 28,
      },
      politica_exterior: {
        summary: "Diplomacia comercial activa. Apertura de mercados, relaciones pragmáticas con todos los países y liderazgo en salud global.",
        quote: "Colombia necesita más mercados, no más banderas ideológicas.",
        page: 79,
      },
      reforma_politica: {
        summary: "Reformas institucionales desde el Congreso. Reducción de burocracia, gobierno abierto y rendición de cuentas.",
        quote: "Gobernar es cumplir, no prometer lo imposible.",
        page: 10,
      },
      empleo: {
        summary: "Construcción de vivienda e infraestructura como motores de empleo masivo. Formalización del sector informal.",
        quote: "Cada vivienda construida genera 20 empleos directos.",
        page: 89,
      },
      tecnologia: {
        summary: "Historias clínicas digitales, telemedicina universal y gobierno electrónico eficiente. Tecnología al servicio de la salud.",
        quote: "La tecnología debe llegar primero a los hospitales públicos.",
        page: 104,
      },
    },
  },
]
