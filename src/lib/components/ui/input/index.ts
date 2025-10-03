import type { ComponentProps } from 'svelte';
import Root from './input.svelte';

type InputProps = ComponentProps<typeof Root>;

export {
	Root,
	//
	Root as Input,
	type InputProps
};
