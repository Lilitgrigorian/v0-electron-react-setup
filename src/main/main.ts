import { app, BrowserWindow, globalShortcut, ipcMain, clipboard } from "electron"
import path from "path"
import { fileURLToPath } from "url"
import Store from "electron-store"


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow: BrowserWindow | null = null
let commandPaletteWindow: BrowserWindow | null = null
const store = new Store<Record<string, unknown>>();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const indexPath = path.join(__dirname, "../renderer/index.html")
  mainWindow.loadFile(indexPath)

  if (process.env.DEBUG) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

function createCommandPaletteWindow() {
  if (commandPaletteWindow) {
    commandPaletteWindow.focus()
    return
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
  })

  const indexPath = path.join(__dirname, "../renderer/index.html")
  const url = `file://${indexPath}?page=command-palette`
  commandPaletteWindow.loadFile(indexPath, { hash: "command-palette" })
  commandPaletteWindow.show()

  commandPaletteWindow.on("closed", () => {
    commandPaletteWindow = null
  })
}

app.on("ready", async () => {
  createWindow()

  globalShortcut.register("Option+Shift+N", () => {
    createCommandPaletteWindow()
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.handle("clipboard:read", async () => {
  return clipboard.readText()
})

ipcMain.handle("clipboard:write", async (event, text: string) => {
  clipboard.writeText(text)
})

ipcMain.handle("store:get", (event, key: string) => {
  if (
    typeof (store as any).get === "function"
  ) {
    return (store as any).get(key)
  } else if (store instanceof Map) {
    return store.get(key)
  } else if (typeof store === "object" && Object.prototype.hasOwnProperty.call(store, key)) {
    return (store as any)[key]
  } else {
    throw new Error("store.get is not defined")
  }
})

ipcMain.handle("store:set", (event, key: string, value: any) => {
  if ("set" in store && typeof (store as any).set === "function") {
    (store as any).set(key, value)
  } else if (store instanceof Map) {
    store.set(key, value)
  } else if (typeof store === "object") {
    // Using as any to bypass TS index signature error for dynamic keys
    (store as any)[key] = value
  } else {
    throw new Error("store.set is not defined")
  }
})

