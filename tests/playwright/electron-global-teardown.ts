import { getApp } from './app-manager';

async function globalTeardown(): Promise<void> {
    await getApp().close();
}

export default globalTeardown;