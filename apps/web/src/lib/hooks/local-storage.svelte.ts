import { on } from 'svelte/events';
import { createSubscriber } from 'svelte/reactivity';

export class LocalStorage<T> {
	#key: string;
	#defaultValue: T;
	#subscribe: () => void;

	constructor(key: string, defaultValue: T) {
		this.#key = key;
		this.#defaultValue = defaultValue;

		this.#subscribe = createSubscriber((update) => {
			const off = on(window, 'storage', (event) => {
				if (event.key === this.#key) {
					update();
				}
			});

			return off;
		});
	}

	get value() {
		this.#subscribe();
		const storedValue = localStorage.getItem(this.#key);
		return storedValue === null ? this.#defaultValue : JSON.parse(storedValue);
	}

	set value(v: T) {
		localStorage.setItem(this.#key, JSON.stringify(v));
	}

	delete() {
		localStorage.removeItem(this.#key);
	}
}
