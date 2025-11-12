"use client";
import { useState, useCallback } from "react";
export const useWidgets = () => {
    const [widgets, setWidgets] = useState([]);
    const [loading, setLoading] = useState(false);
    const loadWidgets = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch widgets from main process
            const result = await window.electron.invoke("get-widgets");
            setWidgets(result);
        }
        catch (error) {
            console.error("Failed to load widgets:", error);
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { widgets, loading, loadWidgets };
};
//# sourceMappingURL=useWidgets.js.map
