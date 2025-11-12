import { app, BrowserWindow, globalShortcut } from "electron"
import path from "path"
import isDev from "electron-is-dev"

let mainWindow: BrowserWindow | null = null
let commandPaletteWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const startUrl = isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../renderer/index.html")}`

  mainWindow.loadURL(startUrl)

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
      preload: path.join(__dirname, "../preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  })

  const startUrl = isDev
    ? "http://localhost:3000/command-palette"
    : `file://${path.join(__dirname, "../renderer/index.html")}?page=command-palette`

  commandPaletteWindow.loadURL(startUrl)
  commandPaletteWindow.show()

  commandPaletteWindow.on("closed", () => {
    commandPaletteWindow = null
  })
}

app.on("ready", () => {
  createWindow()

  // Register global shortcut for Command Palette (Option + Shift + N on macOS)
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

// IPC Handlers will be registered here
import("./modules/TextTranslator")
import("./modules/ClipboardModule")
