import { type WithElementRef } from '../../../utils/shadcn';
import type { HTMLAttributes } from 'svelte/elements';
type $$ComponentProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};
declare const SidebarProvider: import("svelte").Component<$$ComponentProps, {}, "ref" | "open">;
type SidebarProvider = ReturnType<typeof SidebarProvider>;
export default SidebarProvider;
