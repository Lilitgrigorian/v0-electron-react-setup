"use client"

import { useState, useEffect, useRef } from "react"
import { Search, ArrowRight } from "lucide-react"
import type { Widget, Action, PaletteItem } from "../types"
import { getWidgets, getQuickActions } from "../config/palette-config"
import InlineResult from "./InlineResult"
import WidgetRenderer from "./WidgetRenderer"

export default function CommandPalette() {
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [inlineResult, setInlineResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [openWidget, setOpenWidget] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadData = async () => {
      const [w, a] = await Promise.all([getWidgets(), getQuickActions()])
      setWidgets(w)
      setActions(a)
    }
    loadData()
  }, [])

  const suggestedItems: PaletteItem[] = widgets.slice(0, 3).map((w) => ({
    id: w.id,
    label: w.label,
    icon: w.icon,
    type: "suggested",
  }))

  const widgetItems: PaletteItem[] = widgets.map((w) => ({
    id: w.id,
    label: w.label,
    icon: w.icon,
    type: "widget",
  }))

  const actionItems: PaletteItem[] = actions.map((a) => ({
    ...a,
    type: "action",
    icon: a.icon || "→",
  }))

  const allItems = [...suggestedItems, ...widgetItems, ...actionItems]

  const filteredSuggested = suggestedItems.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
  const filteredWidgets = widgetItems.filter(
    (item) => item.label.toLowerCase().includes(search.toLowerCase()) && !suggestedItems.find((s) => s.id === item.id),
  )
  const filteredActions = actionItems.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % allItems.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        handleSelect(allItems[selectedIndex])
      } else if (e.key === "Escape") {
        window.close()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex])

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  const handleSelect = async (item: PaletteItem) => {
    setInlineResult(null)
    if (item.type === "action") {
      setLoading(true)
      try {
        const result = await window.electron.invoke("execute-action", { actionId: item.id })
        setInlineResult(result.text || "")
      } catch (error) {
        console.error("Error executing action:", error)
      } finally {
        setLoading(false)
      }
    } else if (item.type === "widget") {
      setOpenWidget(item.id)
    }
  }

  const renderSection = (title: string, items: PaletteItem[]) => {
    if (items.length === 0) return null
    return (
      <div key={title} className="mb-4">
        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        {items.map((item) => {
          const globalIndex = allItems.indexOf(item)
          const isSelected = globalIndex === selectedIndex
          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`mx-2 px-3 py-2 rounded-md flex items-center justify-between cursor-pointer transition-colors ${
                isSelected ? "bg-blue-50 text-blue-900" : "hover:bg-gray-50 text-gray-900"
              }`}
            >
              <span className="flex items-center gap-2 text-sm">
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </span>
              {item.type === "action" && <ArrowRight className="w-4 h-4 text-gray-400" />}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 border-r border-gray-200 flex flex-col">
        <div className="border-b border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setSelectedIndex(0)
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {search ? (
            <>
              {renderSection("Suggested", filteredSuggested)}
              {renderSection("Widgets", filteredWidgets)}
              {renderSection("Actions", filteredActions)}
            </>
          ) : (
            <>
              {renderSection("Suggested", suggestedItems)}
              {renderSection("Widgets", widgetItems)}
              {renderSection("Actions", actionItems)}
            </>
          )}
        </div>
      </div>

      {inlineResult && <InlineResult result={inlineResult} loading={loading} />}
      {openWidget && <WidgetRenderer widgetId={openWidget} onClose={() => setOpenWidget(null)} />}
    </div>
  )
}
