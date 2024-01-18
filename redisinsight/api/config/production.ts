import { join } from 'path';
import * as os from 'os';

const homedir = process.env.RI_APP_FOLDER_ABSOLUTE_PATH
  || (join(os.homedir(), process.env.RI_APP_FOLDER_NAME || '.redisinsight-app'));

const prevHomedir = join(os.homedir(), '.redisinsight-v2');

export default {
  dir_path: {
    homedir,
    prevHomedir,
    logs: join(homedir, 'logs'),
    customPlugins: join(homedir, 'plugins'),
    customTutorials: join(homedir, 'custom-tutorials'),
    commands: join(homedir, 'commands'),
    guides: process.env.RI_GUIDES_PATH || join(homedir, 'guides'),
    tutorials: process.env.RI_TUTORIALS_PATH || join(homedir, 'tutorials'),
    content: process.env.RI_CONTENT_PATH || join(homedir, 'content'),
    caCertificates: join(homedir, 'ca_certificates'),
    clientCertificates: join(homedir, 'client_certificates'),
  },
  server: {
    env: 'production',
  },
  analytics: {
    writeKey: process.env.RI_SEGMENT_WRITE_KEY || 'lK5MNZgHbxj6vQwFgqZxygA0BiDQb32n',
    flushInterval: parseInt(process.env.RI_ANALYTICS_FLUSH_INTERVAL, 10) || 10000,
  },
  db: {
    database: join(homedir, 'redisinsight.db'),
  },
  cloud: {
    cApiUrl: process.env.RI_CLOUD_CAPI_URL || 'https://api.redislabs.com/v1',
  },
};
