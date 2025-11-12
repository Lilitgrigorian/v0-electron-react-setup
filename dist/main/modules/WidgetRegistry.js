import { ipcMain } from "electron";
const WIDGETS_REGISTRY = [
    {
        id: "translator",
        label: "Translator",
        icon: "🌐",
        actions: [
            { id: "translate-en", label: "Translate to English" },
            { id: "translate-it", label: "Translate to Italian" },
            { id: "translate-fr", label: "Translate to French" },
            { id: "translate-de", label: "Translate to German" },
            { id: "translate-es", label: "Translate to Spanish" },
            { id: "translate-pt", label: "Translate to Portuguese" },
            { id: "translate-ja", label: "Translate to Japanese" },
            { id: "translate-zh", label: "Translate to Chinese" },
            { id: "translate-ru", label: "Translate to Russian" },
            { id: "translate-ar", label: "Translate to Arabic" },
            { id: "translate-ko", label: "Translate to Korean" },
        ],
    },
    {
        id: "dictionary",
        label: "Dictionary",
        icon: "📖",
        actions: [],
    },
    {
        id: "text-counter",
        label: "Text Counter",
        icon: "📝",
        actions: [],
    },
    {
        id: "world-clock",
        label: "World Clock",
        icon: "🌍",
        actions: [],
    },
    {
        id: "currency-converter",
        label: "Currency Converter",
        icon: "💱",
        actions: [],
    },
    {
        id: "units-converter",
        label: "Units Converter",
        icon: "📏",
        actions: [],
    },
];
// Get all widgets
ipcMain.handle("get-widgets", () => {
    return WIDGETS_REGISTRY;
});
// Get widget by ID
ipcMain.handle("get-widget", (event, widgetId) => {
    return WIDGETS_REGISTRY.find((w) => w.id === widgetId);
});
// Get quick actions (flattened list of all actions across widgets)
ipcMain.handle("get-quick-actions", () => {
    const actions = [];
    WIDGETS_REGISTRY.forEach((widget) => {
        if (widget.actions && widget.actions.length > 0) {
            actions.push(...widget.actions);
        }
    });
    return actions;
});
// Register a new widget dynamically
export function registerWidget(widget) {
    const existingIndex = WIDGETS_REGISTRY.findIndex((w) => w.id === widget.id);
    if (existingIndex >= 0) {
        WIDGETS_REGISTRY[existingIndex] = widget;
    }
    else {
        WIDGETS_REGISTRY.push(widget);
    }
}
// Register a new action to a widget
export function registerAction(widgetId, action) {
    const widget = WIDGETS_REGISTRY.find((w) => w.id === widgetId);
    if (widget) {
        widget.actions.push(action);
    }
}
//# sourceMappingURL=WidgetRegistry.js.map