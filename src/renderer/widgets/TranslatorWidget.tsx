"use client"

import { useState, useEffect } from "react"
import { Copy, ChevronDown, Loader2 } from "lucide-react"

const LANGUAGE_CODES: { [key: string]: string } = {
  English: "en",
  Italian: "it",
  French: "fr",
  German: "de",
  Spanish: "es",
  Portuguese: "pt",
  Japanese: "ja",
  Chinese: "zh",
  Russian: "ru",
  Arabic: "ar",
  Korean: "ko",
}

const LANGUAGE_NAMES = Object.keys(LANGUAGE_CODES)

export default function TranslatorWidget() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("it")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  useEffect(() => {
    const loadClipboardText = async () => {
      try {
        const text = await window.electron.clipboard.read()
        setInputText(text)
      } catch (error) {
        console.error("[v0] Failed to read clipboard:", error)
      }
    }

    loadClipboardText()
  }, [])

  // Load default language preference
  useEffect(() => {
    const loadDefaultLanguage = async () => {
      try {
        const lang = await window.electron.store.get("defaultLanguage")
        if (lang) setTargetLanguage(lang)
      } catch (error) {
        console.error("[v0] Failed to load default language:", error)
      }
    }

    loadDefaultLanguage()
  }, [])

  const handleTranslate = async () => {
    if (!inputText.trim()) return

    setLoading(true)
    try {
      const result = await window.electron.invoke("translate-text", {
        text: inputText,
        targetLanguage,
      })

      if (result.success) {
        setOutputText(result.text)
      } else {
        setOutputText(`Error: ${result.error}`)
      }
    } catch (error) {
      setOutputText(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await window.electron.clipboard.write(outputText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("[v0] Failed to copy:", error)
    }
  }

  const handleLanguageSelect = (lang: string) => {
    setTargetLanguage(LANGUAGE_CODES[lang])
    setShowLanguageDropdown(false)
    window.electron.store.set("defaultLanguage", LANGUAGE_CODES[lang])
  }

  const selectedLanguageName = LANGUAGE_NAMES.find((name) => LANGUAGE_CODES[name] === targetLanguage) || "English"

  return (
    <div className="h-screen bg-white p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">Translator</h1>

      <div className="flex-1 flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Text to translate</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text or paste from clipboard..."
          className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
        />
      </div>

      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 block mb-2">Target language</label>
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
            >
              <span className="text-gray-900">{selectedLanguageName}</span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>

            {showLanguageDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {LANGUAGE_NAMES.map((name) => (
                  <button
                    key={name}
                    onClick={() => handleLanguageSelect(name)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      selectedLanguageName === name ? "bg-blue-50 text-blue-900" : "text-gray-900"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleTranslate}
          disabled={loading || !inputText.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Translating...
            </>
          ) : (
            "Translate"
          )}
        </button>
      </div>

      {outputText && (
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Translation</label>
          <div className="flex-1 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto font-mono text-sm text-gray-900">
            {outputText}
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2 font-medium"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy translation"}
          </button>
        </div>
      )}
    </div>
  )
}
