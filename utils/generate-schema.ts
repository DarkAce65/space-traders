import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import openapiTS from 'openapi-typescript';

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const API_SPEC_PATH = path.join(
  DIRNAME,
  '../space-traders-api-docs',
  'reference/SpaceTraders.json'
);

const output = await openapiTS(new URL(API_SPEC_PATH, import.meta.url));

const outputDir = path.join(DIRNAME, '../generated-schema');
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}
writeFileSync(new URL(path.join(outputDir, 'schema.ts'), import.meta.url), output);
