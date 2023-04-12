import { test, expect } from '@playwright/test';
import { acceptLicenseTermsAndAddDatabaseApi } from '../../../helpers/database';
import { BrowserPage } from '../../../pageObjects';
import { commonUrl, ossStandaloneConfig } from '../../../helpers/conf';
import { deleteStandaloneDatabaseApi } from '../../../helpers/api/api-database';
import { Common } from '../../../helpers/common';

const common = new Common();

let keyName = common.generateWord(10);
const keyTTL = '2147476121';
const keyFieldValue = 'hashField11111';
const keyValue = 'hashValue11111!';

test.describe('Hash Key fields verification', () => {
    test.beforeEach(async({ page }) => {
        await page.goto(commonUrl);
        await acceptLicenseTermsAndAddDatabaseApi(page, ossStandaloneConfig, ossStandaloneConfig.databaseName);
    });
    test.afterEach(async({ page }) => {
        const browserPage = new BrowserPage(page);
        await browserPage.deleteKeyByName(keyName);
        await deleteStandaloneDatabaseApi(ossStandaloneConfig);
    });

    test('Verify that user can search by full field name in Hash', async({ page }) => {
        const browserPage = new BrowserPage(page);
        const common = new Common();

        keyName = common.generateWord(10);
        await browserPage.addHashKey(keyName, keyTTL);
        // Add field to the hash key
        await browserPage.addFieldToHash(keyFieldValue, keyValue);
        // Search by full field name
        await browserPage.searchByTheValueInKeyDetails(keyFieldValue);
        // Check the search result
        const result = browserPage.hashFieldsList.nth(0).textContent();
        expect(await result).toContain(keyFieldValue);
        // Verify that user can search by part field name in Hash with pattern * in Hash
        await browserPage.secondarySearchByTheValueInKeyDetails('hashField*');
        // Check the search result
        expect(await result).toEqual(keyFieldValue);
        // Search by part field name and the * in the beggining
        await browserPage.secondarySearchByTheValueInKeyDetails('*11111');
        // Check the search result
        expect(await result).toEqual(keyFieldValue);
        // Search by part field name and the * in the middle
        await browserPage.secondarySearchByTheValueInKeyDetails('hash*11111');
        // Check the search result
        expect(await result).toEqual(keyFieldValue);
    });
});
