import { parseElectronApp } from 'electron-playwright-helpers';
import type { Fixtures, BrowserContext, ElectronApplication, Page} from '@playwright/test';
import { _electron as electron } from '@playwright/test';
import { myFixtures } from './pages-fixtures';
export { expect } from '@playwright/test';
export const isElectron = process.env.ELECTRON_PLAYWRIGHT_CONFIG === 'true';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// const disableSave = () => window.localStorage.setItem('E2E_IGNORE_SAVE', 'true');

type ElectronTestFixtures = {
  electronApp: ElectronApplication,
  newWindow: () => Promise<Page>,
  page: Page,
  context: BrowserContext
};

const electronFixtures: Fixtures<ElectronTestFixtures> = {
    electronApp: async({}, run) => {
        // This env prevents 'Electron Security Policy' console message.
        process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
        const appInfo = parseElectronApp('C:/Users/anafe/AppData/Local/Programs/redisinsight/RedisInsight-v2.exe');
        const electronApp = await electron.launch({
            // executablePath: appInfo.executable,
            // args: [appInfo.main],
            args: ['.'],
            executablePath: appInfo.executable
        });
        await run(electronApp);
        await electronApp.close();
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
                    // window.loadURL('https://localhost:5001/');
                    await window.focus();
                    window.webContents.on('did-finish-load', function() {
                        window.show();
                    });
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
        // await run(await electronApp.firstWindow());
        await run(await newWindow());
    },
    context: async({ electronApp }, run) => {
        await run(electronApp.context());
    }
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore some error about a string type now having `undefined` as part of it's union
// export const test = base.extend<ElectronTestFixtures>(electronFixtures);
const electronTest = myFixtures.extend<ElectronTestFixtures>(electronFixtures);
const browserTest = myFixtures;
export const test = isElectron ? electronTest : browserTest;