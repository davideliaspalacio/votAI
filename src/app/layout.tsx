import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
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
    "test político",
    "propuestas candidatos",
  ],
  authors: [{ name: "VotoLoco" }],
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://votoloco.com",
    siteName: "VotoLoco",
    title: "VotoLoco - 10 preguntas. Tu candidato real. Sin enredos.",
    description:
      "Descubre qué candidato se alinea con lo que piensas. Test de afinidad programática basado en propuestas reales.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VotoLoco - Tu candidato real en 10 preguntas",
    description:
      "Descubre tu afinidad programática con los candidatos presidenciales de Colombia 2026.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0F",
  width: "device-width",
  initialScale: 1,
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
        <a href="#main-content" className="skip-link">
          Ir al contenido principal
        </a>
        <ElectoralSilenceBanner />
        <div id="main-content" className="relative z-10 flex flex-1 flex-col">
          {children}
        </div>
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
