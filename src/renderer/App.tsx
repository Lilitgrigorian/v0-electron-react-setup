"use client"

import { useEffect, useState } from "react"
import Dashboard from "./components/Dashboard"

export default function App() {
  const [page, setPage] = useState<"dashboard">("dashboard")

  useEffect(() => {
    const hash = window.location.hash.slice(1) || "dashboard"
    setPage(hash as any)
  }, [])

  return <div>{page === "dashboard" ? <Dashboard /> : <Dashboard />}</div>
}
