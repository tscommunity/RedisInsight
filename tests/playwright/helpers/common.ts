import { Page, expect } from '@playwright/test';
import { Chance } from 'chance';
import { apiUrl } from './conf';

const chance = new Chance();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // lgtm[js/disabling-certificate-validation]

export class Common {
    async waitForElementNotVisible(elm: any): Promise<void> {
        await expect(elm).not.toBeVisible();
    }

    /**
    * Generate word by number of symbols
    * @param number The number of symbols
    */
    generateWord(number: number): string {
        return chance.word({ length: number });
    }

    /**
    * Return api endpoint with disabled certificate validation
    */
    getEndpoint(): string {
        return apiUrl;
    }

    /**
    * Reload page
    */
    async reloadPage(page: Page): Promise<void> {
        await page.reload();
    }
}
