import { test, expect } from '../../fixtures/electron-fixtures2';
import { acceptLicenseTermsAndAddDatabaseApi } from '../../helpers/database';
import { ossStandaloneConfig } from '../../helpers/conf';
import { deleteStandaloneDatabaseApi } from '../../helpers/api/api-database';
import { Common } from '../../helpers/common';

const keyTTL = '2147476121';
const keyFieldValue = 'hashField11111';
const keyValue = 'hashValue11111!';

test.skip('Hash Key fields verification1', () => {
    const common = new Common();
    let keyName = common.generateWord(10);

    test.beforeEach(async({ page }) => {
        await acceptLicenseTermsAndAddDatabaseApi(page, ossStandaloneConfig, ossStandaloneConfig.databaseName);
    });
    test.afterEach(async({ browserPage }) => {
        await browserPage.deleteKeyByName(keyName);
        await deleteStandaloneDatabaseApi(ossStandaloneConfig);
    });

    test('Verify that user can search by full field name in Hash1', async({ browserPage }) => {
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
    test('Verify that user can search by full field name in Hash2', async({ browserPage }) => {
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
