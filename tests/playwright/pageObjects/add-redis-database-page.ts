import { Locator, Page } from '@playwright/test';

export class AddRedisDatabasePage {
    readonly page: Page;
    readonly addDatabaseButton: Locator;
    readonly addRedisDatabaseButton: Locator;
    readonly addDatabaseManually: Locator;
    readonly hostInput: Locator;
    readonly portInput: Locator;
    readonly databaseAliasInput: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly connectToRedisStackButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addDatabaseButton = page.locator('[data-testid=add-redis-database]');
        this.addRedisDatabaseButton = page.locator('[data-testid=btn-submit]');
        this.addDatabaseManually = page.locator('[data-testid=add-manual]');
        this.hostInput = page.locator('[data-testid=host]');
        this.portInput = page.locator('[data-testid=port]');
        this.databaseAliasInput = page.locator('[data-testid=name]');
        this.usernameInput = page.locator('[data-testid=username]');
        this.passwordInput = page.locator('[data-testid=password]');
        this.connectToRedisStackButton = page.locator('[aria-label="Connect to database"]');
    }

    /**
     * Adding a new redis database
     * @param parameters the parameters of the database
     */
    async addRedisDataBase(parameters: AddNewDatabaseParameters): Promise<void> {
        // await this.addDatabaseButton.with({ visibilityCheck: true, timeout: 10000 })();
        await this.addDatabaseButton.click();
        await this.addDatabaseManually.click();
        await this.hostInput.fill(parameters.host, {force: true});
        await this.portInput.fill(parameters.port, {force: true});
        await this.databaseAliasInput.fill(parameters.databaseName!, {force: true});
        if (!!parameters.databaseUsername) {
            await this.usernameInput.fill(parameters.databaseUsername, {force: true});
        }
        if (!!parameters.databasePassword) {
            await this.passwordInput.fill(parameters.databasePassword, {force: true});
        }
    }
}

/**
 * Add new database parameters
 * @param host The hostname of the database
 * @param port The port of the database
 * @param databaseName The name of the database
 * @param databaseUsername The username of the database
 * @param databasePassword The password of the database
 */
export type AddNewDatabaseParameters = {
    host: string,
    port: string,
    databaseName?: string,
    databaseUsername?: string,
    databasePassword?: string,
    caCert?: {
        name?: string,
        certificate?: string
    },
    clientCert?: {
        name?: string,
        certificate?: string,
        key?: string
    }
};

/**
 * Already existing database parameters
 * @param id The id of the database
 * @param host The host of the database
 * @param port The port of the database
 * @param name The name of the database
 * @param connectionType The connection type of the database
 * @param lastConnection The last connection time of the database
 */
export type databaseParameters = {
    id: string,
    host?: string,
    port?: string,
    name?: string,
    connectionType?: string,
    lastConnection?: string
};
