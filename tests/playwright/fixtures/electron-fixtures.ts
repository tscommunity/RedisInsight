// import * as path from 'path';
// import e2c from 'electron-to-chromium';
import { parseElectronApp } from 'electron-playwright-helpers';
import type { ElectronApplication, Page } from '@playwright/test';
import { myFixtures } from './pages-fixtures';
import type { PageTestFixtures, PageWorkerFixtures } from './page-worker-fixtures';
export { expect } from '@playwright/test';

type ElectronTestFixtures = PageTestFixtures & {
  electronApp: ElectronApplication,
  launchElectronApp: (appFile: string) => Promise<ElectronApplication>,
  newWindow: () => Promise<Page>
};

// const electronVersion = require('..electron/package.json').version;
// const electronVersion = '^19.0.7';
// const chromiumVersion = e2c.fullVersions[electronVersion];
// expect(chromiumVersion).toBeTruthy();

export const electronTest = myFixtures.extend<ElectronTestFixtures, PageWorkerFixtures>({
    // browserVersion: [chromiumVersion, { scope: 'worker' }],
    // browserMajorVersion: [Number(chromiumVersion.split('.')[0]), { scope: 'worker' }],
    isAndroid: [false, { scope: 'worker' }],
    isElectron: [true, { scope: 'worker' }],
    isWebView2: [false, { scope: 'worker' }],

    launchElectronApp: async({ playwright }, use) => {
    // This env prevents 'Electron Security Policy' console message.
        process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
        const apps: ElectronApplication[] = [];
        await use(async(appFile: string) => {
            const appInfo = parseElectronApp(appFile);
            const app = await playwright._electron.launch({
                executablePath: appInfo.executable,
                args: [appInfo.main]
            });
            apps.push(app);
            return app;
        });
        for (const app of apps) {
            await app.close();
        }
    },

    electronApp: async({ launchElectronApp }, use) => {
        await use(await launchElectronApp('C:/Users/anafe/AppData/Local/Programs/redisinsight/RedisInsight-v2.exe'));
    },

    newWindow: async({ electronApp }, run) => {
        const windows: Page[] = [];
        await run(async() => {
            const [window] = await Promise.all([
                electronApp.waitForEvent('window'),
                electronApp.evaluate(async electron => {
                    // Avoid "Error: Cannot create BrowserWindow before app is ready".
                    await electron.app.whenReady();
                    const window = new electron.BrowserWindow({
                        width: 800,
                        height: 600,
                        // Sandboxed windows share process with their window.open() children
                        // and can script them. We use that heavily in our tests.
                        webPreferences: { sandbox: true }
                    });
                    window.loadURL('about:blank');
                })
            ]);
            windows.push(window);
            return window;
        });
        for (const window of windows) {
            await window.close();
        }
    },

    page: async({ newWindow }, run) => {
        await run(await newWindow());
    },

    context: async({ electronApp }, run) => {
        await run(electronApp.context());
    }
});