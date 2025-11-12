import { ipcMain, clipboard } from "electron";
ipcMain.handle("read-clipboard", () => {
    try {
        const text = clipboard.readText();
        return { success: true, text };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
ipcMain.handle("write-clipboard", (event, text) => {
    try {
        clipboard.writeText(text);
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
//# sourceMappingURL=ClipboardModule.js.map
