import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFeatureFlag(flag: string): boolean {
  return process.env[`NEXT_PUBLIC_${flag}`] === "true"
}

export function isElectoralSilence(): boolean {
  return getFeatureFlag("ELECTORAL_SILENCE")
}

export function showPublicStats(): boolean {
  return getFeatureFlag("SHOW_PUBLIC_STATS")
}

export function useMocks(): boolean {
  return getFeatureFlag("USE_MOCKS")
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("es-CO").format(n)
}

export function formatPercent(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(n / 100)
}
