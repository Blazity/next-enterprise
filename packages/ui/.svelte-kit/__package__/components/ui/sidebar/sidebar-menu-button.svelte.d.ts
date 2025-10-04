import { type VariantProps } from 'tailwind-variants';
export declare const sidebarMenuButtonVariants: import("tailwind-variants").TVReturnType<{
    variant: {
        default: string;
        outline: string;
    };
    size: {
        default: string;
        sm: string;
        lg: string;
    };
}, undefined, "peer/menu-button outline-hidden ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground group-has-data-[sidebar=menu-action]/menu-item:pr-8 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm transition-[width,height,padding] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
    variant: {
        default: string;
        outline: string;
    };
    size: {
        default: string;
        sm: string;
        lg: string;
    };
}, undefined, import("tailwind-variants").TVReturnType<{
    variant: {
        default: string;
        outline: string;
    };
    size: {
        default: string;
        sm: string;
        lg: string;
    };
}, undefined, "peer/menu-button outline-hidden ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground group-has-data-[sidebar=menu-action]/menu-item:pr-8 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm transition-[width,height,padding] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", unknown, unknown, undefined>>;
export type SidebarMenuButtonVariant = VariantProps<typeof sidebarMenuButtonVariants>['variant'];
export type SidebarMenuButtonSize = VariantProps<typeof sidebarMenuButtonVariants>['size'];
import * as Tooltip from '../tooltip/index.js';
import { type WithElementRef, type WithoutChildrenOrChild } from '../../../utils/shadcn';
import type { ComponentProps, Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
type $$ComponentProps = WithElementRef<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    isActive?: boolean;
    variant?: SidebarMenuButtonVariant;
    size?: SidebarMenuButtonSize;
    tooltipContent?: Snippet | string;
    tooltipContentProps?: WithoutChildrenOrChild<ComponentProps<typeof Tooltip.Content>>;
    child?: Snippet<[{
        props: Record<string, unknown>;
    }]>;
};
declare const SidebarMenuButton: import("svelte").Component<$$ComponentProps, {}, "ref">;
type SidebarMenuButton = ReturnType<typeof SidebarMenuButton>;
export default SidebarMenuButton;
