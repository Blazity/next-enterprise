import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const count: Writable<number> = writable(0);
