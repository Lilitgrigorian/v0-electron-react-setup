import { app, BrowserWindow, ipcMain, clipboard, globalShortcut } from "electron";
import path from "path";
import { registerTranslatorIPC } from "./text-translator/translator.js";
import { fileURLToPath } from "url";
// ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let mainWindow = null;
let commandPaletteWindow = null;
let store; // Electron Store instance
function createWindow() {
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
function createCommandPaletteWindow() {
    if (commandPaletteWindow) {
        commandPaletteWindow.focus();
        return;
    }
    commandPaletteWindow = new BrowserWindow({
        width: 500,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
        },
        show: false,
    });
    commandPaletteWindow.loadFile(path.join(__dirname, "../renderer/index.html"), { hash: "command-palette" });
    commandPaletteWindow.show();
    commandPaletteWindow.webContents.openDevTools();
    commandPaletteWindow.on("closed", () => {
        commandPaletteWindow = null;
    });
}
app.on("ready", async () => {
    // ✅ Dynamically import Electron Store
    const { default: Store } = await import("electron-store");
    store = new Store();
    // ✅ Register translator IPC
    await registerTranslatorIPC(store);
    createWindow();
    // Global shortcuts
    globalShortcut.register("CommandOrControl+Option+I", () => {
        mainWindow?.webContents.toggleDevTools();
    });
    globalShortcut.register("Option+Shift+N", () => {
        createCommandPaletteWindow();
    });
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
});
app.on("activate", () => {
    if (!mainWindow)
        createWindow();
});
// Clipboard IPC
ipcMain.handle("clipboard:read", () => clipboard.readText());
ipcMain.handle("clipboard:write", (_event, text) => {
    clipboard.writeText(text);
});
//# sourceMappingURL=main.js.map