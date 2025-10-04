import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

function getEnvBoolean(value: string | undefined): boolean {
	return value === 'true';
}

export const env = {
	DATABASE_URL: privateEnv.DATABASE_URL || '',
	ANALYZE: getEnvBoolean(privateEnv.ANALYZE)
};

export const publicConfig = {
	PUBLIC_APP_NAME: publicEnv.PUBLIC_APP_NAME || 'SvelteKit Enterprise'
};
