"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { formatNumber } from "@/lib/utils"

export function SessionCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    api
      .getSessionCount()
      .then((data) => setCount(data.total_sessions))
      .catch(() => setCount(null))
  }, [])

  if (count === null || count <= 0) return null

  return (
    <p
      className="mt-6 text-sm text-text-subtle animate-fade-up"
      style={{ animationDelay: "0.5s" }}
    >
      <span className="font-display font-semibold text-primary">
        {formatNumber(count)}+
      </span>{" "}
      colombianos ya descubrieron su afinidad programática
    </p>
  )
}
