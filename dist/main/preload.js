import { contextBridge, ipcRenderer, clipboard } from "electron";
contextBridge.exposeInMainWorld("electron", {
    clipboard: {
        read: async () => clipboard.readText(),
        write: async (text) => clipboard.writeText(text),
    },
    store: {
        get: (key) => ipcRenderer.invoke("store:get", key),
        set: (key, value) => ipcRenderer.invoke("store:set", key, value),
    },
    ipcRenderer, // 👈 ADD THIS LINE
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
});
//# sourceMappingURL=preload.js.map
