import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ElectoralSilenceBanner } from "@/components/common/ElectoralSilenceBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://votoloco.com"),
  title: {
    default: "VotoLoco - 10 preguntas. Tu candidato real. Sin enredos.",
    template: "%s | VotoLoco",
  },
  description:
    "Descubre qué candidato presidencial de Colombia 2026 se alinea con lo que piensas. Test de afinidad programática basado en propuestas reales. No es una encuesta.",
  keywords: [
    "elecciones Colombia 2026",
    "candidatos presidenciales",
    "afinidad programática",
    "test político Colombia",
    "propuestas candidatos 2026",
    "Iván Cepeda",
    "Abelardo de la Espriella",
    "Paloma Valencia",
    "Claudia López",
    "Sergio Fajardo",
    "Roy Barreras",
    "voto en blanco",
    "elecciones presidenciales Colombia",
  ],
  publisher: "VotoLoco",
  alternates: {
    canonical: "https://votoloco.com",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://votoloco.com",
    siteName: "VotoLoco",
    title: "VotoLoco - ¿Estás seguro por quién vas a votar?",
    description:
      "Responde 10 preguntas y descubre qué candidato presidencial de Colombia 2026 se alinea con lo que piensas. Basado en propuestas reales. No es una encuesta.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "VotoLoco - Test de afinidad programática Colombia 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VotoLoco - ¿Estás seguro por quién vas a votar?",
    description:
      "Responde 10 preguntas y descubre tu afinidad con los candidatos presidenciales de Colombia 2026.",
    images: ["/api/og"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0F",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "VotoLoco",
  url: "https://votoloco.com",
  description:
    "Test de afinidad programática para las elecciones presidenciales de Colombia 2026. Responde 10 preguntas y descubre qué candidato se alinea con lo que piensas.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  inLanguage: "es-CO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} dark`}
    >
      <body className="min-h-dvh flex flex-col noise-bg">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main-content" className="skip-link">
          Ir al contenido principal
        </a>
        <ElectoralSilenceBanner />
        <div id="main-content" className="relative flex flex-1 flex-col">
          {children}
        </div>
        <Analytics />
        <SpeedInsights />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#14141B",
              border: "1px solid #2A2A3A",
              color: "#FAFAFA",
            },
          }}
        />
      </body>
    </html>
  );
}
