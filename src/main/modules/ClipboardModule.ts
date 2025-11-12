import { ipcMain, clipboard } from "electron"

ipcMain.handle("read-clipboard", () => {
  try {
    const text = clipboard.readText()
    return { success: true, text }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle("write-clipboard", (event, text: string) => {
  try {
    clipboard.writeText(text)
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})
