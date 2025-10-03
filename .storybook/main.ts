import type { StorybookConfig } from '@storybook/sveltekit';

import { join, dirname } from "path"

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|ts|svelte)"
  ],
  "addons": [
    getAbsolutePath('@storybook/addon-svelte-csf')
  ],
  "framework": {
    "name": getAbsolutePath('@storybook/sveltekit'),
    "options": {}
  }
};
export default config;
