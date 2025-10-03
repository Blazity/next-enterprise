import type { ComponentProps } from 'svelte';
import Root from './label.svelte';

type LabelProps = ComponentProps<typeof Root>;

export {
	Root,
	//
	Root as Label,
	type LabelProps
};
