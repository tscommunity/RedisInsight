import { _electron as electron } from '@playwright/test';

// const config: PlaywrightTestConfig = {
//     testDir: './tests',
//     reporter: [
//         ['list'],
//         ['junit', { outputDir: './results', outputFileFormat: '{test}.xml' }],
//         ['json', { outputFile: './results/e2e.results.json' }]
//     ],
//     retries: 2
// };

(async(): Promise<void> => {
    // Launch Electron app.
    const electronApp = await electron.launch({ executablePath: 'C:/Users/anafe/AppData/Local/Programs/redisinsight/RedisInsight-v2.exe' });

    // Evaluation expression in the Electron context.
    const appPath = await electronApp.evaluate(async({ app }) => {
        // This runs in the main Electron process, parameter here is always
        // the result of the require('electron') in the main app script.
        return app.getAppPath();
    });
    console.log(appPath);

    // Get the first window that the app opens, wait if necessary.
    const window = await electronApp.firstWindow();
    // Print the title.
    console.log(await window.title());
    await electronApp.windows();
    // Capture a screenshot.
    // await window.screenshot({ path: 'intro.png' });
    // Direct Electron console to Node terminal.
    // window.on('console', console.log);

    // Exit app.
    await electronApp.close();
})();

// Click button.
// await window.click('text=Click me');