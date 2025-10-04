import { type WithElementRef } from '../../../utils/shadcn';
import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
type $$ComponentProps = WithElementRef<HTMLButtonAttributes> & {
    child?: Snippet<[{
        props: Record<string, unknown>;
    }]>;
};
declare const SidebarGroupAction: import("svelte").Component<$$ComponentProps, {}, "ref">;
type SidebarGroupAction = ReturnType<typeof SidebarGroupAction>;
export default SidebarGroupAction;
