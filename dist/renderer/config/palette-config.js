let cachedWidgets = null;
let cachedActions = null;
export async function getWidgets() {
    if (cachedWidgets)
        return cachedWidgets;
    try {
        cachedWidgets = await window.electron.invoke("get-widgets");
        return cachedWidgets ?? [];
    }
    catch (error) {
        console.error("Failed to fetch widgets:", error);
        return [];
    }
}
export async function getQuickActions() {
    if (cachedActions)
        return cachedActions;
    try {
        cachedActions = await window.electron.invoke("get-quick-actions");
        return cachedActions ?? [];
    }
    catch (error) {
        console.error("Failed to fetch actions:", error);
        return [];
    }
}
// Keep these for backwards compatibility during migration
export const WIDGETS = [];
export const QUICK_ACTIONS = [];
//# sourceMappingURL=palette-config.js.map
