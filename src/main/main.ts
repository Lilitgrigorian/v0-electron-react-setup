import { app, BrowserWindow, globalShortcut, ipcMain, clipboard } from "electron"
import path from "path"
import { fileURLToPath } from "url"
import Store from "electron-store"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow: BrowserWindow | null = null
let commandPaletteWindow: BrowserWindow | null = null
const store = new Store()

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
  return store.get(key)
})

ipcMain.handle("store:set", (event, key: string, value: any) => {
  store.set(key, value)
})
