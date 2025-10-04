import type { Session, User } from '@repo/database/schema';

declare global {
	namespace App {
		interface Locals {
			user?: User | null;
			session?: Session | null;
		}
	}

	namespace svelteHTML {
		interface HTMLAttributes {
			onoutclick?: (event: CustomEvent) => void;
			onpanstart?: (event: CustomEvent) => void;
			onpanmove?: (event: CustomEvent<{ dx: number; dy: number }>) => void;
			onpanend?: (event: CustomEvent) => void;
			onlongpress?: (event: CustomEvent) => void;
		}
	}
}

export {};
