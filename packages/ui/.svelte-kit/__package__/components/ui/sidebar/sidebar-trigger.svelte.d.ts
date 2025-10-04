import { Button } from '../button/index.js';
import type { ComponentProps } from 'svelte';
type $$ComponentProps = ComponentProps<typeof Button> & {
    onclick?: (e: MouseEvent) => void;
};
declare const SidebarTrigger: import("svelte").Component<$$ComponentProps, {}, "ref">;
type SidebarTrigger = ReturnType<typeof SidebarTrigger>;
export default SidebarTrigger;
