import { MediaQuery } from 'svelte/reactivity';

const MD_BREAKPOINT = 768;

export class IsMobile extends MediaQuery {
	constructor() {
		super(`max-width: ${MD_BREAKPOINT - 1}px`);
	}
}
