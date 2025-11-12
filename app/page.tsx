import CommandPaletteV2 from "@/src/renderer/components/CommandPaletteV2"

export const metadata = {
  title: "Electron App - Command Palette",
  description: "Desktop app with Command Palette, Translator, and more widgets",
}

export default function Page() {
  return (
    <div className="w-full h-screen bg-white">
      <CommandPaletteV2 />
    </div>
  )
}
