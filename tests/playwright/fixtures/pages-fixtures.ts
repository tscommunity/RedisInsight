import { test as base } from '@playwright/test';
import { BrowserPage } from '../pageObjects';

// Declare the types of fixtures.
type MyFixtures = {
    browserPage: BrowserPage
};

export const myFixtures = base.extend<MyFixtures>({
    browserPage: async({ page }, use) => {
        await use(new BrowserPage(page));
    },
    page: async({ baseURL, page }, use) => {
        await page.goto(baseURL!);
        await use(page);
    }
});

export { expect } from '@playwright/test';