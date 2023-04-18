import { FullConfig, ElectronApplication, _electron as electron, Page } from '@playwright/test';
import { parseElectronApp } from 'electron-playwright-helpers';

async function globalSetup(config: FullConfig): Promise<void> {
    const { baseURL } = config.projects[0].use;
    let electronApp: ElectronApplication;
    let page: Page;

    const appInfo = parseElectronApp(baseURL!);
    // eslint-disable-next-line prefer-const
    electronApp = await electron.launch({
        executablePath: appInfo.executable,
        args: [appInfo.main]
    });

    electronApp.on('window', async(page) => {
        const filename = page.url()?.split('/').pop();
        console.log(`Window opened: ${filename}`);

        // capture errors
        page.on('pageerror', (error) => {
            console.error(error);
        });
        // capture console messages
        page.on('console', (msg) => {
            console.log(msg.text());
        });
    });

    // eslint-disable-next-line prefer-const, @typescript-eslint/no-unused-vars
    page = await electronApp.firstWindow();
}

export default globalSetup;