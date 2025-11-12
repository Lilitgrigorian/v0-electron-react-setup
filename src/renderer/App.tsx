"use client"

import { useEffect, useState } from "react"
import CommandPalette from "./components/CommandPalette"
import Dashboard from "./components/Dashboard"

export default function App() {
  const [page, setPage] = useState<"dashboard" | "command-palette">("dashboard")

  useEffect(() => {
    const hash = window.location.hash.slice(1) || "dashboard"
    setPage(hash as any)
  }, [])

  return <div>{page === "dashboard" ? <Dashboard /> : <CommandPalette />}</div>
}
