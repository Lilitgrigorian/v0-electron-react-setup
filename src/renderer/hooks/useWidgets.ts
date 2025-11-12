"use client"

import { useState, useCallback } from "react"
import type { Widget } from "../types"

export const useWidgets = () => {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [loading, setLoading] = useState(false)

  const loadWidgets = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch widgets from main process
      const result = await window.electron.ipcRenderer.invoke("get-widgets")
      setWidgets(result)
    } catch (error) {
      console.error("Failed to load widgets:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  return { widgets, loading, loadWidgets }
}
