import { rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, '..');
const GENERATED_ROOT = join(PKG_ROOT, '.generated');

rmSync(GENERATED_ROOT, { recursive: true, force: true });

console.log(`Cleaned generated content: ${GENERATED_ROOT}`);
