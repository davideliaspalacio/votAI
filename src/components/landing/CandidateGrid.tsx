import Link from "next/link"
import Image from "next/image"
import { mockCandidates } from "@/lib/mock/candidates"
import { shuffleArray } from "@/lib/utils"
import { User } from "lucide-react"

export function CandidateGrid() {
  const candidates = shuffleArray(mockCandidates)

  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-display-sm font-bold text-text md:text-display-md">
          Los candidatos
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-text-muted">
          Orden aleatorio. Sin rankings. Sin favoritos. Solo propuestas.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {candidates.map((candidate, i) => (
            <div
              key={candidate.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <Link
                href={`/candidato/${candidate.slug}`}
                className="group block rounded-brutal border-2 border-surface-border bg-surface p-4 transition-all hover:-translate-y-1 hover:border-surface-hover hover:shadow-glow"
              >
                <div
                  className="mb-3 flex size-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: candidate.color + "20" }}
                >
                  {candidate.photo ? (
                    <Image
                      src={candidate.photo}
                      alt={candidate.name}
                      width={56}
                      height={56}
                      className="size-full rounded-full object-cover"
                    />
                  ) : (
                    <User
                      className="size-7"
                      style={{ color: candidate.color }}
                    />
                  )}
                </div>
                <h3 className="font-display text-sm font-bold text-text group-hover:text-primary transition-colors">
                  {candidate.name}
                </h3>
                <p className="mt-1 text-xs text-text-subtle">
                  {candidate.party}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
