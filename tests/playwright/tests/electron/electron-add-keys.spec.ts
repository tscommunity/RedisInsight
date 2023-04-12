import { _electron as electron, test, expect, ElectronApplication, Page } from '@playwright/test';
import { ossStandaloneConfig } from '../../helpers/conf';
import { BrowserPage } from '../../pageObjects';
import { acceptTermsAddDatabaseOrConnectToRedisStack } from '../../helpers/database';
import { Common } from '../../helpers/common';

test.describe('Add keys1', () => {
    const common = new Common();
    let electronApp: ElectronApplication;
    let firstWindow: Page;

    test.beforeAll(async() => {
        electronApp = await electron.launch({ executablePath: 'C:/Users/anafe/AppData/Local/Programs/redisinsight/RedisInsight-v2.exe', args: ['.']});
        firstWindow = await electronApp.firstWindow();
    });

    test.beforeEach(async() => {
        // await page.goto(commonUrl);
        await acceptTermsAddDatabaseOrConnectToRedisStack(firstWindow, ossStandaloneConfig, ossStandaloneConfig.databaseName);
    });

    test.only('Verify that user can add Hash Key1', async() => {
        const browserPage = new BrowserPage(firstWindow);

        const keyName = common.generateWord(10);
        // Add Hash key
        await browserPage.addHashKey(keyName);
        // Check the notification message
        const notification = await browserPage.getMessageText();
        expect(notification).toContain('Key has been added');
        // Check that new key is displayed in the list
        await browserPage.searchByKeyName(keyName);
        const isKeyIsDisplayedInTheList = await browserPage.isKeyIsDisplayedInTheList(keyName);
        expect(isKeyIsDisplayedInTheList).toBeTruthy();
    });

    test.afterAll(async() => {
        await electronApp.close();
    });
});
