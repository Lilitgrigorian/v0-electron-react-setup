import { ipcMain, clipboard } from "electron"
import { LANGUAGE_MAPPING } from "./LanguageMapping"

interface ActionExecutionRequest {
  actionId: string
  text?: string
}

ipcMain.handle("execute-action", async (event, request: ActionExecutionRequest) => {
  try {
    const { actionId } = request

    // Try to get text from clipboard if not provided
    const text = request.text || clipboard.readText()

    if (!text || text.trim() === "") {
      return {
        success: false,
        error: "No text selected or in clipboard",
      }
    }

    // Handle translation actions
    if (actionId.startsWith("translate-")) {
      const lang = actionId.replace("translate-", "")
      const result = await window.electron.invoke("translate-text", {
        text,
        targetLanguage: LANGUAGE_MAPPING[lang] || lang,
      })
      return result
    }

    // Handle currency conversion actions
    if (actionId.startsWith("convert-")) {
      const currency = actionId.replace("convert-", "")
      // Implement currency conversion logic here
      return {
        success: false,
        error: "Currency conversion not yet implemented",
      }
    }

    return {
      success: false,
      error: `Unknown action: ${actionId}`,
    }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    }
  }
})
