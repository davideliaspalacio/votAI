import { ImageResponse } from "@vercel/og"
import { type NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const candidate = searchParams.get("candidate") ?? "Tu candidato"
  const score = searchParams.get("score") ?? "?"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0B0F",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#FFDE3A",
            }}
          >
            ⚡ VotoLoco
          </div>
        </div>

        <div
          style={{
            fontSize: "24px",
            color: "#A1A1AA",
            marginBottom: "20px",
          }}
        >
          Mi mayor afinidad programática es con
        </div>

        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#FAFAFA",
            marginBottom: "16px",
          }}
        >
          {candidate}
        </div>

        <div
          style={{
            fontSize: "80px",
            fontWeight: 700,
            color: "#FFDE3A",
            marginBottom: "30px",
          }}
        >
          {score}%
        </div>

        <div
          style={{
            fontSize: "18px",
            color: "#71717A",
            textAlign: "center",
          }}
        >
          Descubre tu afinidad en votoloco.com • No es una encuesta
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
