import type { ComponentProps } from 'svelte';
import Root from './textarea.svelte';

type TextareaProps = ComponentProps<typeof Root>;

export {
	Root,
	//
	Root as Textarea,
	type TextareaProps
};
