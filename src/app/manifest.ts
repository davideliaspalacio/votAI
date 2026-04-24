import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VotoLoco - Test de Afinidad Programática",
    short_name: "VotoLoco",
    description:
      "Descubre qué candidato presidencial de Colombia 2026 se alinea con lo que piensas.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0B0F",
    theme_color: "#0B0B0F",
    icons: [
      {
        src: "/votolocoimage.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
