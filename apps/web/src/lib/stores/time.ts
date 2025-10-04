import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';

export const time: Readable<Date> = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return function stop(): void {
		clearInterval(interval);
	};
});
