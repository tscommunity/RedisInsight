import { ElectronApplication, Page } from '@playwright/test';
/* eslint-disable no-var */

declare global {
    var electronApp: ElectronApplication;
    var electronPage: Page;
  }

export {};