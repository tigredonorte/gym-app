import * as fs from 'fs';
import * as path from 'path';
import { register } from 'tsconfig-paths';
import * as tsConfig from '../../tsconfig.base.json';

const { paths } = tsConfig.compilerOptions;
register({ baseUrl: './', paths });

import { getRealmConfig } from '../../apps/gym-api/src/app/realm.config';
const realmConfig = getRealmConfig();

// Define the output path
const outputDir = path.join(__dirname, '../keycloak-config');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Write the JSON file
fs.writeFileSync(
  path.join(outputDir, 'my-realm.json'),
  JSON.stringify(realmConfig, null, 2)
);
