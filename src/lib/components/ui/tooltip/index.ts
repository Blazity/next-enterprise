import { Tooltip as TooltipPrimitive } from 'bits-ui';
import Trigger from './tooltip-trigger.svelte';
import Content from './tooltip-content.svelte';
import type { ComponentProps } from 'svelte';

const Root = TooltipPrimitive.Root;
const Provider = TooltipPrimitive.Provider;
const Portal = TooltipPrimitive.Portal;

type TooltipProps = ComponentProps<typeof Root>;
type TooltipTriggerProps = ComponentProps<typeof Trigger>;
type TooltipProviderProps = ComponentProps<typeof Provider>;
type TooltipContentProps = ComponentProps<typeof Content>;

export {
	Root,
	Trigger,
	Content,
	Provider,
	Portal,
	//
	Root as Tooltip,
	type TooltipProps,
	Content as TooltipContent,
	type TooltipContentProps,
	Trigger as TooltipTrigger,
	type TooltipTriggerProps,
	Provider as TooltipProvider,
	type TooltipProviderProps
};
