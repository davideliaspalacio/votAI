import { ImageResponse } from "@vercel/og"
import { type NextRequest } from "next/server"

export const runtime = "edge"

const SITE = "https://votoloco.com"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const candidate = searchParams.get("candidate")
  const score = searchParams.get("score")

  const isResult = candidate && score

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
          background: "linear-gradient(135deg, #0c0c18 0%, #161630 100%)",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Barra decorativa superior */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "linear-gradient(90deg, #FFDE3A 0%, #f59e0b 50%, #FFDE3A 100%)",
          }}
        />

        {/* Logo grande */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${SITE}/votolocoimage.png`}
            alt="VotoLoco"
            width={120}
            height={120}
          />
          <div
            style={{
              fontSize: "96px",
              fontWeight: 900,
              color: "#FFDE3A",
              lineHeight: 1,
              letterSpacing: "-2px",
            }}
          >
            VotoLoco
          </div>
        </div>

        {isResult ? (
          <>
            <div
              style={{
                fontSize: "28px",
                color: "#A1A1AA",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Mi mayor afinidad programática es con
            </div>
            <div
              style={{
                fontSize: "64px",
                fontWeight: 700,
                color: "#FAFAFA",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              {candidate}
            </div>
            <div
              style={{
                fontSize: "96px",
                fontWeight: 900,
                color: "#FFDE3A",
                marginBottom: "30px",
              }}
            >
              {score}%
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: "44px",
                fontWeight: 700,
                color: "#FAFAFA",
                marginBottom: "20px",
                textAlign: "center",
                maxWidth: "900px",
                lineHeight: 1.2,
              }}
            >
              ¿Estás seguro por quién vas a votar?
            </div>
            <div
              style={{
                fontSize: "26px",
                color: "#A1A1AA",
                marginBottom: "40px",
                textAlign: "center",
                maxWidth: "800px",
              }}
            >
              Responde 10 preguntas y descubre tu afinidad con los candidatos presidenciales de Colombia 2026
            </div>
            <div
              style={{
                fontSize: "20px",
                color: "#71717A",
                textAlign: "center",
              }}
            >
              Test de afinidad programática · No es una encuesta
            </div>
          </>
        )}

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            fontSize: "22px",
            fontWeight: 700,
            color: "#FFDE3A",
            textAlign: "center",
          }}
        >
          votoloco.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
