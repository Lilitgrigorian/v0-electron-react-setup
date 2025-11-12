"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
export default function InlineResult({ result, loading }) {
    const [copied, setCopied] = useState(false);
    const [displayResult, setDisplayResult] = useState(result);
    useEffect(() => {
        setDisplayResult(result);
    }, [result]);
    const handleCopy = async () => {
        try {
            await window.electron.clipboard.write(displayResult);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch (error) {
            console.error("[v0] Failed to copy:", error);
        }
    };
    return (_jsx("div", { className: "w-72 flex flex-col justify-center items-center p-6 bg-gradient-to-br from-white to-gray-50 border-l border-gray-200 shadow-lg", children: loading ? (_jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" }), _jsx("p", { className: "text-sm text-gray-500", children: "Processing..." })] })) : (_jsxs("div", { className: "bg-white rounded-xl shadow-sm p-5 w-full border border-gray-100", children: [_jsx("p", { className: "text-gray-500 text-xs font-semibold mb-3 uppercase tracking-wide opacity-75", children: "Result" }), _jsx("p", { className: "text-gray-900 font-medium text-lg break-words text-center mb-4 leading-relaxed", children: displayResult }), _jsx("button", { onClick: handleCopy, className: `w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold ${copied ? "bg-green-100 text-green-700" : "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"}`, children: copied ? (_jsxs(_Fragment, { children: [_jsx(Check, { className: "w-4 h-4" }), "Copied!"] })) : (_jsxs(_Fragment, { children: [_jsx(Copy, { className: "w-4 h-4" }), "Copy"] })) })] })) }));
}
//# sourceMappingURL=InlineResult.js.map