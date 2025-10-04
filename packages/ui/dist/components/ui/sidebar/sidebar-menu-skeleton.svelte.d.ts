import { type WithElementRef } from '../../../utils/shadcn';
import type { HTMLAttributes } from 'svelte/elements';
type $$ComponentProps = WithElementRef<HTMLAttributes<HTMLElement>> & {
    showIcon?: boolean;
};
declare const SidebarMenuSkeleton: import("svelte").Component<$$ComponentProps, {}, "ref">;
type SidebarMenuSkeleton = ReturnType<typeof SidebarMenuSkeleton>;
export default SidebarMenuSkeleton;
