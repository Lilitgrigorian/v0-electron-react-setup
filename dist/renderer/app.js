"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useRouter } from "next/router";
import CommandPalette from "./components/CommandPalette";
import TranslatorWidget from "./widgets/TranslatorWidget";
export default function App() {
    const router = useRouter();
    const { page } = router.query;
    if (page === "translator") {
        return _jsx(TranslatorWidget, {});
    }
    return _jsx(CommandPalette, {});
}
//# sourceMappingURL=app.js.map
