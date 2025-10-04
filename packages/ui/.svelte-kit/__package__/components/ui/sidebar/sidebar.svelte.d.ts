import { type WithElementRef } from '../../../utils/shadcn';
import type { HTMLAttributes } from 'svelte/elements';
type $$ComponentProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
};
declare const Sidebar: import("svelte").Component<$$ComponentProps, {}, "ref">;
type Sidebar = ReturnType<typeof Sidebar>;
export default Sidebar;
