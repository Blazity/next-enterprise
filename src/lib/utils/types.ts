import type { Snippet } from 'svelte';

export type WithElementRef<T, U extends HTMLElement | SVGElement = HTMLElement> = T & {
	ref?: U | null;
};

export type WithElementRefAndChild<
	T,
	U extends HTMLElement | SVGElement = HTMLElement
> = WithElementRef<T, U> & { child?: Snippet<[{ props: T }]> };
