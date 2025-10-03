import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from '$lib/types';

interface ExpandParams {
	delay?: number;
	duration?: number;
	easing?: (t: number) => number;
}

export function expand(node: SVGElement, params: ExpandParams = {}): TransitionConfig {
	const { delay = 0, duration = 400, easing = cubicOut } = params;

	const strokeWidth = parseFloat(getComputedStyle(node).strokeWidth);

	return {
		delay,
		duration,
		easing,
		css: (t: number): string => `opacity: ${t}; stroke-width: ${t * strokeWidth}`
	};
}
