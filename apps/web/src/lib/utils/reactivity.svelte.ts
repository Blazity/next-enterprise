import { getContext, setContext } from 'svelte';

export class Box<T> {
	value = $state<T>() as T;

	constructor(value: T) {
		this.value = value;
	}
}

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
