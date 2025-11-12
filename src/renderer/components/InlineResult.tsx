"use client"

import { useEffect, useState } from "react"
import { Copy, Check } from "lucide-react"

interface InlineResultProps {
  result: string
  loading?: boolean
}

export default function InlineResult({ result, loading }: InlineResultProps) {
  const [copied, setCopied] = useState(false)
  const [displayResult, setDisplayResult] = useState(result)

  useEffect(() => {
    setDisplayResult(result)
  }, [result])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayResult)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <div className="w-72 flex flex-col justify-center items-center p-6 bg-gradient-to-br from-white to-gray-50 border-l border-gray-200 shadow-lg">
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Translating...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-5 w-full border border-gray-100">
          <p className="text-gray-500 text-xs font-semibold mb-3 uppercase tracking-wide opacity-75">Translation</p>
          <p className="text-gray-900 font-medium text-lg break-words text-center mb-4 leading-relaxed">
            {displayResult}
          </p>
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold ${
              copied ? "bg-green-100 text-green-700" : "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
