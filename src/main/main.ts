import { app, BrowserWindow, ipcMain, clipboard, globalShortcut } from "electron";
import path from "path";
import { TextTranslator } from "./text-translator/TextTranslator.js";
import { fileURLToPath } from "url";
import Store from "electron-store";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let textTranslator: TextTranslator;
let store: Store;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", async () => {
  store = new Store();
  textTranslator = new TextTranslator();
  textTranslator.initialize();

  createMainWindow();

  // Global shortcuts
  globalShortcut.register("CommandOrControl+Option+I", () => {
    mainWindow?.webContents.toggleDevTools();
  });

  globalShortcut.register("Option+Shift+N", () => {
    const selectedText = clipboard.readText();
    textTranslator.show(selectedText);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (!mainWindow) createMainWindow();
});

ipcMain.handle("clipboard:read", () => clipboard.readText());
ipcMain.handle("clipboard:write", (_event, text: string) => {
  clipboard.writeText(text);
});
