import { getContext, setContext } from 'svelte';

export class Box<T> {
	value = $state<T>() as T;

	constructor(value: T) {
		this.value = value;
	}
}

/**
 * Expects there to be a route at `/api/synchronized-cookie/:key` that sets a cookie with the given key/value.
 * That handler is responsible for validating the cookie value and setting the cookie with the given key.
 * This uses fire-and-forget logic for setting the cookie, optimistically updating local state.
 */
export class SynchronizedCookie {
	#contextKey: symbol;
	#key: string;
	#value = $state<string>()!;

	constructor(key: string, value: string) {
		this.#key = key;
		this.#value = value;
		this.#contextKey = Symbol.for(`SynchronizedCookie:${key}`);
	}

	get key() {
		return this.#key;
	}

	get value() {
		return this.#value;
	}

	set value(v: string) {
		fetch(`/api/synchronized-cookie/${this.#key}`, {
			method: 'POST',
			body: JSON.stringify({ value: v }),
			headers: {
				'Content-Type': 'application/json'
			}
		}).catch(console.error);
		this.#value = v;
	}

	setContext() {
		setContext(this.#contextKey, this);
	}

	static fromContext(key: string): SynchronizedCookie {
		return getContext(Symbol.for(`SynchronizedCookie:${key}`));
	}
}
