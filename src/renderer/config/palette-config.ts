import type { Widget, Action } from "../types"

let cachedWidgets: Widget[] | null = null
let cachedActions: Action[] | null = null

export async function getWidgets(): Promise<Widget[]> {
  if (cachedWidgets) return cachedWidgets

  try {
    cachedWidgets = await window.electron.invoke("get-widgets")
    return cachedWidgets ?? [];
  } catch (error) {
    console.error("Failed to fetch widgets:", error)
    return []
  }
}

export async function getQuickActions(): Promise<Action[]> {
  if (cachedActions) return cachedActions

  try {
    cachedActions = await window.electron.invoke("get-quick-actions")
    return cachedActions ?? [];
  } catch (error) {
    console.error("Failed to fetch actions:", error)
    return []
  }
  
}

// Keep these for backwards compatibility during migration
export const WIDGETS: Widget[] = []
export const QUICK_ACTIONS: Action[] = []
