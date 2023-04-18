import * as path from 'path';
// import { config as loadEnv } from 'dotenv';
// loadEnv({ path: path.join(__dirname, '..', '..', '.env') });
import type { Config, PlaywrightTestOptions, PlaywrightWorkerOptions } from '@playwright/test';

process.env.ELECTRON_PLAYWRIGHT_CONFIG = 'true';

const outputDir = path.join('test-results');
// const testDir = path.join('tests', 'electron');
const config: Config<PlaywrightWorkerOptions & PlaywrightTestOptions> = {
    // testDir: './tests/electron',
    outputDir,
    timeout: 30000,
    globalTimeout: 5400000,
    workers: process.env.CI ? 1 : undefined,
    forbidOnly: !!process.env.CI,
    preserveOutput: process.env.CI ? 'failures-only' : 'always',
    retries: process.env.CI ? 1 : 0,
    // reporter: process.env.CI ? [
    //     ['dot'],
    //     ['html']
    // ] : 'line',
    reporter: [['html'], ['allure-playwright']],
    projects: []
};

const metadata = {
    platform: process.platform,
    headful: true,
    browserName: 'electron',
    channel: undefined,
    mode: 'default',
    video: false
};

config.projects?.push({
    name: 'electron',
    use: {
        baseURL: 'http://localhost:8080',
        // baseURL: 'C:/Users/anafe/AppData/Local/Programs/redisinsight/RedisInsight-v2.exe',
        browserName: 'chromium',
        headless: false
    },
    testDir: './tests/electron',
    metadata
});

// config.projects?.push({
//     name: 'electron',
//     // Share screenshots with chromium.
//     // snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-chromium{ext}',
//     use: {
//         browserName: 'chromium'
//     },
//     testDir: path.join(testDir, 'page'),
//     metadata
// });

export default config;

// import { defineConfig, devices } from '@playwright/test';

// export default defineConfig({
//     globalSetup: require.resolve('./electron-global-setup'),
//     globalTeardown: require.resolve('./electron-global-teardown'),
//     testDir: './tests/',
//     /* Run tests in files in parallel */
//     timeout: 60 * 1000,
//     expect: {
//     /**
//      * Maximum time expect() should wait for the condition to be met.
//      * For example in `await expect(locator).toHaveText();`
//      */
//         timeout: 10000
//     },
//     fullyParallel: false,
//     /* Fail the build on CI if you accidentally left test.only in the source code. */
//     forbidOnly: !!process.env.CI,
//     /* Retry on CI only */
//     retries: process.env.CI ? 2 : 0,
//     /* Opt out of parallel tests on CI. */
//     workers: process.env.CI ? 1 : undefined,
//     /* Reporter to use. See https://playwright.dev/docs/test-reporters */
//     reporter: [['html'], ['allure-playwright']],
//     /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
//     use: {
//         /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
//         actionTimeout: 0,
//         /* Base URL to use in actions like `await page.goto('/')`. */
//         // baseURL: 'http://127.0.0.1:3000',

//         /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
//         trace: 'on-first-retry',
//         // video: 'on',
//         screenshot: 'on'
//     },
//     /* Configure projects for major browsers */
//     projects: [
//         {
//             name: 'electron',
//             use: {
//                 baseURL: 'C:/Users/anafe/AppData/Local/Programs/redisinsight/RedisInsight-v2.exe'
//             }
//         },
//         {
//             name: 'chrome',
//             use: {
//                 baseURL: `${process.env.COMMON_URL} || 'http://localhost:8080'`,
//                 // eslint-disable-next-line dot-notation
//                 ...devices['chromium'],
//                 headless: false,
//                 viewport: {width: 1440, height: 900}
//             }
//         }
//     ]
// });
