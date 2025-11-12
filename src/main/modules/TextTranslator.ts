import { ipcMain, clipboard } from "electron"
import Store from "electron-store"

const store = new Store<Record<string, unknown>>()
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || ""

interface TranslateRequest {
  text: string
  targetLanguage: string
  sourceLanguage?: string
}

async function translateText(request: TranslateRequest): Promise<string> {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    throw new Error("Google Translate API key not configured. Set GOOGLE_TRANSLATE_API_KEY environment variable.")
  }

  const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: request.text,
      target: request.targetLanguage,
      source: request.sourceLanguage || "auto",
    }),
  })

  if (!response.ok) {
    throw new Error(`Google Translate API error: ${response.statusText}`)
  }

  const data = (await response.json()) as any
  return data.data.translations[0].translatedText
}

ipcMain.handle("translate-text", async (event, request: TranslateRequest) => {
  try {
    const result = await translateText(request)
    return { success: true, text: result }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle("execute-action", async (event, { actionId }: { actionId: string }) => {
  try {
    const selectedText = clipboard.readText()
    const targetLanguage = getLanguageCodeFromActionId(actionId)

    if (targetLanguage) {
      const result = await translateText({
        text: selectedText,
        targetLanguage,
      })
      return { success: true, text: result }
    }

    return { success: false, error: "Unknown action" }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

function getLanguageCodeFromActionId(actionId: string): string | null {
  const mapping: { [key: string]: string } = {
    "translate-en": "en",
    "translate-it": "it",
    "translate-fr": "fr",
    "translate-de": "de",
    "translate-es": "es",
    "translate-pt": "pt",
    "translate-ja": "ja",
    "translate-zh": "zh",
    "translate-ru": "ru",
    "translate-ar": "ar",
    "translate-ko": "ko",
  }
  return mapping[actionId] || null
}

ipcMain.handle("copy-translation", async (event, text: string) => {
  try {
    clipboard.writeText(text)
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle("get-default-language", () => {
  // ts-expect-error: ElectronStore typing may not declare .get
  return (store as any).get("defaultLanguage", "it")
})

ipcMain.handle("set-default-language", (event, language: string) => {
  // ts-expect-error: ElectronStore typing may not declare .set
  (store as any).set("defaultLanguage", language)
  return { success: true }
})
