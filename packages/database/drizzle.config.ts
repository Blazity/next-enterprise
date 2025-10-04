import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/schema',
	dialect: 'postgresql',
	out: './drizzle',
	dbCredentials: {
		url: process.env.DATABASE_URL || './pglite-data'
	},
	verbose: true,
	strict: true
});
