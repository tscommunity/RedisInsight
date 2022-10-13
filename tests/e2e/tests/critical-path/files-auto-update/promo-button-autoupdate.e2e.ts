import { join } from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { Chance } from 'chance';
import * as editJsonFile from 'edit-json-file';
import { acceptLicenseTerms } from '../../../helpers/database';
import { MyRedisDatabasePage } from '../../../pageObjects';
import { commonUrl } from '../../../helpers/conf';
import { env } from '../../../helpers/constants';

const myRedisDatabasePage = new MyRedisDatabasePage();
const chance = new Chance();

const workingDirectory = process.env.APP_FOLDER_ABSOLUTE_PATH
  || (join(os.homedir(), process.env.APP_FOLDER_NAME || '.redisinsight-v2'));
if (fs.existsSync(workingDirectory)) {
    const timestampPromoButtonPath = `${workingDirectory}/content/build.json`;
    const contentPromoButtonPath = `${workingDirectory}/content/create-redis.json`;
    const timestampPromoButtonFile = editJsonFile(timestampPromoButtonPath);
    const contentPromoButtonFile = editJsonFile(contentPromoButtonPath);
    const timestampBeforeUpdate = timestampPromoButtonFile.get('timestamp');
    const newTimestamp = timestampBeforeUpdate - 1;
    const newPromoButtonText = chance.word({ length: 10 });

    //Edit json file values
    contentPromoButtonFile.set('cloud.title', newPromoButtonText);
    contentPromoButtonFile.set('cloud.description', newPromoButtonText);
    contentPromoButtonFile.save();
    timestampPromoButtonFile.set('timestamp', newTimestamp);
    timestampPromoButtonFile.save();

    fixture `Automatically update information`
        .meta({type: 'critical_path'})
        .page(commonUrl)
        .beforeEach(async() => {
            await acceptLicenseTerms();
        });
    test
        .meta({ env: env.desktop })('Verify that user has the ability to update "Create free database" button without changing the app', async t => {
            // Create new file paths due to cache-ability
            const timestampPathNew = editJsonFile(timestampPromoButtonPath);
            const contentPathNew = editJsonFile(contentPromoButtonPath);
            // Check the promo button after the opening of app
            await t.expect(myRedisDatabasePage.promoButton.textContent).notContains(newPromoButtonText, 'Promo button text is not updated');
            // Get the values from build.json and create-redis.json files
            const actualTimestamp = await timestampPathNew.get('timestamp');
            const actualPromoButtonTitle = await contentPathNew.get('cloud.title');
            const actualPromoButtonDescription = await contentPathNew.get('cloud.description');
            // Check the json files are automatically updated
            await t.expect(actualPromoButtonTitle).notEql(newPromoButtonText, 'The cloud title in the create-redis.json file is automatically updated');
            await t.expect(actualPromoButtonDescription).notEql(newPromoButtonText, 'The cloud description in the create-redis.json file is automatically updated');
            await t.expect(actualTimestamp).notEql(newTimestamp, 'The timestamp in the build.json file is automatically updated');
        });
}
