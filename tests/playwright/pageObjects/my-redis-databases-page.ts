import { expect, Locator, Page } from '@playwright/test';

export class MyRedisDatabasePage {
    readonly page: Page;
    readonly dbNameList: Locator;
    readonly toastCloseButton: Locator;
    readonly myRedisDBButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dbNameList = page.locator('[data-testid^=instance-name]');
        this.toastCloseButton = page.locator('[data-test-subj=toastCloseButton]');
        this.myRedisDBButton = page.locator('[data-test-subj=home-page-btn]');
    }

    /**
     * Click on the database by name
     * @param dbName The name of the database to be opened
     */
    async clickOnDBByName(dbName: string): Promise<void> {
        if (await this.toastCloseButton.isVisible()) {
            await this.toastCloseButton.click();
        }
        const database = this.dbNameList.filter({ hasText: dbName.trim() }).first();
        await expect(database).toBeVisible();
        await database.click();
    }
}
