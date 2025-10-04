import type { StorybookConfig } from '@storybook/sveltekit';

import { join, dirname } from 'path';

function getAbsolutePath(value: string): any {
	return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|ts|svelte)'],
	addons: [
		getAbsolutePath('@storybook/addon-svelte-csf'),
		getAbsolutePath('@storybook/addon-vitest')
	],
	framework: {
		name: getAbsolutePath('@storybook/sveltekit'),
		options: {}
	}
};
export default config;
