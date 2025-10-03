import type { ActionReturn } from '$lib/types';

export function clickOutside(node: HTMLElement): ActionReturn {
	const handleClick = (event: MouseEvent): void => {
		if (event.target instanceof Node && !node.contains(event.target)) {
			node.dispatchEvent(new CustomEvent('outclick'));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy(): void {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
