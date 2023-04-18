import { expect, Page } from '@playwright/test';
import { AddNewDatabaseParameters } from '../pageObjects/add-redis-database-page';
import {
    MyRedisDatabasePage,
    AddRedisDatabasePage,
    UserAgreementPage
} from '../pageObjects';
import { addNewStandaloneDatabaseApi } from './api/api-database';
import { Common } from './common';

/**
 * Add a new database manually using host and port
 * @param databaseParameters The database parameters
 */
export async function addNewStandaloneDatabase(page: Page, databaseParameters: AddNewDatabaseParameters): Promise<void> {
    const addRedisDatabasePage = new AddRedisDatabasePage(page);
    const myRedisDatabasePage = new MyRedisDatabasePage(page);
    // Fill the add database form
    await addRedisDatabasePage.addRedisDataBase(databaseParameters);
    // Click for saving
    await addRedisDatabasePage.addRedisDatabaseButton.click();
    // Wait for database to be exist
    const database = page.locator('[data-testid^=instance-name]').filter({ hasText: databaseParameters.databaseName ?? '' });
    await expect(database).toBeVisible();
    // Close message
    await myRedisDatabasePage.toastCloseButton.click();
}

/**
 * Accept License terms and add database
 * @param databaseParameters The database parameters
 * @param databaseName The database name
*/
export async function acceptLicenseTermsAndAddDatabase(page: Page, databaseParameters: AddNewDatabaseParameters, databaseName: string): Promise<void> {
    const myRedisDatabasePage = new MyRedisDatabasePage(page);
    await acceptLicenseTerms(page);
    await addNewStandaloneDatabase(page, databaseParameters);
    // Connect to DB
    await myRedisDatabasePage.clickOnDBByName(databaseName);
}

/**
 * Accept License terms and add database using api
 * @param databaseParameters The database parameters
 * @param databaseName The database name
*/
export async function acceptLicenseTermsAndAddDatabaseApi(page: Page, databaseParameters: AddNewDatabaseParameters, databaseName: string): Promise<void> {
    const common = new Common();
    const myRedisDatabasePage = new MyRedisDatabasePage(page);

    await acceptLicenseTerms(page);
    await addNewStandaloneDatabaseApi(databaseParameters);
    // Reload Page to see the new added database through api
    await common.reloadPage(page);
    // Connect to DB
    await myRedisDatabasePage.clickOnDBByName(databaseName);
}

// Accept License terms
export async function acceptLicenseTerms(page: Page): Promise<void> {
    const userAgreementPage = new UserAgreementPage(page);
    // await t.maximizeWindow();
    await userAgreementPage.acceptLicenseTerms();
}

// Accept License terms and connect to the RedisStack database
export async function acceptLicenseAndConnectToRedisStack(page: Page): Promise<void> {
    const addRedisDatabasePage = new AddRedisDatabasePage(page);
    const myRedisDatabasePage = new MyRedisDatabasePage(page);

    await acceptLicenseTerms(page);
    //Connect to DB
    await myRedisDatabasePage.myRedisDBButton.click();
    await addRedisDatabasePage.connectToRedisStackButton.click();
}

/**
 * Accept License terms and add database or connect to the Redis stask database
 * @param databaseParameters The database parameters
 * @param databaseName The database name
*/
export async function acceptTermsAddDatabaseOrConnectToRedisStack(page: Page, databaseParameters: AddNewDatabaseParameters, databaseName: string): Promise<void> {
    const addRedisDatabasePage = new AddRedisDatabasePage(page);
    if (await addRedisDatabasePage.addDatabaseButton.isVisible) {
        await acceptLicenseTermsAndAddDatabase(page, databaseParameters, databaseName);
    }
    else {
        await acceptLicenseAndConnectToRedisStack(page);
    }
}
