"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, AnimatePresence } from "framer-motion";
export default function ActionResult({ text, actionLabel }) {
    return (_jsx(AnimatePresence, { children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.9, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.9, y: -10 }, transition: { duration: 0.2 }, className: "absolute right-4 top-1/2 transform -translate-y-1/2 max-w-xs", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl border border-gray-200 p-4", children: [_jsx("p", { className: "text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2", children: actionLabel }), _jsx("p", { className: "text-gray-900 font-medium text-center break-words", children: text })] }) }, text) }));
}
//# sourceMappingURL=ActionResult.js.map