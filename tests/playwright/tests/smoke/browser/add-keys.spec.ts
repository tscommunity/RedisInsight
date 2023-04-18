import { test, expect } from '../../../fixtures/electron-fixtures2';
import { commonUrl, ossStandaloneConfig } from '../../../helpers/conf';
import { acceptTermsAddDatabaseOrConnectToRedisStack } from '../../../helpers/database';
import { Common } from '../../../helpers/common';

test.describe('Add keys', () => {
    const common = new Common();

    test.beforeEach(async({ page }) => {
        await page.goto(commonUrl);
        await acceptTermsAddDatabaseOrConnectToRedisStack(page, ossStandaloneConfig, ossStandaloneConfig.databaseName);
    });

    test('Verify that user can add Hash Key', async({ browserPage }) => {
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
});
