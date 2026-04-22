"use client"

import { forwardRef } from "react"
import { User } from "lucide-react"
import { mockCandidates } from "@/lib/mock/candidates"
import type { CandidateResult } from "@/types/domain"

interface ShareStoryCardProps {
  results: CandidateResult[]
  initialPreference: string
  preferenceMatch: boolean
}

export const ShareStoryCard = forwardRef<HTMLDivElement, ShareStoryCardProps>(
  function ShareStoryCard({ results, initialPreference, preferenceMatch }, ref) {
    const host = typeof window !== "undefined" ? window.location.host : ""
    const allCandidates = results.map((r) => ({
      ...r,
      candidate: mockCandidates.find((c) => c.id === r.candidateId),
    }))

    const specialPreference = ["undecided", "blank", "na"].includes(initialPreference)
    const initialCandidate = mockCandidates.find((c) => c.id === initialPreference)
    const initialNotInTop3 = !specialPreference && initialCandidate && !results.slice(0, 3).find((r) => r.candidateId === initialCandidate.id)
    const initialResult = initialNotInTop3 ? results.find((r) => r.candidateId === initialCandidate?.id) : null
    const initialRank = initialResult ? results.findIndex((r) => r.candidateId === initialCandidate?.id) + 1 : 0

    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1920,
          background: "linear-gradient(180deg, #0c0c18 0%, #161630 100%)",
          padding: "60px 48px",
          display: "flex",
          flexDirection: "column",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#fafafa",
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}
      >
        {/* Barra decorativa */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #7c3aed, #f59e0b, #7c3aed)",
          }}
        />

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img
            src="/votolocoimage.png"
            alt=""
            style={{ width: 100, height: 100, margin: "0 auto 16px" }}
          />
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#666",
              letterSpacing: 4,
              textTransform: "uppercase" as const,
            }}
          >
            {host}
          </div>
        </div>

        {/* Badge match/gap */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "12px 28px",
              borderRadius: 50,
              fontSize: 24,
              fontWeight: 700,
              color: preferenceMatch ? "#22c55e" : "#f59e0b",
              backgroundColor: preferenceMatch ? "#22c55e15" : "#f59e0b15",
              border: `2px solid ${preferenceMatch ? "#22c55e40" : "#f59e0b40"}`,
            }}
          >
            {preferenceMatch
              ? "✓ Tu preferencia y tu afinidad coinciden"
              : "⚡ Tu preferencia y tu afinidad NO coinciden"}
          </span>
        </div>

        {/* Candidato elegido (si no está en top) */}
        {initialNotInTop3 && initialCandidate && initialResult && (
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                textAlign: "center",
                fontSize: 20,
                color: "#999",
                marginBottom: 12,
              }}
            >
              Tu candidato elegido
            </div>
            <CandidateRow
              name={initialCandidate.name}
              party={initialCandidate.party}
              color={initialCandidate.color}
              photo={initialCandidate.photo}
              score={initialResult.score}
              rank={initialRank}
              isFirst={false}
              isDashed
            />
            <div
              style={{
                height: 1,
                background: "#2a2a40",
                margin: "24px 40px",
              }}
            />
          </div>
        )}

        {/* Titulo ranking */}
        <div
          style={{
            textAlign: "center",
            fontSize: 26,
            color: "#999",
            marginBottom: 20,
          }}
        >
          Ranking de afinidad programática
        </div>

        {/* Todos los candidatos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          {allCandidates.map((item, i) => {
            if (!item.candidate) return null
            if (initialNotInTop3 && item.candidateId === initialCandidate?.id) return null
            return (
              <CandidateRow
                key={item.candidateId}
                name={item.candidate.name}
                party={item.candidate.party}
                color={item.candidate.color}
                photo={item.candidate.photo}
                score={item.score}
                rank={i + 1}
                isFirst={i === 0}
              />
            )
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <div style={{ fontSize: 22, color: "#555" }}>
            Descubre tu afinidad programática
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#7c3aed",
              marginTop: 8,
            }}
          >
            {host}
          </div>
          <div style={{ fontSize: 18, color: "#444", marginTop: 16 }}>
            David E. Palacio · Ing. Software &amp; IA | Ricardo Palacio · Estratega de Producto
          </div>
        </div>
      </div>
    )
  }
)

function CandidateRow({
  name,
  party,
  color,
  photo,
  score,
  rank,
  isFirst,
  isDashed,
}: {
  name: string
  party: string
  color: string
  photo?: string
  score: number
  rank: number
  isFirst: boolean
  isDashed?: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "18px 24px",
        borderRadius: 20,
        border: `${isFirst ? 3 : 2}px ${isDashed ? "dashed" : "solid"} ${isFirst ? color + "80" : isDashed ? color + "60" : "#2a2a45"}`,
        backgroundColor: isFirst ? color + "15" : "#1a1a30",
      }}
    >
      {/* Badge */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          backgroundColor: isFirst ? "#7c3aed" : "#2a2a45",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 20,
          fontWeight: 700,
          color: "#fff",
        }}
      >
        {rank}
      </div>

      {/* Avatar */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          backgroundColor: color + "25",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          />
        ) : (
          <User style={{ width: 24, height: 24, color }} />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: isFirst ? 28 : 24,
            fontWeight: isFirst ? 700 : 500,
            color: "#fff",
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 18, color: "#777", marginTop: 2 }}>
          {party}
        </div>
      </div>

      {/* Score */}
      <div
        style={{
          fontSize: isFirst ? 44 : 36,
          fontWeight: 700,
          color: isFirst ? "#7c3aed" : "#bbb",
          flexShrink: 0,
        }}
      >
        {score}%
      </div>
    </div>
  )
}
