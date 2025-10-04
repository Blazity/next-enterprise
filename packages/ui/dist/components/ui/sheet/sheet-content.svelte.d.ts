import { type VariantProps } from 'tailwind-variants';
export declare const sheetVariants: import("tailwind-variants").TVReturnType<{
    side: {
        top: string;
        bottom: string;
        left: string;
        right: string;
    };
}, undefined, "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500", {
    side: {
        top: string;
        bottom: string;
        left: string;
        right: string;
    };
}, undefined, import("tailwind-variants").TVReturnType<{
    side: {
        top: string;
        bottom: string;
        left: string;
        right: string;
    };
}, undefined, "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500", unknown, unknown, undefined>>;
export type Side = VariantProps<typeof sheetVariants>['side'];
import { Dialog as SheetPrimitive } from 'bits-ui';
import type { Snippet } from 'svelte';
import { type WithoutChildrenOrChild } from '../../../utils/shadcn';
type $$ComponentProps = WithoutChildrenOrChild<SheetPrimitive.ContentProps> & {
    portalProps?: SheetPrimitive.PortalProps;
    side?: Side;
    children: Snippet;
};
declare const SheetContent: import("svelte").Component<$$ComponentProps, {}, "ref">;
type SheetContent = ReturnType<typeof SheetContent>;
export default SheetContent;
