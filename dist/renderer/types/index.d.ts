export interface Action {
    id: string;
    label: string;
    icon?: string;
    handler?: (text?: string) => Promise<string | void>;
}
export interface Widget {
    id: string;
    label: string;
    icon: string;
    actions: Action[];
}
export interface PaletteItem {
    id: string;
    label: string;
    icon: string;
    type: "widget" | "action" | "suggested";
    handler?: (text?: string) => Promise<string | void>;
}
//# sourceMappingURL=index.d.ts.map
