import { ipcMain, clipboard } from "electron";
import Store from "electron-store";
const store = new Store();
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || "";
async function translateText(request) {
    if (!GOOGLE_TRANSLATE_API_KEY) {
        throw new Error("Google Translate API key not configured. Set GOOGLE_TRANSLATE_API_KEY environment variable.");
    }
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            q: request.text,
            target: request.targetLanguage,
            source: request.sourceLanguage || "auto",
        }),
    });
    if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.statusText}`);
    }
    const data = (await response.json());
    return data.data.translations[0].translatedText;
}
ipcMain.handle("translate-text", async (event, request) => {
    try {
        const result = await translateText(request);
        return { success: true, text: result };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
ipcMain.handle("execute-action", async (event, { actionId }) => {
    try {
        const selectedText = clipboard.readText();
        const targetLanguage = getLanguageCodeFromActionId(actionId);
        if (targetLanguage) {
            const result = await translateText({
                text: selectedText,
                targetLanguage,
            });
            return { success: true, text: result };
        }
        return { success: false, error: "Unknown action" };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
function getLanguageCodeFromActionId(actionId) {
    const mapping = {
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
    };
    return mapping[actionId] || null;
}
ipcMain.handle("copy-translation", async (event, text) => {
    try {
        clipboard.writeText(text);
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
ipcMain.handle("get-default-language", () => {
    // ts-expect-error: ElectronStore typing may not declare .get
    return store.get("defaultLanguage", "it");
});
ipcMain.handle("set-default-language", (event, language) => {
    // ts-expect-error: ElectronStore typing may not declare .set
    store.set("defaultLanguage", language);
    return { success: true };
});
//# sourceMappingURL=TextTranslator.js.map
