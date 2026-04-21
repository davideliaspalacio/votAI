import type { Metadata } from "next"
import { Header } from "@/components/common/Header"
import { LegalFooter } from "@/components/common/LegalFooter"
import { Disclaimer } from "@/components/common/Disclaimer"

export const metadata: Metadata = {
  title: "Metodología",
  description:
    "Cómo funciona VotoLoco: metodología del test de afinidad programática, fuentes de datos, limitaciones y tratamiento de datos personales.",
}

export default function MetodologiaPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <article className="mx-auto max-w-3xl flex-1 px-4 py-12">
        <h1 className="font-display text-display-sm font-bold text-text md:text-display-md">
          Metodología
        </h1>
        <p className="mt-4 text-lg text-text-muted">
          Transparencia total sobre cómo funciona VotoLoco.
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-text-muted">
          <section>
            <h2 className="mb-3 font-display text-xl font-bold text-text">
              1. ¿De dónde vienen las preguntas?
            </h2>
            <p>
              Las 10 preguntas del test cubren los ejes temáticos más relevantes
              para las elecciones presidenciales de Colombia 2026: economía,
              salud, educación, seguridad, ambiente, política social, política
              exterior, reforma política, empleo y tecnología. Cada pregunta
              fue diseñada para capturar una postura concreta sobre un tema de
              política pública donde los candidatos tienen posiciones
              diferenciables.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold text-text">
              2. ¿Cómo se determinan las posiciones de los candidatos?
            </h2>
            <p>
              Las posiciones de cada candidato se extraen exclusivamente de sus
              programas de gobierno oficiales publicados ante las autoridades
              electorales. Se utiliza inteligencia artificial para clasificar
              las propuestas en los 10 ejes temáticos y determinar la posición
              del candidato en cada uno, con citas textuales del programa y
              número de página como respaldo.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold text-text">
              3. ¿Cómo se calcula la afinidad?
            </h2>
            <p>
              Tu afinidad con cada candidato se calcula comparando tus
              respuestas (escala Likert 1-5) con las posiciones del candidato
              en cada eje. El sistema pondera cada eje según la importancia
              que tú le asignaste (1-3). Se utiliza una combinación de
              embeddings semánticos y clasificación por IA para generar un
              puntaje de afinidad de 0 a 100 por candidato.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold text-text">
              4. ¿Por qué NO es una encuesta?
            </h2>
            <p>
              VotoLoco <strong className="text-text">NO</strong> es una encuesta
              electoral y <strong className="text-text">NO</strong> está
              registrada ante el Consejo Nacional Electoral (CNE) porque no lo
              es. Una encuesta electoral mide intención de voto preguntando
              directamente &ldquo;¿por quién va a votar?&rdquo;. VotoLoco mide
              afinidad programática: compara tus posiciones en temas concretos
              con las propuestas publicadas por cada candidato.
            </p>
            <p className="mt-3">
              VotoLoco no predice resultados electorales, no mide intención de
              voto y no constituye una recomendación de voto. Los resultados
              individuales reflejan la cercanía entre las respuestas del usuario
              y las propuestas oficiales de los candidatos, nada más.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold text-text">
              5. Modelos de IA utilizados
            </h2>
            <p>
              Utilizamos modelos de lenguaje para: (a) clasificar propuestas de
              los programas de gobierno en los 10 ejes temáticos, (b) generar
              resúmenes neutrales de las posiciones de cada candidato, y
              (c) calcular la afinidad entre las respuestas del usuario y las
              posiciones de los candidatos.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold text-text">
              6. Limitaciones conocidas
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Las posiciones de los candidatos se basan en sus programas
                escritos, que pueden diferir de sus declaraciones verbales o
                de su trayectoria política.
              </li>
              <li>
                10 preguntas no capturan toda la complejidad del espectro
                político. Es una aproximación, no una medida exacta.
              </li>
              <li>
                Los modelos de IA pueden cometer errores de clasificación.
                Cada resultado incluye citas textuales del programa para que
                puedas verificar.
              </li>
              <li>
                Los usuarios de VotoLoco son una muestra autoseleccionada de
                personas con acceso a internet, no una muestra representativa
                de la población colombiana.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold text-text">
              7. Tratamiento de datos personales
            </h2>
            <p>
              En cumplimiento de la Ley 1581 de 2012 (Habeas Data) y el
              Decreto 1377 de 2013:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-text">No pedimos cédula</strong> ni
                ningún dato personal identificable.
              </li>
              <li>
                Los datos demográficos (rango de edad, región, género) son
                voluntarios y se almacenan de forma anónima y agregada.
              </li>
              <li>
                La preferencia inicial declarada se usa únicamente para la
                métrica de &ldquo;gap&rdquo; (diferencia entre preferencia e
                afinidad) en datos agregados.
              </li>
              <li>
                No utilizamos cookies de seguimiento. El analytics se realiza
                con herramientas privacy-first sin tracking individual.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold text-text">
              8. Contacto
            </h2>
            <p>
              Si tienes preguntas, sugerencias o detectas un error, escríbenos
              a{" "}
              <a
                href="mailto:hola@vot-ai.vercel.app"
                className="text-primary underline underline-offset-4"
              >
                hola@vot-ai.vercel.app
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Disclaimer variant="full" />
        </div>
      </article>
      <LegalFooter />
    </div>
  )
}
