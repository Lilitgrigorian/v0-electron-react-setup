declare global {
  interface Window {
    electron: {
      // ✅ Direct access to ipcRenderer
      ipcRenderer: {
        on: (channel: string, func: (...args: any[]) => void) => void
        once: (channel: string, func: (...args: any[]) => void) => void
        invoke: (channel: string, ...args: any[]) => Promise<any>
        send: (channel: string, ...args: any[]) => void
      }

      // ✅ Clipboard API exposed from preload
      clipboard: {
        read: () => Promise<string>
        write: (text: string) => Promise<void>
      }

      // ✅ Store API exposed from preload
      store: {
        get: (key: string) => Promise<any>
        set: (key: string, value: any) => Promise<void>
      }

      // ✅ Shortcut helpers you added to preload
      invoke: (channel: string, ...args: any[]) => Promise<any>
      send: (channel: string, ...args: any[]) => void
    }
  }
}

export {}
