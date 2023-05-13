import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import openapiTS from 'openapi-typescript';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const API_SPEC_PATH = path.join(
  dirname,
  '../space-traders-api-docs',
  'reference/SpaceTraders.json'
);

const output = await openapiTS(new URL(API_SPEC_PATH, import.meta.url));

const output_dir = path.join(dirname, '../generated-schema');
if (!existsSync(output_dir)) {
  mkdirSync(output_dir, { recursive: true });
}
writeFileSync(new URL(path.join(output_dir, 'schema.ts'), import.meta.url), output);
