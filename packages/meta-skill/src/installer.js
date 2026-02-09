import { existsSync, mkdirSync, cpSync, rmSync, symlinkSync, readlinkSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, '..');
const SKILL_SRC_CANDIDATES = [
  // Preferred for published package tarballs.
  join(PKG_ROOT, '.generated', 'meta-skill'),
  // Backward compatibility for older package layouts.
  join(PKG_ROOT, 'meta-skill'),
  // Preferred for local repo development.
  join(PKG_ROOT, '..', '..', 'meta-skill'),
];
const CANONICAL_DIR = join(homedir(), '.skillevolve', 'skill');

export function install(agents) {
  const skillSrc = resolveSkillSource();

  // Step 1: Copy skill content to canonical location (~/.skillevolve/skill/)
  console.log(`\n  Installing meta-skill to ${CANONICAL_DIR.replace(homedir(), '~')}...`);

  if (existsSync(CANONICAL_DIR)) {
    rmSync(CANONICAL_DIR, { recursive: true });
  }
  mkdirSync(CANONICAL_DIR, { recursive: true });
  cpSync(skillSrc, CANONICAL_DIR, { recursive: true });
  console.log('  Canonical copy installed.\n');

  // Step 2: Symlink into each detected agent's skills directory
  const results = [];

  for (const agent of agents) {
    const targetDir = join(agent.skillsPath, 'meta-skill');

    try {
      mkdirSync(agent.skillsPath, { recursive: true });

      // Remove existing install (symlink or directory)
      if (existsSync(targetDir)) {
        const isSymlink = isSymlinkAt(targetDir);
        rmSync(targetDir, { recursive: true });
        if (isSymlink) {
          console.log(`  ${agent.name}: Replaced existing symlink`);
        } else {
          console.log(`  ${agent.name}: Replaced existing directory`);
        }
      }

      symlinkSync(CANONICAL_DIR, targetDir, 'dir');
      console.log(`  ${agent.name}: Linked ${targetDir.replace(homedir(), '~')} -> canonical`);
      results.push({ agent: agent.name, success: true });
    } catch (err) {
      console.error(`  ${agent.name}: Failed - ${err.message}`);
      results.push({ agent: agent.name, success: false, error: err.message });
    }
  }

  return results;
}

export function uninstall(agents) {
  console.log('\n  Uninstalling meta-skill...');
  const results = [];

  for (const agent of agents) {
    const targetDir = join(agent.skillsPath, 'meta-skill');
    try {
      if (existsSync(targetDir)) {
        rmSync(targetDir, { recursive: true });
        console.log(`  ${agent.name}: Removed ${targetDir.replace(homedir(), '~')}`);
        results.push({ agent: agent.name, success: true });
      } else {
        console.log(`  ${agent.name}: Not installed, skipping`);
        results.push({ agent: agent.name, success: true, skipped: true });
      }
    } catch (err) {
      console.error(`  ${agent.name}: Failed - ${err.message}`);
      results.push({ agent: agent.name, success: false, error: err.message });
    }
  }

  // Remove canonical copy
  if (existsSync(CANONICAL_DIR)) {
    rmSync(CANONICAL_DIR, { recursive: true });
    console.log(`  Removed canonical copy at ${CANONICAL_DIR.replace(homedir(), '~')}`);
  }

  return results;
}

function isSymlinkAt(p) {
  try {
    readlinkSync(p);
    return true;
  } catch {
    return false;
  }
}

function resolveSkillSource() {
  for (const candidate of SKILL_SRC_CANDIDATES) {
    if (existsSync(join(candidate, 'SKILL.md'))) {
      return candidate;
    }
  }

  throw new Error(
    `Unable to locate skill content. Tried: ${SKILL_SRC_CANDIDATES.join(', ')}`
  );
}
