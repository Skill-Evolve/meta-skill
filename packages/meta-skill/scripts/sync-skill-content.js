import { existsSync, rmSync, mkdirSync, cpSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, '..');
const SOURCE_DIR = join(PKG_ROOT, '..', '..', 'meta-skill');
const GENERATED_DIR = join(PKG_ROOT, '.generated', 'meta-skill');

if (!existsSync(join(SOURCE_DIR, 'SKILL.md'))) {
  throw new Error(`Source skill directory not found at ${SOURCE_DIR}`);
}

rmSync(GENERATED_DIR, { recursive: true, force: true });
mkdirSync(join(PKG_ROOT, '.generated'), { recursive: true });
cpSync(SOURCE_DIR, GENERATED_DIR, { recursive: true });

console.log(`Synced skill content: ${SOURCE_DIR} -> ${GENERATED_DIR}`);
