import { getContext, setContext } from 'svelte';

export class Lock {
	locked = false;
}

const lockKey = (key: string) => Symbol.for(`lock:${key}`);

export function getLock(key: string): Lock {
	const k = lockKey(key);
	let lock = getContext<Lock>(k);
	if (!lock) {
		lock = new Lock();
		setContext(k, lock);
	}
	return lock;
}
