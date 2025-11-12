"use client"

import type React from "react"
import TranslatorWidget from "../widgets/TranslatorWidget"
import { X } from "lucide-react"

interface WidgetRendererProps {
  widgetId: string
  onClose: () => void
}

const WIDGET_COMPONENTS: { [key: string]: React.ComponentType<any> } = {
  translator: TranslatorWidget,
  // Add other widget components here as they're implemented
  // dictionary: DictionaryWidget,
  // 'text-counter': TextCounterWidget,
  // etc.
}

export default function WidgetRenderer({ widgetId, onClose }: WidgetRendererProps) {
  const Component = WIDGET_COMPONENTS[widgetId]

  if (!Component) {
    return (
      <div className="w-96 h-96 bg-white border-l border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Widget not found: {widgetId}</p>
      </div>
    )
  }

  return (
    <div className="w-96 border-l border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Widget</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md">
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Component />
      </div>
    </div>
  )
}
