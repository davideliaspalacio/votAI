export type GlossaryCategory =
  | "instituciones"
  | "politicas"
  | "economia"
  | "salud"
  | "seguridad"
  | "ambiente"
  | "general"

export interface GlossaryEntry {
  slug: string
  term: string
  shortDef: string
  longDef: string
  category: GlossaryCategory
  related?: string[]
}

export const CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  instituciones: "Instituciones",
  politicas: "Política",
  economia: "Economía",
  salud: "Salud",
  seguridad: "Seguridad",
  ambiente: "Ambiente",
  general: "General",
}

const slugify = (term: string) =>
  term
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")

const RAW_GLOSSARY: Omit<GlossaryEntry, "slug">[] = [
  {
    term: "Asamblea Constituyente",
    shortDef:
      "Mecanismo para reformar profundamente la Constitución mediante delegados elegidos por el pueblo.",
    longDef:
      "Es un cuerpo de delegados elegidos por voto popular con poder para redactar o reformar la Constitución. Su convocatoria requiere ley previa del Congreso y aval de la Corte Constitucional. Colombia tuvo una en 1991, que dio origen a la Constitución vigente.",
    category: "instituciones",
    related: ["Constitución", "Reforma constitucional", "Congreso"],
  },
  {
    term: "EPS",
    shortDef:
      "Entidad Promotora de Salud. Empresa que administra los recursos del régimen contributivo de salud.",
    longDef:
      "Las EPS son intermediarias entre los aportes de salud que hacen empleadores y trabajadores y las IPS (clínicas y hospitales) que prestan los servicios. Reciben una UPC (unidad de pago por capitación) por afiliado y son responsables de garantizar el acceso al Plan de Beneficios.",
    category: "salud",
    related: ["IPS", "UPC", "Régimen contributivo", "Plan de Beneficios"],
  },
  {
    term: "IPS",
    shortDef:
      "Institución Prestadora de Servicios de Salud. Hospitales, clínicas y centros médicos que atienden directamente al paciente.",
    longDef:
      "Las IPS son las entidades que prestan los servicios de salud de forma directa: hospitales, clínicas, laboratorios y consultorios. Reciben pagos de las EPS por los servicios prestados.",
    category: "salud",
    related: ["EPS", "Sistema de salud"],
  },
  {
    term: "Paz Total",
    shortDef:
      "Política del gobierno Petro que busca diálogos simultáneos con guerrillas, disidencias y bandas criminales.",
    longDef:
      "Política del gobierno de Gustavo Petro (Ley 2272 de 2022) que extiende los procesos de paz a múltiples actores armados al tiempo: ELN, disidencias de las FARC, Clan del Golfo y estructuras criminales urbanas. Es una de las políticas más debatidas del cuatrienio 2022-2026.",
    category: "seguridad",
    related: ["ELN", "Disidencias", "Acuerdo de Paz", "JEP"],
  },
  {
    term: "Reforma tributaria",
    shortDef:
      "Cambio en las leyes de impuestos para ajustar lo que pagan personas y empresas al Estado.",
    longDef:
      "Modifica el sistema tributario nacional: tarifas de renta, IVA, impuestos al patrimonio, ganancias ocasionales, etc. En Colombia se han aprobado varias en los últimos años (2016, 2018, 2021, 2022). Es uno de los temas más sensibles de cualquier programa de gobierno.",
    category: "economia",
    related: ["IVA", "Impuesto de renta", "DIAN"],
  },
  {
    term: "Acuerdo de Paz",
    shortDef:
      "Acuerdo firmado en 2016 entre el gobierno Santos y las FARC-EP que terminó 52 años de conflicto armado.",
    longDef:
      "Firmado en 2016 entre el gobierno de Juan Manuel Santos y las FARC-EP. Contiene 6 puntos: reforma rural integral, participación política, fin del conflicto, drogas ilícitas, víctimas (incluye la JEP) e implementación. Su cumplimiento sigue siendo tema de debate político.",
    category: "seguridad",
    related: ["FARC", "JEP", "Reforma rural", "Paz Total"],
  },
  {
    term: "JEP",
    shortDef:
      "Jurisdicción Especial para la Paz. Tribunal creado por el Acuerdo de Paz para juzgar crímenes del conflicto.",
    longDef:
      "Jurisdicción Especial para la Paz. Tribunal transicional creado en 2017 para investigar y juzgar los crímenes más graves cometidos durante el conflicto armado, tanto por exguerrilleros de las FARC como por miembros de la fuerza pública y terceros civiles.",
    category: "instituciones",
    related: ["Acuerdo de Paz", "Justicia transicional", "FARC"],
  },
  {
    term: "ELN",
    shortDef:
      "Ejército de Liberación Nacional. Guerrilla colombiana de origen guevarista, fundada en 1964.",
    longDef:
      "Guerrilla colombiana de orientación marxista y guevarista, fundada en 1964. Es el último grupo guerrillero de gran tamaño activo en Colombia. Ha sostenido diálogos intermitentes con varios gobiernos sin firmar un acuerdo de paz definitivo.",
    category: "seguridad",
    related: ["Paz Total", "FARC", "Conflicto armado"],
  },
  {
    term: "FARC",
    shortDef:
      "Fuerzas Armadas Revolucionarias de Colombia. Guerrilla desmovilizada en 2016 tras el Acuerdo de Paz.",
    longDef:
      "Las FARC-EP fueron la guerrilla más grande de Colombia (1964-2017). Tras el Acuerdo de Paz se desmovilizaron y dieron origen al partido político Comunes. Algunos disidentes rechazaron el acuerdo y formaron grupos armados que siguen activos.",
    category: "seguridad",
    related: ["Acuerdo de Paz", "Disidencias", "ELN"],
  },
  {
    term: "Disidencias",
    shortDef:
      "Grupos armados formados por exintegrantes de las FARC que rechazaron el Acuerdo de Paz.",
    longDef:
      "Estructuras armadas conformadas por exintegrantes de las FARC que se apartaron del Acuerdo de Paz de 2016. Las dos principales son el Estado Mayor Central (EMC) y la Segunda Marquetalia. Operan principalmente en zonas rurales con economías ilegales.",
    category: "seguridad",
    related: ["FARC", "Paz Total", "Acuerdo de Paz"],
  },
  {
    term: "Frente Nacional",
    shortDef:
      "Pacto político (1958-1974) entre liberales y conservadores que se alternaron la presidencia.",
    longDef:
      "Acuerdo bipartidista (1958-1974) que puso fin a la Violencia. Liberales y conservadores se alternaron la presidencia cada cuatro años y se repartieron por partes iguales los cargos públicos. Cerró el sistema político a otras fuerzas y es citado como antecedente del nacimiento de las guerrillas.",
    category: "general",
    related: ["Constitución", "Bipartidismo"],
  },
  {
    term: "Voto en blanco",
    shortDef:
      "Voto válido que rechaza a todos los candidatos sin anular el tiquete.",
    longDef:
      "Es una opción válida en el tiquete electoral que expresa rechazo a todos los candidatos. Si gana mayoría absoluta en una elección unipersonal en primera vuelta (presidente, alcalde, gobernador), la elección debe repetirse con candidatos diferentes.",
    category: "politicas",
    related: ["Voto nulo", "Abstención"],
  },
  {
    term: "Voto nulo",
    shortDef:
      "Voto que no se cuenta porque está mal marcado, tachado o tiene marcas no permitidas.",
    longDef:
      "Voto inválido por marcación incorrecta: marcar varias casillas, tachar el tiquete, escribir mensajes, etc. No tiene efectos políticos y no se computa en los resultados.",
    category: "politicas",
    related: ["Voto en blanco", "Abstención"],
  },
  {
    term: "Abstención",
    shortDef:
      "Decisión de no votar. No es un voto, no aparece en el tiquete y no tiene efectos legales.",
    longDef:
      "Es la decisión de no acudir a las urnas. En Colombia las tasas de abstención presidencial suelen estar entre el 40% y el 55%. No debe confundirse con el voto en blanco, que sí es un voto válido y conteable.",
    category: "politicas",
    related: ["Voto en blanco", "Voto nulo"],
  },
  {
    term: "CNE",
    shortDef:
      "Consejo Nacional Electoral. Organismo que vigila a partidos, financiación de campañas y publicidad electoral.",
    longDef:
      "Consejo Nacional Electoral. Inspecciona y vigila la organización electoral, regula a los partidos políticos, controla la financiación de campañas y la publicidad electoral. Sus 9 magistrados son elegidos por el Congreso para periodos de 4 años.",
    category: "instituciones",
    related: ["Registraduría", "Partidos políticos"],
  },
  {
    term: "Registraduría",
    shortDef:
      "Organismo que organiza las elecciones, expide cédulas y administra el registro civil.",
    longDef:
      "Registraduría Nacional del Estado Civil. Organiza el proceso electoral (logística, censo, escrutinio), expide cédulas y administra el registro civil. Está separada del CNE pero ambas hacen parte de la Organización Electoral.",
    category: "instituciones",
    related: ["CNE", "Censo electoral", "Cédula"],
  },
  {
    term: "Plebiscito",
    shortDef:
      "Mecanismo de participación donde el pueblo aprueba o rechaza una decisión política del presidente.",
    longDef:
      "Mecanismo de participación ciudadana mediante el cual el presidente convoca al pueblo a votar Sí o No sobre una decisión política suya. El más conocido fue el plebiscito por el Acuerdo de Paz (2016), que ganó el No por estrecho margen.",
    category: "politicas",
    related: ["Referendo", "Consulta popular", "Acuerdo de Paz"],
  },
  {
    term: "Referendo",
    shortDef:
      "Mecanismo de participación para aprobar o rechazar una norma jurídica concreta.",
    longDef:
      "A diferencia del plebiscito, el referendo se usa para aprobar o derogar leyes, actos legislativos o normas concretas. Puede ser convocado por iniciativa ciudadana o gubernamental.",
    category: "politicas",
    related: ["Plebiscito", "Consulta popular"],
  },
  {
    term: "Consulta popular",
    shortDef:
      "Mecanismo donde el pueblo responde Sí o No a una pregunta de trascendencia nacional, departamental o municipal.",
    longDef:
      "Mecanismo de participación en el que se somete una pregunta de trascendencia (nacional, departamental o municipal) a decisión del pueblo. La decisión es obligatoria para las autoridades si se cumple el umbral.",
    category: "politicas",
    related: ["Plebiscito", "Referendo"],
  },
  {
    term: "Umbral electoral",
    shortDef:
      "Porcentaje mínimo de votos que necesita un partido para conservar su personería o entrar al Congreso.",
    longDef:
      "Porcentaje mínimo de votos que un partido debe obtener para conservar su personería jurídica o acceder a curules. En Colombia, para Senado es el 3% del total de votos válidos.",
    category: "politicas",
    related: ["Cifra repartidora", "Curules"],
  },
  {
    term: "Cifra repartidora",
    shortDef:
      "Fórmula matemática para distribuir las curules entre los partidos según los votos obtenidos.",
    longDef:
      "Sistema de asignación proporcional de curules en cuerpos colegiados (Congreso, Asambleas, Concejos). Se calcula dividiendo los votos de cada partido por 1, 2, 3... y tomando los cocientes más altos hasta llenar las curules disponibles.",
    category: "politicas",
    related: ["Umbral electoral", "Curules"],
  },
  {
    term: "Salario mínimo",
    shortDef:
      "Remuneración mensual mínima legal que debe recibir un trabajador en Colombia.",
    longDef:
      "Es el salario mensual más bajo que un empleador puede pagar legalmente a un trabajador de tiempo completo. Se fija anualmente por concertación entre gobierno, empresarios y sindicatos, o por decreto si no hay acuerdo. Regula el ingreso de millones de colombianos.",
    category: "economia",
    related: ["UVT", "Concertación laboral"],
  },
  {
    term: "UVT",
    shortDef:
      "Unidad de Valor Tributario. Referencia ajustada anualmente para calcular impuestos y multas.",
    longDef:
      "Unidad de Valor Tributario. Es una unidad que se actualiza cada año con la inflación y se usa para fijar valores en la legislación tributaria (rangos de renta, sanciones, etc.) sin tener que reformar la ley cada vez.",
    category: "economia",
    related: ["DIAN", "Impuesto de renta"],
  },
  {
    term: "IVA",
    shortDef:
      "Impuesto al Valor Agregado. Lo paga el consumidor sobre la mayoría de bienes y servicios.",
    longDef:
      "Impuesto al Valor Agregado. Es un impuesto al consumo que se cobra sobre la mayoría de bienes y servicios. La tarifa general en Colombia es del 19%. Hay tarifas diferenciales (5% y 0%) y bienes exentos.",
    category: "economia",
    related: ["DIAN", "Reforma tributaria"],
  },
  {
    term: "Impuesto de renta",
    shortDef:
      "Impuesto que pagan personas y empresas sobre los ingresos obtenidos en el año.",
    longDef:
      "Impuesto directo sobre los ingresos anuales de personas naturales y jurídicas. En personas tiene tarifas progresivas según el nivel de ingreso; en empresas la tarifa general es del 35%.",
    category: "economia",
    related: ["DIAN", "UVT", "Reforma tributaria"],
  },
  {
    term: "DIAN",
    shortDef:
      "Dirección de Impuestos y Aduanas Nacionales. Recauda los impuestos del Estado.",
    longDef:
      "Dirección de Impuestos y Aduanas Nacionales. Es la entidad encargada de administrar y recaudar los impuestos nacionales (renta, IVA, GMF, aranceles) y de fiscalizar el comercio exterior.",
    category: "instituciones",
    related: ["IVA", "Impuesto de renta", "UVT"],
  },
  {
    term: "Banco de la República",
    shortDef:
      "Banco central de Colombia. Maneja la política monetaria e imprime el dinero.",
    longDef:
      "Banco central autónomo. Sus funciones principales son emitir la moneda, controlar la inflación mediante la tasa de interés de intervención, manejar las reservas internacionales y actuar como prestamista de última instancia. Su Junta Directiva es independiente del gobierno.",
    category: "instituciones",
    related: ["Inflación", "Tasa de interés"],
  },
  {
    term: "Inflación",
    shortDef:
      "Aumento sostenido y generalizado del precio de los bienes y servicios.",
    longDef:
      "Tasa de aumento promedio de los precios de una canasta representativa de bienes y servicios. La meta del Banco de la República es del 3% anual con un rango de tolerancia de ±1 punto. Una inflación alta erosiona el poder adquisitivo.",
    category: "economia",
    related: ["Banco de la República", "Tasa de interés"],
  },
  {
    term: "Régimen contributivo",
    shortDef:
      "Sistema de salud para quienes pueden cotizar: empleados, independientes con ingresos y pensionados.",
    longDef:
      "Régimen del sistema de salud para personas con capacidad de pago: empleados (aportan 12.5% del salario), trabajadores independientes con ingresos sobre 1 salario mínimo y pensionados. La afiliación se hace a través de una EPS.",
    category: "salud",
    related: ["EPS", "Régimen subsidiado", "UPC"],
  },
  {
    term: "Régimen subsidiado",
    shortDef:
      "Sistema de salud financiado por el Estado para personas sin capacidad de pago.",
    longDef:
      "Régimen del sistema de salud para personas sin capacidad económica de cotizar. Se financia con recursos del Estado y la cotización solidaria del régimen contributivo. La afiliación se determina por el SISBÉN.",
    category: "salud",
    related: ["EPS", "Régimen contributivo", "SISBÉN"],
  },
  {
    term: "SISBÉN",
    shortDef:
      "Sistema que clasifica a los hogares por nivel de pobreza para focalizar subsidios.",
    longDef:
      "Sistema de Identificación de Potenciales Beneficiarios de Programas Sociales. Clasifica a los hogares en grupos (A, B, C, D) según ingresos, condiciones de la vivienda y otras variables, para focalizar los subsidios estatales.",
    category: "instituciones",
    related: ["Régimen subsidiado", "Familias en Acción"],
  },
  {
    term: "Reforma a la salud",
    shortDef:
      "Cambio estructural al sistema de salud. El gobierno Petro propuso reducir el rol de las EPS.",
    longDef:
      "Cambio estructural al sistema de salud creado por la Ley 100 de 1993. La reforma del gobierno Petro (radicada en 2023, hundida en Senado en 2024) buscaba reemplazar gradualmente a las EPS por gestoras de salud bajo control de la ADRES y reorganizar la atención primaria.",
    category: "salud",
    related: ["EPS", "Ley 100", "ADRES"],
  },
  {
    term: "Reforma laboral",
    shortDef:
      "Cambio a las leyes de empleo: jornada, horas extra, dominicales, contratos, sindicatos.",
    longDef:
      "Modificación al Código Sustantivo del Trabajo. Toca temas como jornada laboral (horario diurno y nocturno), recargos por dominicales y festivos, tipos de contrato, tercerización, derechos sindicales y formalización del empleo. La reforma del gobierno Petro fue aprobada parcialmente en 2025.",
    category: "economia",
    related: ["Salario mínimo", "Sindicatos"],
  },
  {
    term: "Reforma pensional",
    shortDef:
      "Cambio al sistema de pensiones. La reforma de 2024 creó un sistema de pilares.",
    longDef:
      "Cambio al sistema pensional. La Ley 2381 de 2024 creó un sistema de pilares (solidario, semicontributivo, contributivo y voluntario) en el que Colpensiones recibe los aportes hasta 2.3 salarios mínimos y los fondos privados administran lo que esté por encima.",
    category: "economia",
    related: ["Colpensiones", "Fondos privados", "Bono pensional"],
  },
  {
    term: "Colpensiones",
    shortDef:
      "Administradora pública del régimen de prima media. Paga pensiones bajo el modelo público.",
    longDef:
      "Administradora Colombiana de Pensiones. Es la entidad estatal que administra el régimen de prima media con prestación definida (RPM). En este régimen, los aportes van a un fondo común y la pensión depende de las semanas cotizadas y el ingreso base de liquidación.",
    category: "instituciones",
    related: ["Reforma pensional", "Fondos privados"],
  },
  {
    term: "Fracking",
    shortDef:
      "Técnica de extracción de hidrocarburos mediante fractura hidráulica de roca subterránea.",
    longDef:
      "Fractura hidráulica. Técnica de extracción de petróleo y gas que consiste en inyectar agua, arena y químicos a alta presión en yacimientos de roca compacta para liberar los hidrocarburos. Su uso está prohibido en Colombia desde 2024 mediante la Ley 2294, salvo proyectos piloto previos.",
    category: "ambiente",
    related: ["Transición energética", "Petróleo"],
  },
  {
    term: "Transición energética",
    shortDef:
      "Cambio gradual de fuentes de energía fósil (petróleo, carbón) a renovables (solar, eólica).",
    longDef:
      "Proceso de cambio progresivo de la matriz energética hacia fuentes renovables (solar, eólica, hidroeléctrica) y desincentivo gradual de los hidrocarburos y el carbón. Es eje central del debate ambiental y económico, dado el peso del petróleo en exportaciones y fiscales.",
    category: "ambiente",
    related: ["Fracking", "Petróleo", "Cambio climático"],
  },
  {
    term: "Reforma rural integral",
    shortDef:
      "Primer punto del Acuerdo de Paz: titulación de tierras, catastro y desarrollo del campo.",
    longDef:
      "Primer punto del Acuerdo de Paz de 2016. Plantea formalizar 7 millones de hectáreas, distribuir 3 millones a campesinos sin tierra, actualizar el catastro multipropósito, implementar Programas de Desarrollo con Enfoque Territorial (PDET) y cerrar la brecha rural-urbana.",
    category: "politicas",
    related: ["Acuerdo de Paz", "PDET", "Catastro multipropósito"],
  },
  {
    term: "Catastro multipropósito",
    shortDef:
      "Actualización del registro de predios rurales y urbanos para fines fiscales y sociales.",
    longDef:
      "Sistema integral de información sobre tierras (predios, propietarios, usos del suelo, valores). Permite calcular impuestos prediales actualizados, formalizar propietarios y planificar el desarrollo territorial. Su implementación viene retrasada respecto a las metas del Acuerdo de Paz.",
    category: "instituciones",
    related: ["Reforma rural integral", "Impuesto predial"],
  },
  {
    term: "Plan de Desarrollo",
    shortDef:
      "Hoja de ruta cuatrienal del gobierno con sus metas, programas y presupuesto.",
    longDef:
      "Documento que cada gobierno presenta al inicio de su mandato (en los primeros 6 meses) con las metas, estrategias e inversiones del cuatrienio. Debe ser aprobado por el Congreso como ley. El del gobierno Petro fue la Ley 2294 de 2023.",
    category: "instituciones",
    related: ["Presupuesto General", "DNP"],
  },
  {
    term: "Curules",
    shortDef:
      "Asientos en cuerpos colegiados (Senado, Cámara, Asamblea, Concejo).",
    longDef:
      "Cada uno de los puestos en una corporación pública de elección popular. El Senado tiene 108 curules (incluyendo 2 para indígenas y las de paz), la Cámara 188 (con representación territorial, indígena, afro, exterior y de paz).",
    category: "politicas",
    related: ["Cifra repartidora", "Umbral electoral", "Congreso"],
  },
  {
    term: "Bancada",
    shortDef:
      "Grupo de congresistas que pertenecen al mismo partido y deben actuar coordinadamente.",
    longDef:
      "Conjunto de congresistas de un mismo partido. Por ley deben actuar como bancada en las votaciones (con excepciones por objeción de conciencia). El partido decide la posición y la disciplina interna.",
    category: "politicas",
    related: ["Partidos políticos", "Curules", "Congreso"],
  },
  {
    term: "Congreso",
    shortDef:
      "Rama legislativa del poder público en Colombia, compuesta por Senado y Cámara de Representantes.",
    longDef:
      "Rama legislativa, compuesta por el Senado (108 curules) y la Cámara de Representantes (188 curules). Hace las leyes, controla políticamente al gobierno, aprueba el presupuesto y los planes de desarrollo, y elige a varios altos funcionarios.",
    category: "instituciones",
    related: ["Senado", "Cámara de Representantes", "Bancada"],
  },
  {
    term: "Constitución",
    shortDef:
      "Norma jurídica suprema del país. La actual fue expedida en 1991.",
    longDef:
      "Es la norma jurídica suprema del Estado. La Constitución vigente fue expedida por la Asamblea Constituyente en 1991 y reemplazó a la de 1886. Define la estructura del Estado, los derechos fundamentales y los mecanismos de participación.",
    category: "instituciones",
    related: ["Asamblea Constituyente", "Corte Constitucional"],
  },
  {
    term: "Corte Constitucional",
    shortDef:
      "Alto tribunal que vela por la integridad de la Constitución y revisa la constitucionalidad de las leyes.",
    longDef:
      "Tribunal de cierre en materia constitucional. Decide sobre la exequibilidad de leyes y actos legislativos, revisa tutelas y unifica la jurisprudencia constitucional. Sus 9 magistrados son elegidos por el Senado de ternas presentadas por el presidente, la Corte Suprema y el Consejo de Estado.",
    category: "instituciones",
    related: ["Constitución", "Tutela"],
  },
  {
    term: "Tutela",
    shortDef:
      "Acción judicial rápida para proteger derechos fundamentales vulnerados.",
    longDef:
      "Acción de tutela. Mecanismo creado por la Constitución de 1991 para que cualquier persona reclame ante un juez la protección inmediata de sus derechos fundamentales. El juez debe decidir en máximo 10 días.",
    category: "instituciones",
    related: ["Corte Constitucional", "Constitución"],
  },
  {
    term: "TLC",
    shortDef:
      "Tratado de Libre Comercio. Acuerdo entre países para reducir aranceles y barreras al comercio.",
    longDef:
      "Tratado de Libre Comercio. Acuerdo bilateral o multilateral que reduce o elimina aranceles, cuotas y otras barreras al comercio entre los países firmantes. Colombia tiene TLC vigentes con Estados Unidos, la UE, México, Chile, Canadá, Corea del Sur y otros.",
    category: "economia",
    related: ["Aranceles", "Política comercial"],
  },
  {
    term: "Marco fiscal",
    shortDef:
      "Documento del Ministerio de Hacienda con la proyección de ingresos y gastos del Estado a 10 años.",
    longDef:
      "Marco Fiscal de Mediano Plazo. Documento técnico del Ministerio de Hacienda que proyecta los ingresos y gastos del gobierno nacional a 10 años. Es la base para preparar el presupuesto anual y debe respetar la regla fiscal.",
    category: "economia",
    related: ["Regla fiscal", "Presupuesto General"],
  },
  {
    term: "Regla fiscal",
    shortDef:
      "Ley que limita el déficit del gobierno para mantener la sostenibilidad de la deuda pública.",
    longDef:
      "Norma que fija un límite al déficit fiscal del gobierno nacional. Su objetivo es mantener la sostenibilidad de la deuda y la confianza de los inversionistas. Su cumplimiento es vigilado por el Comité Autónomo de la Regla Fiscal (CARF).",
    category: "economia",
    related: ["Marco fiscal", "Deuda pública"],
  },
]

export const GLOSSARY: GlossaryEntry[] = RAW_GLOSSARY.map((entry) => ({
  ...entry,
  slug: slugify(entry.term),
})).sort((a, b) => a.term.localeCompare(b.term, "es"))

const TERM_INDEX: Map<string, GlossaryEntry> = (() => {
  const map = new Map<string, GlossaryEntry>()
  for (const entry of GLOSSARY) {
    map.set(entry.term.toLowerCase(), entry)
    map.set(slugify(entry.term), entry)
  }
  return map
})()

export function getGlossaryEntry(term: string): GlossaryEntry | undefined {
  return TERM_INDEX.get(term.toLowerCase()) ?? TERM_INDEX.get(slugify(term))
}
