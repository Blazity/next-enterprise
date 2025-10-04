import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
type $$ComponentProps = DropdownMenuPrimitive.ItemProps & {
    inset?: boolean;
    variant?: 'default' | 'destructive';
};
declare const DropdownMenuItem: import("svelte").Component<$$ComponentProps, {}, "ref">;
type DropdownMenuItem = ReturnType<typeof DropdownMenuItem>;
export default DropdownMenuItem;
