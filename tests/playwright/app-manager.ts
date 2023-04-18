import { ElectronApplication, Page } from '@playwright/test';

let electronApp: ElectronApplication;
let electronPage: Page;

export function setApp(app: ElectronApplication): void {
    electronApp = app;
}

export function getApp(): ElectronApplication {
    return electronApp;
}

export function setPage(page: Page): void {
    electronPage = page;
}

export function getPage(): Page {
    return electronPage;
}