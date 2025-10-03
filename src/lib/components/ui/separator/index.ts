import type { ComponentProps } from 'svelte';
import Root from './separator.svelte';

type SeparatorProps = ComponentProps<typeof Root>;

export {
	Root,
	//
	Root as Separator,
	type SeparatorProps
};
