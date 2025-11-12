"use client"
import { useRouter } from "next/router"
import CommandPalette from "./components/CommandPalette"
import TranslatorWidget from "./widgets/TranslatorWidget"

export default function App() {
  const router = useRouter()
  const { page } = router.query

  if (page === "translator") {
    return <TranslatorWidget />
  }

  return <CommandPalette />
}
