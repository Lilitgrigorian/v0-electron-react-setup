import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("electron", {
  clipboard: {
    read: () => ipcRenderer.invoke("clipboard:read"),
    write: (text: string) => ipcRenderer.invoke("clipboard:write", text),
  },
  store: {
    get: (key: string) => ipcRenderer.invoke("store:get", key),
    set: (key: string, value: any) => ipcRenderer.invoke("store:set", key, value),
  },
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
})
