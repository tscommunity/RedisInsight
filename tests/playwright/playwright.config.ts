import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/',
    /* Run tests in files in parallel */
    timeout: 60 * 1000,
    expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
        timeout: 10000
    },
    fullyParallel: false,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [['html'], ['allure-playwright']],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://127.0.0.1:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        // video: 'on',
        screenshot: 'on'
    }

    // /* Configure projects for major browsers */
    // // projects: [
    // //     {
    // //         name: 'electron',
    // //         use: {
    // //             // eslint-disable-next-line dot-notation
    // //             ...devices['electron'],
    // //             headless: false,
    // //             viewport: {width: 1440, height: 900}
    // //         }
    // //     }
    // // ]
});
