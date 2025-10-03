import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';

interface CustomCountStore extends Readable<number> {
	increment: () => void;
	decrement: () => void;
	reset: () => void;
}

function createCount(): CustomCountStore {
	const { subscribe, set, update } = writable(0);

	return {
		subscribe,
		increment: (): void => update((n) => n + 1),
		decrement: (): void => update((n) => n - 1),
		reset: (): void => set(0)
	};
}

export const count: CustomCountStore = createCount();
