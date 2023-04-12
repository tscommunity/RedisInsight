import { expect, Locator, Page } from '@playwright/test';

export class UserAgreementPage {
    readonly page: Page;
    readonly switchOptionEula: Locator;
    readonly recommendedSwitcher: Locator;
    readonly submitButton: Locator;
    readonly userAgreementsPopup: Locator;

    constructor(page: Page) {
        this.page = page;
        this.switchOptionEula = page.locator('[data-testid=switch-option-eula]');
        this.recommendedSwitcher = page.locator('[data-testid=switch-option-recommended]');
        this.submitButton = page.locator('[data-testid=btn-submit]');
        this.userAgreementsPopup = page.locator('[data-testid=consents-settings-popup]');
    }

    //Accept RedisInsight License Terms
    async acceptLicenseTerms(): Promise<void> {
        if (await this.switchOptionEula.isVisible()) {
            await this.recommendedSwitcher.click();
            await this.switchOptionEula.click();
            await this.submitButton.click();
            await expect(this.userAgreementsPopup).not.toBeVisible();
        }
    }
}
