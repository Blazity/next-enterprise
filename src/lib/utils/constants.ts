import { env } from '$env/dynamic/public';

export const BREAKPOINTS = {
	sm: {
		unit: 'px',
		value: 640
	},
	md: {
		unit: 'px',
		value: 768
	},
	lg: {
		unit: 'px',
		value: 1024
	},
	xl: {
		unit: 'px',
		value: 1280
	},
	'2xl': {
		unit: 'px',
		value: 1536
	}
} as const;

export const allowAnonymousChats = env.PUBLIC_ALLOW_ANONYMOUS_CHATS === 'true';
