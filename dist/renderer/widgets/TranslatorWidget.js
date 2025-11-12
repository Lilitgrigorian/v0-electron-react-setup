"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Copy, ChevronDown, Loader2, Globe, X } from "lucide-react";
const LANGUAGE_CODES = {
    English: "en",
    Italian: "it",
    French: "fr",
    German: "de",
    Spanish: "es",
    Portuguese: "pt",
    Japanese: "ja",
    Chinese: "zh",
    Russian: "ru",
    Arabic: "ar",
    Korean: "ko",
};
const LANGUAGE_NAMES = Object.keys(LANGUAGE_CODES);
export default function TranslatorWidget() {
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("it");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        const loadClipboardText = async () => {
            try {
                const text = await window.electron.clipboard.read();
                setInputText(text);
            }
            catch (error) {
                console.error("[v0] Failed to read clipboard:", error);
            }
        };
        loadClipboardText();
    }, []);
    useEffect(() => {
        const loadDefaultLanguage = async () => {
            try {
                const lang = await window.electron.store.get("defaultLanguage");
                if (lang)
                    setTargetLanguage(lang);
            }
            catch (error) {
                console.error("[v0] Failed to load default language:", error);
            }
        };
        loadDefaultLanguage();
    }, []);
    const handleTranslate = async () => {
        if (!inputText.trim())
            return;
        setLoading(true);
        setError("");
        try {
            const result = await window.electron.invoke("translate-text", {
                text: inputText,
                targetLanguage,
            });
            if (result.success) {
                setOutputText(result.text);
            }
            else {
                setError(result.error || "Failed to translate text");
                setOutputText("");
            }
        }
        catch (error) {
            setError(error.message);
            setOutputText("");
        }
        finally {
            setLoading(false);
        }
    };
    const handleCopy = async () => {
        try {
            await window.electron.clipboard.write(outputText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch (error) {
            console.error("[v0] Failed to copy:", error);
        }
    };
    const handleLanguageSelect = (lang) => {
        setTargetLanguage(LANGUAGE_CODES[lang]);
        setShowLanguageDropdown(false);
        window.electron.store.set("defaultLanguage", LANGUAGE_CODES[lang]);
    };
    const selectedLanguageName = LANGUAGE_NAMES.find((name) => LANGUAGE_CODES[name] === targetLanguage) || "English";
    return (_jsxs("div", { className: "h-screen bg-white p-8 flex flex-col gap-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Globe, { className: "w-8 h-8 text-blue-500" }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Translate Text" })] }), _jsx("button", { className: "p-2 hover:bg-gray-100 rounded-lg transition", children: _jsx(X, { className: "w-6 h-6 text-gray-500" }) })] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("label", { className: "text-sm font-semibold text-gray-600 uppercase tracking-wide", children: "Text to translate" }), _jsx("textarea", { value: inputText, onChange: (e) => setInputText(e.target.value), placeholder: "Enter text or paste from clipboard...", className: "w-full h-24 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-normal text-gray-900 placeholder-gray-400" })] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("label", { className: "text-sm font-semibold text-gray-600 uppercase tracking-wide", children: "Target language" }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setShowLanguageDropdown(!showLanguageDropdown), className: "w-full px-4 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between transition", children: [_jsx("span", { className: "text-gray-900 font-medium", children: selectedLanguageName }), _jsx(ChevronDown, { className: `w-5 h-5 text-gray-400 transition transform ${showLanguageDropdown ? "rotate-180" : ""}` })] }), showLanguageDropdown && (_jsx("div", { className: "absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto", children: LANGUAGE_NAMES.map((name) => (_jsx("button", { onClick: () => handleLanguageSelect(name), className: `w-full text-left px-4 py-3 hover:bg-gray-50 transition ${selectedLanguageName === name ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-900"}`, children: name }, name))) }))] })] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("label", { className: "text-sm font-semibold text-gray-600 uppercase tracking-wide", children: "Translation" }), error ? (_jsx("div", { className: "w-full h-24 p-4 border border-red-300 rounded-xl bg-red-50 flex items-center justify-center", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(X, { className: "w-5 h-5 text-red-500" }), _jsx("span", { className: "text-red-700 font-medium", children: error })] }) })) : outputText ? (_jsx("div", { className: "w-full h-24 p-4 border border-gray-300 rounded-xl bg-gray-50 overflow-y-auto font-normal text-gray-900", children: outputText })) : (_jsx("div", { className: "w-full h-24 p-4 border border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400", children: "Translation will appear here" }))] }), _jsx("button", { onClick: handleTranslate, disabled: loading || !inputText.trim(), className: "w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 flex items-center justify-center gap-2 font-semibold transition", children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), "Translating..."] })) : ("Translate") }), outputText && (_jsxs("button", { onClick: handleCopy, className: "w-full px-6 py-3 bg-gray-300 text-gray-900 rounded-xl hover:bg-gray-400 flex items-center justify-center gap-2 font-semibold transition", children: [_jsx(Copy, { className: "w-5 h-5" }), copied ? "Copied!" : "Copy Translation"] })), error && _jsx("p", { className: "text-sm text-gray-600 text-center", children: "Please check your API key and try again" })] }));
}
//# sourceMappingURL=TranslatorWidget.js.map