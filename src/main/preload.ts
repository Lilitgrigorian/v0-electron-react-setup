import { contextBridge, ipcRenderer, clipboard } from "electron";

contextBridge.exposeInMainWorld("electron", {
  clipboard: {
    read: async () => clipboard.readText(),
    write: async (text: string) => clipboard.writeText(text),
  },
  store: {
    get: (key: string) => ipcRenderer.invoke("store:get", key),
    set: (key: string, value: any) => ipcRenderer.invoke("store:set", key, value),
  },
  ipcRenderer, // 👈 ADD THIS LINE
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
});
