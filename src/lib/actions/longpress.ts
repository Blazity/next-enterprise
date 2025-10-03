import type { ActionReturn } from '$lib/types';

export function longpress(node: HTMLElement, duration: number): ActionReturn<number> {
	let timer: ReturnType<typeof setTimeout>;

	const handleMousedown = (): void => {
		timer = setTimeout(() => {
			node.dispatchEvent(new CustomEvent('longpress'));
		}, duration);
	};

	const handleMouseup = (): void => {
		clearTimeout(timer);
	};

	node.addEventListener('mousedown', handleMousedown);
	node.addEventListener('mouseup', handleMouseup);

	return {
		update(newDuration: number): void {
			duration = newDuration;
		},
		destroy(): void {
			node.removeEventListener('mousedown', handleMousedown);
			node.removeEventListener('mouseup', handleMouseup);
		}
	};
}
