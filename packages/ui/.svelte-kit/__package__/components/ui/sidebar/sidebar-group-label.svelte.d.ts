import { type WithElementRef } from '../../../utils/shadcn';
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
type $$ComponentProps = WithElementRef<HTMLAttributes<HTMLElement>> & {
    child?: Snippet<[{
        props: Record<string, unknown>;
    }]>;
};
declare const SidebarGroupLabel: import("svelte").Component<$$ComponentProps, {}, "ref">;
type SidebarGroupLabel = ReturnType<typeof SidebarGroupLabel>;
export default SidebarGroupLabel;
