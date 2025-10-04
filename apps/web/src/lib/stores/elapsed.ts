import { derived } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { time } from '$stores/time';

const start = new Date();

export const elapsed: Readable<number> = derived(time, (currentTime) =>
	Math.round((currentTime.getTime() - start.getTime()) / 1000)
);
