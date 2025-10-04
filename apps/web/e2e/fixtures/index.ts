import { mergeTests } from '@playwright/test';
import { baseTest } from './base.fixtures';
import { authTest } from './auth.fixtures';
import { pageObjectTest } from './page-objects.fixtures';
import { apiTest } from './api.fixtures';

export { baseTest as publicTest };

export const test = mergeTests(pageObjectTest, apiTest);

export { apiTest };

export type { User } from './auth.fixtures';

export { expect } from '@playwright/test';
