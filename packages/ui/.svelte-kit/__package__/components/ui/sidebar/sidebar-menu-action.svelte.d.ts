import { type WithElementRef } from '../../../utils/shadcn';
import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
type $$ComponentProps = WithElementRef<HTMLButtonAttributes> & {
    child?: Snippet<[{
        props: Record<string, unknown>;
    }]>;
    showOnHover?: boolean;
};
declare const SidebarMenuAction: import("svelte").Component<$$ComponentProps, {}, "ref">;
type SidebarMenuAction = ReturnType<typeof SidebarMenuAction>;
export default SidebarMenuAction;
