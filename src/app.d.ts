import type { Session, User } from '$db/schema';

declare global {
	namespace App {
		interface Locals {
			user?: User | null;
			session?: Session | null;
		}
	}
}

export {};
