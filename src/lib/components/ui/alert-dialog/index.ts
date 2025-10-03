import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
import Trigger from './alert-dialog-trigger.svelte';
import Title from './alert-dialog-title.svelte';
import Action from './alert-dialog-action.svelte';
import Cancel from './alert-dialog-cancel.svelte';
import Footer from './alert-dialog-footer.svelte';
import Header from './alert-dialog-header.svelte';
import Overlay from './alert-dialog-overlay.svelte';
import Content from './alert-dialog-content.svelte';
import Description from './alert-dialog-description.svelte';
import type { ComponentProps } from 'svelte';

const Root = AlertDialogPrimitive.Root;
const Portal = AlertDialogPrimitive.Portal;

type AlertDialogProps = ComponentProps<typeof Root>;
type AlertDialogTriggerProps = ComponentProps<typeof Trigger>;
type AlertDialogPortalProps = ComponentProps<typeof Portal>;
type AlertDialogTitleProps = ComponentProps<typeof Title>;
type AlertDialogActionProps = ComponentProps<typeof Action>;
type AlertDialogCancelProps = ComponentProps<typeof Cancel>;
type AlertDialogFooterProps = ComponentProps<typeof Footer>;
type AlertDialogHeaderProps = ComponentProps<typeof Header>;
type AlertDialogOverlayProps = ComponentProps<typeof Overlay>;
type AlertDialogContentProps = ComponentProps<typeof Content>;
type AlertDialogDescriptionProps = ComponentProps<typeof Description>;

export {
	Root,
	Title,
	Action,
	Cancel,
	Portal,
	Footer,
	Header,
	Trigger,
	Overlay,
	Content,
	Description,
	//
	Root as AlertDialog,
	type AlertDialogProps,
	Title as AlertDialogTitle,
	type AlertDialogTitleProps,
	Action as AlertDialogAction,
	type AlertDialogActionProps,
	Cancel as AlertDialogCancel,
	type AlertDialogCancelProps,
	Portal as AlertDialogPortal,
	type AlertDialogPortalProps,
	Footer as AlertDialogFooter,
	type AlertDialogFooterProps,
	Header as AlertDialogHeader,
	type AlertDialogHeaderProps,
	Trigger as AlertDialogTrigger,
	type AlertDialogTriggerProps,
	Overlay as AlertDialogOverlay,
	type AlertDialogOverlayProps,
	Content as AlertDialogContent,
	type AlertDialogContentProps,
	Description as AlertDialogDescription,
	type AlertDialogDescriptionProps
};
