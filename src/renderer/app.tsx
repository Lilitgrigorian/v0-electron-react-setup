"use client"

import { useEffect, useState } from "react"
import CommandPalette from "./components/CommandPalette"
import TranslatorWidget from "./widgets/TranslatorWidget"

export default function App() {
  const [page, setPage] = useState<"translator" | "command-palette">("command-palette")

  useEffect(() => {
    const hash = window.location.hash.slice(1) || "command-palette"
    setPage(hash as any)
  }, [])

  if (page === "translator") {
    return <TranslatorWidget />
  }

  return <CommandPalette />
}
