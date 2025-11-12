declare global {
  interface Window {
    electron: {
      clipboard: {
        read: () => Promise<string>
        write: (text: string) => Promise<void>
      }
      store: {
        get: (key: string) => Promise<any>
        set: (key: string, value: any) => Promise<void>
      }
      invoke: (channel: string, ...args: any[]) => Promise<any>
      send: (channel: string, ...args: any[]) => void
    }
  }
}

export {}
