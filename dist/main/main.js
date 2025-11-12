import { app, BrowserWindow, globalShortcut, ipcMain, clipboard } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import Store from "electron-store";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let mainWindow = null;
let commandPaletteWindow = null;
const store = new Store();
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
    const indexPath = path.join(__dirname, "../renderer/index.html");
    mainWindow.loadFile(indexPath);
    if (process.env.DEBUG) {
        mainWindow.webContents.openDevTools();
    }
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
    const indexPath = path.join(__dirname, "../renderer/index.html");
    const url = `file://${indexPath}?page=command-palette`;
    commandPaletteWindow.loadFile(indexPath, { hash: "command-palette" });
    commandPaletteWindow.show();
    commandPaletteWindow.on("closed", () => {
        commandPaletteWindow = null;
    });
}
app.on("ready", async () => {
    createWindow();
    globalShortcut.register("Option+Shift+N", () => {
        createCommandPaletteWindow();
    });
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
ipcMain.handle("clipboard:read", async () => {
    return clipboard.readText();
});
ipcMain.handle("clipboard:write", async (event, text) => {
    clipboard.writeText(text);
});
ipcMain.handle("store:get", (event, key) => {
    if (typeof store.get === "function") {
        return store.get(key);
    }
    else if (store instanceof Map) {
        return store.get(key);
    }
    else if (typeof store === "object" && Object.prototype.hasOwnProperty.call(store, key)) {
        return store[key];
    }
    else {
        throw new Error("store.get is not defined");
    }
});
ipcMain.handle("store:set", (event, key, value) => {
    if ("set" in store && typeof store.set === "function") {
        store.set(key, value);
    }
    else if (store instanceof Map) {
        store.set(key, value);
    }
    else if (typeof store === "object") {
        // Using as any to bypass TS index signature error for dynamic keys
        store[key] = value;
    }
    else {
        throw new Error("store.set is not defined");
    }
});
//# sourceMappingURL=main.js.map
