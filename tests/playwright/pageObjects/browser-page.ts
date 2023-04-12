import { Locator, Page } from '@playwright/test';
import { Common } from '../helpers/common';

const common = new Common();

export class BrowserPage {
    readonly page: Page;
    readonly hashDeleteButton: Locator;
    readonly progressLine: Locator;
    readonly loader: Locator;
    readonly plusAddKeyButton: Locator;
    readonly keyTypeDropDown: Locator;
    readonly hashOption: Locator;
    readonly addKeyNameInput: Locator;
    readonly keyTTLInput: Locator;
    readonly hashFieldNameInput: Locator;
    readonly hashFieldValueInput: Locator;
    readonly addKeyButton: Locator;
    readonly filterByPatterSearchInput: Locator;
    readonly notificationMessage: Locator;
    readonly keyNameInTheList: Locator;
    readonly deleteKeyButton: Locator;
    readonly confirmDeleteKeyButton: Locator;
    readonly toastCloseButton: Locator;
    readonly addKeyValueItemsButton: Locator;
    readonly hashFieldInput: Locator;
    readonly hashValueInput: Locator;
    readonly saveHashFieldButton: Locator;
    readonly searchButtonInKeyDetails: Locator;
    readonly searchInput: Locator;
    readonly hashFieldsList: Locator;

    constructor(page: Page) {
        this.page = page;
        this.hashDeleteButton = page.locator('[data-testid=hash-delete-btn]');
        this.progressLine = page.locator('div.euiProgress').first();
        this.loader = page.locator('[data-testid=type-loading]').first();
        this.plusAddKeyButton = page.locator('[data-testid=btn-add-key]');
        this.keyTypeDropDown = page.locator('fieldset button.euiSuperSelectControl');
        this.hashOption = page.locator('#hash');
        this.addKeyNameInput = page.locator('[data-testid=key]');
        this.keyTTLInput = page.locator('[data-testid=ttl]');
        this.hashFieldNameInput = page.locator('[data-testid=field-name]');
        this.hashFieldValueInput = page.locator('[data-testid=field-value]');
        this.addKeyButton = page.getByText('Add Key');
        this.filterByPatterSearchInput = page.locator('[data-testid=search-key]');
        this.notificationMessage = page.locator('[data-test-subj=euiToastHeader]');
        this.keyNameInTheList = page.locator('[data-testid^=key-]').first();
        this.deleteKeyButton = page.locator('[data-testid=delete-key-btn]');
        this.confirmDeleteKeyButton = page.locator('[data-testid=delete-key-confirm-btn]');
        this.toastCloseButton = page.locator('[data-test-subj=toastCloseButton]');
        this.addKeyValueItemsButton = page.locator('[data-testid=add-key-value-items-btn]');
        this.hashFieldInput = page.locator('[data-testid=hash-field]');
        this.hashValueInput = page.locator('[data-testid=hash-value]');
        this.saveHashFieldButton = page.locator('[data-testid=save-fields-btn]');
        this.searchButtonInKeyDetails = page.locator('[data-testid=search-button]');
        this.searchInput = page.locator('[data-testid=search]');
        this.hashFieldsList = page.locator('[data-testid^=hash-field-] span');
    }

    /**
     * Adding a new Hash key
     * @param keyName The name of the key
     * @param TTL The Time to live value of the key
     * @param field The field name of the key
     * @param value The value of the key
     */
    async addHashKey(keyName: string, TTL = ' ', field = ' ', value = ' '): Promise<void> {
        await common.waitForElementNotVisible(this.progressLine);
        await common.waitForElementNotVisible(this.loader);
        await this.plusAddKeyButton.click();
        await this.keyTypeDropDown.click();
        await this.hashOption.click();
        await this.addKeyNameInput.click();
        await this.addKeyNameInput.fill(keyName, {force: true});
        await this.keyTTLInput.click();
        await this.keyTTLInput.fill(TTL, {force: true});
        await this.hashFieldNameInput.fill(field, {force: true});
        await this.hashFieldValueInput.fill(value, {force: true});
        await this.addKeyButton.click();
    }

    /**
     * Searching by Key name in the list
     * @param keyName The name of the key
     */
    async searchByKeyName(keyName: string): Promise<void> {
        await this.filterByPatterSearchInput.click();
        await this.filterByPatterSearchInput.type(keyName);
        await this.page.keyboard.press('Enter');
    }

    // /**
    //  * Get selector by key name
    //  * @param keyName The name of the key
    //  */
    // async getKeySelectorByName(keyName: string): Promise<Selector> {
    //     return Selector(`[data-testid="key-${keyName}"]`);
    // }

    /**
     * Verifying if the Key is in the List of keys
     * @param keyName The name of the key
     */
    async isKeyIsDisplayedInTheList(keyName: string): Promise<boolean> {
        const keyNameInTheList = await this.page.locator(`[data-testid="key-${keyName}"]`);
        await common.waitForElementNotVisible(this.loader);
        return keyNameInTheList.isVisible();
    }

    //Getting the text of the Notification message
    async getMessageText(): Promise<string | null> {
        return await this.notificationMessage.textContent();
    }

    /**
     * Add field to hash key
     * @param keyFieldValue The value of the hash field
     * @param keyValue The hash value
     */
    async addFieldToHash(keyFieldValue: string, keyValue: string): Promise<void> {
        if (await this.toastCloseButton.isVisible()) {
            await this.toastCloseButton.click();
        }
        await this.addKeyValueItemsButton.click();
        await this.hashFieldInput.fill(keyFieldValue, {force: true});
        await this.hashValueInput.fill(keyValue, {force: true});
        await this.saveHashFieldButton.click();
    }

    /**
     * Search by the value in the key details
     * @param value The value of the search parameter
     */
    async searchByTheValueInKeyDetails(value: string): Promise<void> {
        await this.searchButtonInKeyDetails.click();
        await this.searchInput.fill(value, {force: true});
        await this.page.keyboard.press('Enter');
    }

    /**
     * Search by the value in the key details
     * @param value The value of the search parameter
     */
    async secondarySearchByTheValueInKeyDetails(value: string): Promise<void> {
        await this.searchInput.fill(value, {force: true});
        await this.page.keyboard.press('Enter');
    }

    // //Delete key from details
    // async deleteKey(): Promise<void> {
    //     if (await this.toastCloseButton.exists) {
    //         await t.click(this.toastCloseButton);
    //     }
    //     await t.click(this.keyNameInTheList);
    //     await t.click(this.deleteKeyButton);
    //     await t.click(this.confirmDeleteKeyButton);
    // }

    /**
     * Delete key by Name from details
     * @param keyName The name of the key
     */
    async deleteKeyByName(keyName: string): Promise<void> {
        await this.searchByKeyName(keyName);
        await this.keyNameInTheList.click();
        await this.deleteKeyButton.click();
        await this.confirmDeleteKeyButton.click();
    }

    // /**
    //  * Delete keys by their Names
    //  * @param keyNames The names of the key array
    //  */
    // async deleteKeysByNames(keyNames: string[]): Promise<void> {
    //     for (const name of keyNames) {
    //         await this.deleteKeyByName(name);
    //     }
    // }
}

/**
 * Add new keys parameters
 * @param keyName The name of the key
 * @param TTL The ttl of the key
 * @param value The value of the key
 * @param members The members of the key
 * @param scores The scores of the key member
 * @param field The field of the key
 */
export type AddNewKeyParameters = {
    keyName: string,
    value?: string,
    TTL?: string,
    members?: string,
    scores?: string,
    field?: string,
    fields?: [{
        field?: string,
        valuse?: string
    }]
};

/**
 * Hash key parameters
 * @param keyName The name of the key
 * @param fields The Array with fields
 * @param field The field of the field
 * @param value The value of the field

 */
export type HashKeyParameters = {
    keyName: string,
    fields: {
        field: string,
        value: string
    }[]
};

/**
 * Stream key parameters
 * @param keyName The name of the key
 * @param entries The Array with entries
 * @param id The id of entry
 * @param fields The Array with fields
 */
export type StreamKeyParameters = {
    keyName: string,
    entries: {
        id: string,
        fields: string[][]
    }[]
};

/**
 * Set key parameters
 * @param keyName The name of the key
 * @param members The Array with members
 */
export type SetKeyParameters = {
    keyName: string,
    members: string[]
};

/**
 * Sorted Set key parameters
 * @param keyName The name of the key
 * @param members The Array with members
 * @param name The name of the member
 * @param id The id of the member
 */
export type SortedSetKeyParameters = {
    keyName: string,
    members: {
        name: string,
        score: string
    }[]
};

/**
 * List key parameters
 * @param keyName The name of the key
 * @param element The element in list
 */
export type ListKeyParameters = {
    keyName: string,
    element: string
};

/**
 * The key arguments for multiple keys/fields adding
 * @param keysCount The number of keys to add
 * @param fieldsCount The number of fields in key to add
 * @param elementsCount The number of elements in key to add
 * @param membersCount The number of members in key to add
 * @param keyName The full key name
 * @param keyNameStartWith The name of key should start with
 * @param fieldStartWitht The name of field should start with
 * @param fieldValueStartWith The name of field value should start with
 * @param elementStartWith The name of element should start with
 * @param memberStartWith The name of member should start with
 */

export type AddKeyArguments = {
    keysCount?: number,
    fieldsCount?: number,
    elementsCount?: number,
    membersCount?: number,
    keyName?: string,
    keyNameStartWith?: string,
    fieldStartWith?: string,
    fieldValueStartWith?: string,
    elementStartWith?: string,
    memberStartWith?: string
};

/**
 * Keys Data parameters
 * @param textType The type of the key
 * @param keyName The name of the key
 */
export type KeyData = {
    textType: string,
    keyName: string
}[];
