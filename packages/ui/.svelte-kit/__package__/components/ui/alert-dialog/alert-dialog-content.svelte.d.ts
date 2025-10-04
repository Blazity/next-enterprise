import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
import { type WithoutChild, type WithoutChildrenOrChild } from '../../../utils/shadcn';
type $$ComponentProps = WithoutChild<AlertDialogPrimitive.ContentProps> & {
    portalProps?: WithoutChildrenOrChild<AlertDialogPrimitive.PortalProps>;
};
declare const AlertDialogContent: import("svelte").Component<$$ComponentProps, {}, "ref">;
type AlertDialogContent = ReturnType<typeof AlertDialogContent>;
export default AlertDialogContent;
