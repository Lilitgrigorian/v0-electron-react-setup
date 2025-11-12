"use client";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import TranslatorWidget from "../widgets/TranslatorWidget";
import { X } from "lucide-react";
const WIDGET_COMPONENTS = {
    translator: TranslatorWidget,
    // Add other widget components here as they're implemented
    // dictionary: DictionaryWidget,
    // 'text-counter': TextCounterWidget,
    // etc.
};
export default function WidgetRenderer({ widgetId, onClose }) {
    const Component = WIDGET_COMPONENTS[widgetId];
    if (!Component) {
        return (_jsx("div", { className: "w-96 h-96 bg-white border-l border-gray-200 flex items-center justify-center", children: _jsxs("p", { className: "text-gray-500", children: ["Widget not found: ", widgetId] }) }));
    }
    return (_jsxs("div", { className: "w-96 border-l border-gray-200 flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: [_jsx("h2", { className: "font-semibold text-gray-900", children: "Widget" }), _jsx("button", { onClick: onClose, className: "p-1 hover:bg-gray-100 rounded-md", children: _jsx(X, { className: "w-5 h-5 text-gray-600" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto", children: _jsx(Component, {}) })] }));
}
//# sourceMappingURL=WidgetRenderer.js.map