import type { ActionReturn } from '$lib/types';

export function pannable(node: HTMLElement): ActionReturn {
	let x: number;
	let y: number;

	function handleMousedown(event: MouseEvent): void {
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(
			new CustomEvent('panstart', {
				detail: { x, y }
			})
		);

		window.addEventListener('mousemove', handleMousemove);
		window.addEventListener('mouseup', handleMouseup);
	}

	function handleMousemove(event: MouseEvent): void {
		const dx = event.clientX - x;
		const dy = event.clientY - y;
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(
			new CustomEvent('panmove', {
				detail: { x, y, dx, dy }
			})
		);
	}

	function handleMouseup(event: MouseEvent): void {
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(
			new CustomEvent('panend', {
				detail: { x, y }
			})
		);

		window.removeEventListener('mousemove', handleMousemove);
		window.removeEventListener('mouseup', handleMouseup);
	}

	node.addEventListener('mousedown', handleMousedown);

	return {
		destroy(): void {
			node.removeEventListener('mousedown', handleMousedown);
		}
	};
}
