import { type WithElementRef } from '../../../utils/shadcn';
import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes } from 'svelte/elements';
type $$ComponentProps = WithElementRef<HTMLAnchorAttributes> & {
    child?: Snippet<[{
        props: Record<string, unknown>;
    }]>;
    size?: 'sm' | 'md';
    isActive?: boolean;
};
declare const SidebarMenuSubButton: import("svelte").Component<$$ComponentProps, {}, "ref">;
type SidebarMenuSubButton = ReturnType<typeof SidebarMenuSubButton>;
export default SidebarMenuSubButton;
