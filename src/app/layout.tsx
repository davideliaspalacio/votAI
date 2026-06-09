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
    default: "VotoLoco - Segunda vuelta 2026: ¿con cuál plan coincides?",
    template: "%s | VotoLoco",
  },
  description:
    "Segunda vuelta presidencial de Colombia 2026. Responde 10 preguntas y descubre con cuál de los dos planes de gobierno —Cepeda o Abelardo— tienes más afinidad programática. No es una encuesta.",
  keywords: [
    "segunda vuelta Colombia 2026",
    "balotaje presidencial 2026",
    "segunda vuelta 21 de junio 2026",
    "Iván Cepeda",
    "Abelardo de la Espriella",
    "Cepeda o Abelardo",
    "afinidad programática",
    "test político Colombia",
    "planes de gobierno Cepeda Abelardo",
    "voto en blanco segunda vuelta",
    "elecciones presidenciales Colombia 2026",
  ],
  authors: [{ name: "David Elias Palacio" }],
  creator: "David Elias Palacio",
  publisher: "VotoLoco",
  alternates: {
    canonical: "https://votoloco.com",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://votoloco.com",
    siteName: "VotoLoco",
    title: "Segunda vuelta 2026: ¿con cuál plan coincides?",
    description:
      "Casi 8 de cada 10 votan distinto a su plan de gobierno. Responde 10 preguntas y descubre tu afinidad real en la segunda vuelta de Colombia 2026: Cepeda o Abelardo. No es una encuesta.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "VotoLoco - Afinidad programática · Segunda vuelta Colombia 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Segunda vuelta 2026: ¿con cuál plan coincides?",
    description:
      "Responde 10 preguntas y descubre tu afinidad con los planes de Cepeda y Abelardo en la segunda vuelta de Colombia 2026.",
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
    "Test de afinidad programática para la segunda vuelta presidencial de Colombia 2026. Responde 10 preguntas y descubre con cuál de los dos planes —Cepeda o Abelardo— tienes más afinidad.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "All",
  author: {
    "@type": "Person",
    name: "David Elias Palacio",
    url: "https://www.davidpalacio.dev/",
  },
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
