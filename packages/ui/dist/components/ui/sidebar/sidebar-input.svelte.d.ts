declare const SidebarInput: import("svelte").Component<(Omit<import("svelte/elements").HTMLInputAttributes, "type"> & ({
    type: "file";
    files?: FileList;
} | {
    type?: "number" | "button" | "submit" | "reset" | "search" | "checkbox" | "radio" | (string & {}) | "text" | "tel" | "url" | "email" | "hidden" | "color" | "date" | "time" | "datetime-local" | "image" | "month" | "password" | "range" | "week";
    files?: undefined;
})) & {
    ref?: HTMLElement | null | undefined;
}, {}, "ref" | "value">;
type SidebarInput = ReturnType<typeof SidebarInput>;
export default SidebarInput;
