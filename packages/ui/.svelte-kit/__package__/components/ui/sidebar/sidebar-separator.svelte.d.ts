declare const SidebarSeparator: import("svelte").Component<Omit<{
    orientation?: import("bits-ui").Orientation;
    decorative?: boolean;
}, "children" | "child"> & {
    child?: import("svelte").Snippet<[{
        props: Record<string, unknown>;
    }]> | undefined;
    children?: import("svelte").Snippet<[]> | undefined;
    style?: import("bits-ui").StyleProperties | string | null | undefined;
    ref?: HTMLElement | null | undefined;
} & import("bits-ui").Without<import("bits-ui").BitsPrimitiveDivAttributes, import("bits-ui").SeparatorRootPropsWithoutHTML>, {}, "ref">;
type SidebarSeparator = ReturnType<typeof SidebarSeparator>;
export default SidebarSeparator;
