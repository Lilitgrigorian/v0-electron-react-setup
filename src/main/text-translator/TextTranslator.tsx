import { BrowserWindow, ipcMain, screen, clipboard } from "electron"
import Store from "electron-store"

interface TranslatorSettings {
  defaultTargetLanguage: string
}

const store = new Store<TranslatorSettings>({
  defaults: {
    defaultTargetLanguage: "es",
  },
})

export class TextTranslator {
  private translatorWindow: BrowserWindow | null = null
  private initialText = ""

  constructor() {
    console.log("[TextTranslator] Initializing...")
  }

  public initialize(): void {
    this.setupIPC()
    console.log("[TextTranslator] Initialized successfully")
  }

  public show(selectedText?: string): void {
    console.log("[TextTranslator] Showing text translator...")
    console.log("[TextTranslator] Selected text:", selectedText)

    if (this.translatorWindow && !this.translatorWindow.isDestroyed()) {
      console.log("[TextTranslator] Window already exists, focusing...")
      this.translatorWindow.focus()
      return
    }

    let textToTranslate = selectedText || ""

    if (!textToTranslate) {
      textToTranslate = clipboard.readText()
      console.log("[TextTranslator] Using clipboard text:", textToTranslate)
    }

    this.initialText = textToTranslate

    const cursorPoint = screen.getCursorScreenPoint()
    const x = cursorPoint.x + 50
    const y = cursorPoint.y + 20

    this.translatorWindow = new BrowserWindow({
      width: 450,
      height: 500,
      x,
      y,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: undefined,
      },
    })

    this.translatorWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
    this.translatorWindow.setAlwaysOnTop(true, "screen-saver")

    const html = this.generateTranslatorHTML(this.initialText)
    this.translatorWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)

    this.translatorWindow.on("closed", () => {
      console.log("[TextTranslator] Window closed")
      this.translatorWindow = null
    })

    this.translatorWindow.on("blur", () => {
      console.log("[TextTranslator] Window lost focus, closing...")
      if (this.translatorWindow && !this.translatorWindow.isDestroyed()) {
        this.close()
      }
    })

    this.translatorWindow.webContents.on("did-finish-load", () => {
      console.log("[TextTranslator] Window loaded successfully")
    })
  }

  public close(): void {
    if (this.translatorWindow && !this.translatorWindow.isDestroyed()) {
      this.translatorWindow.close()
      this.translatorWindow = null
    }
  }

  private setupIPC(): void {
    ipcMain.handle("get-translator-settings", () => {
      return {
        defaultTargetLanguage: store.get("defaultTargetLanguage"),
      }
    })

    ipcMain.on("save-translator-settings", (event, settings: TranslatorSettings) => {
      store.set("defaultTargetLanguage", settings.defaultTargetLanguage)
      console.log("[TextTranslator] Settings saved:", settings)
    })

    ipcMain.on("close-translator", () => {
      console.log("[TextTranslator] Close requested via IPC")
      this.close()
    })

    ipcMain.on("copy-translation", (event, text: string) => {
      clipboard.writeText(text)
      console.log("[TextTranslator] Translation copied to clipboard")
    })

    ipcMain.handle("translate-text", async (event, { text, targetLang }: { text: string; targetLang: string }) => {
      try {
        console.log(`[TextTranslator] Translating to ${targetLang}:`, text.substring(0, 50))

        const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
        if (!apiKey) {
          throw new Error("Missing Google Translate API key. Set GOOGLE_TRANSLATE_API_KEY in your environment.")
        }

        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: text,
            target: targetLang,
            format: "text",
          }),
        })

        const data = (await response.json()) as {
          data?: {
            translations: Array<{
              translatedText: string
              detectedSourceLanguage?: string
            }>
          }
          error?: {
            message: string
          }
        }

        if (data.error) {
          console.error("[TextTranslator] API Error:", data.error)
          return { success: false, error: data.error.message }
        }

        if (!data.data?.translations?.[0]) {
          return { success: false, error: "No translation returned" }
        }

        const translation = data.data.translations[0]
        console.log("[TextTranslator] Translation successful")
        return {
          success: true,
          translatedText: translation.translatedText,
          detectedSourceLanguage: translation.detectedSourceLanguage,
        }
      } catch (error) {
        console.error("[TextTranslator] Translation error:", error)
        return { success: false, error: "Failed to translate text" }
      }
    })
  }

  private generateTranslatorHTML(initialText: string): string {
    const escapedText = initialText.replace(/"/g, "&quot;").replace(/'/g, "&#39;")

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: transparent;
      -webkit-app-region: no-drag;
      overflow: hidden;
    }
    .container {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 24px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease-out;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .title {
      font-size: 18px;
      font-weight: 600;
      color: #1d1d1f;
    }
    .close-btn {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.05);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      position: relative;
    }
    .close-btn:hover {
      background: rgba(255, 59, 48, 0.1);
    }
    .close-btn::before,
    .close-btn::after {
      content: '';
      position: absolute;
      width: 12px;
      height: 2px;
      background: #86868b;
    }
    .close-btn::before {
      transform: rotate(45deg);
    }
    .close-btn::after {
      transform: rotate(-45deg);
    }
    .input-section {
      margin-bottom: 16px;
    }
    .label {
      font-size: 12px;
      color: #86868b;
      margin-bottom: 8px;
      text-transform: uppercase;
      font-weight: 500;
      display: block;
    }
    .text-input {
      width: 100%;
      min-height: 120px;
      padding: 12px;
      font-size: 14px;
      color: #1d1d1f;
      background: #f5f5f7;
      border: 1px solid #d2d2d7;
      border-radius: 8px;
      outline: none;
      resize: vertical;
      font-family: inherit;
      transition: all 0.2s ease;
    }
    .text-input:focus {
      border-color: #06c;
      box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
      background: white;
    }
    .language-select {
      width: 100%;
      padding: 10px 12px;
      font-size: 14px;
      color: #1d1d1f;
      background: white;
      border: 1px solid #d2d2d7;
      border-radius: 8px;
      outline: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .language-select:hover {
      border-color: #06c;
    }
    .language-select:focus {
      border-color: #06c;
      box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
    }
    .output-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    .output-box {
      flex: 1;
      background: #f5f5f7;
      border-radius: 12px;
      padding: 16px;
      overflow-y: auto;
      margin-bottom: 12px;
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .output-text {
      font-size: 14px;
      color: #1d1d1f;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .placeholder-text {
      color: #86868b;
      font-style: italic;
    }
    .copy-btn {
      width: 100%;
      padding: 12px;
      background: #06c;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .copy-btn:hover {
      background: #0077ed;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
    }
    .copy-btn:active {
      transform: translateY(0);
    }
    .copy-btn:disabled {
      background: #d2d2d7;
      cursor: not-allowed;
      transform: none;
    }
    .loading-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-top-color: #06c;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 8px;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    .status-text {
      text-align: center;
      font-size: 12px;
      color: #86868b;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">🌐 Translate Text</div>
      <button class="close-btn" id="closeBtn"></button>
    </div>
    
    <div class="input-section">
      <label class="label">Text to Translate</label>
      <textarea class="text-input" id="inputText" placeholder="Enter text to translate...">${escapedText}</textarea>
    </div>
    
    <div class="input-section">
      <label class="label">Target Language</label>
      <select class="language-select" id="targetLang">
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="it">Italian</option>
        <option value="pt">Portuguese</option>
        <option value="ru">Russian</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
        <option value="zh-CN">Chinese (Simplified)</option>
        <option value="ar">Arabic</option>
        <option value="hi">Hindi</option>
        <option value="tr">Turkish</option>
        <option value="nl">Dutch</option>
        <option value="pl">Polish</option>
        <option value="sv">Swedish</option>
      </select>
    </div>
    
    <div class="output-section">
      <label class="label">Translation</label>
      <div class="output-box" id="outputBox">
        <div class="output-text placeholder-text">Translation will appear here...</div>
      </div>
      <button class="copy-btn" id="copyBtn" disabled>Copy Translation</button>
      <div class="status-text" id="statusText"></div>
    </div>
  </div>
  
  <script>
    console.log('[v0] Text translator UI loaded');
    
    const inputText = document.getElementById('inputText');
    const targetLang = document.getElementById('targetLang');
    const outputBox = document.getElementById('outputBox');
    const copyBtn = document.getElementById('copyBtn');
    const closeBtn = document.getElementById('closeBtn');
    const statusText = document.getElementById('statusText');
    
    let currentTranslation = '';
    let debounceTimer;
    
    async function loadSettings() {
      try {
        const settings = await window.electron.invoke('get-translator-settings');
        console.log('[v0] Loaded translator settings:', settings);
        targetLang.value = settings.defaultTargetLanguage;
        if (inputText.value.trim()) {
          await translateText();
        }
      } catch (error) {
        console.error('[v0] Error loading settings:', error);
      }
    }
    
    closeBtn.addEventListener('click', () => {
      console.log('[v0] Close button clicked');
      window.electron.send('close-translator');
    });
    
    inputText.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(translateText, 500);
    });
    
    targetLang.addEventListener('change', () => {
      translateText();
      saveSettings();
    });
    
    copyBtn.addEventListener('click', () => {
      if (currentTranslation) {
        window.electron.send('copy-translation', currentTranslation);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy Translation';
        }, 2000);
      }
    });
    
    async function translateText() {
      const text = inputText.value.trim();
      
      if (!text) {
        outputBox.innerHTML = '<div class="output-text placeholder-text">Translation will appear here...</div>';
        copyBtn.disabled = true;
        statusText.textContent = '';
        return;
      }
      
      const target = targetLang.value;
      
      console.log('[v0] Translating to:', target);
      
      outputBox.innerHTML = '<div class="output-text"><span class="loading-spinner"></span>Translating...</div>';
      copyBtn.disabled = true;
      statusText.textContent = '';
      
      try {
        const result = await window.electron.invoke('translate-text', { text, targetLang: target });
        
        console.log('[v0] Translation result:', result);
        
        if (result.success) {
          currentTranslation = result.translatedText;
          outputBox.innerHTML = \`<div class="output-text">\${result.translatedText}</div>\`;
          copyBtn.disabled = false;
          if (result.detectedSourceLanguage) {
            statusText.textContent = \`Detected source: \${result.detectedSourceLanguage.toUpperCase()}\`;
          }
        } else {
          outputBox.innerHTML = \`<div class="output-text placeholder-text">❌ \${result.error || 'Translation failed'}</div>\`;
          copyBtn.disabled = true;
          statusText.textContent = 'Please check your API key and try again';
        }
      } catch (error) {
        console.error('[v0] Translation error:', error);
        outputBox.innerHTML = '<div class="output-text placeholder-text">❌ Failed to connect to translator</div>';
        copyBtn.disabled = true;
      }
    }
    
    function saveSettings() {
      window.electron.send('save-translator-settings', {
        defaultTargetLanguage: targetLang.value
      });
    }
    
    if (!inputText.value.trim()) {
      inputText.focus();
    }
    
    // Load settings when page loads
    loadSettings();
  </script>
</body>
</html>
    `
  }
}
