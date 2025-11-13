"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import CommandPalette from "./components/CommandPalette";
import TranslatorWidget from "./widgets/TranslatorWidget";
export default function App() {
    const [page, setPage] = useState("command-palette");
    useEffect(() => {
        const hash = window.location.hash.slice(1) || "command-palette";
        setPage(hash);
    }, []);
    if (page === "translator") {
        return _jsx(TranslatorWidget, {});
    }
    return _jsx(CommandPalette, {});
}
//# sourceMappingURL=app.js.map
