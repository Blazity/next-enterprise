import { Dialog as SheetPrimitive } from 'bits-ui';
import Trigger from './sheet-trigger.svelte';
import Close from './sheet-close.svelte';
import Overlay from './sheet-overlay.svelte';
import Content from './sheet-content.svelte';
import Header from './sheet-header.svelte';
import Footer from './sheet-footer.svelte';
import Title from './sheet-title.svelte';
import Description from './sheet-description.svelte';
import type { ComponentProps } from 'svelte';

const Root = SheetPrimitive.Root;
const Portal = SheetPrimitive.Portal;

type SheetProps = ComponentProps<typeof Root>;
type CloseProps = ComponentProps<typeof Close>;
type TriggerProps = ComponentProps<typeof Trigger>;
type SheetPortalProps = ComponentProps<typeof Portal>;
type SheetOverlayProps = ComponentProps<typeof Overlay>;
type SheetContentProps = ComponentProps<typeof Content>;
type SheetHeaderProps = ComponentProps<typeof Header>;
type SheetFooterProps = ComponentProps<typeof Footer>;
type SheetTitleProps = ComponentProps<typeof Title>;
type SheetDescriptionProps = ComponentProps<typeof Description>;

export {
	Root,
	Close,
	Trigger,
	Portal,
	Overlay,
	Content,
	Header,
	Footer,
	Title,
	Description,
	//
	Root as Sheet,
	type SheetProps,
	Close as SheetClose,
	type CloseProps,
	Trigger as SheetTrigger,
	type TriggerProps,
	Portal as SheetPortal,
	type SheetPortalProps,
	Overlay as SheetOverlay,
	type SheetOverlayProps,
	Content as SheetContent,
	type SheetContentProps,
	Header as SheetHeader,
	type SheetHeaderProps,
	Footer as SheetFooter,
	type SheetFooterProps,
	Title as SheetTitle,
	type SheetTitleProps,
	Description as SheetDescription,
	type SheetDescriptionProps
};
