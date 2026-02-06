import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const SUPPORTED_AGENTS = [
  { name: 'Claude Code', configDir: '.claude', skillsDir: 'skills' },
  { name: 'Cursor', configDir: '.cursor', skillsDir: 'skills' },
  { name: 'Codex (OpenAI)', configDir: '.codex', skillsDir: 'skills' },
  { name: 'Gemini CLI', configDir: '.gemini', skillsDir: 'skills' },
  { name: 'Qwen Code', configDir: '.qwen', skillsDir: 'skills' },
  { name: 'OpenCode', configDir: '.config/opencode', skillsDir: 'skills' },
  { name: 'OpenClaw', configDir: '.openclaw', skillsDir: 'skills' },
  { name: 'Shared Agents', configDir: '.agents', skillsDir: 'skills' },
];

export function detectAgents() {
  const home = homedir();
  const detected = [];

  for (const agent of SUPPORTED_AGENTS) {
    const configPath = join(home, agent.configDir);
    if (existsSync(configPath)) {
      detected.push({
        ...agent,
        fullPath: configPath,
        skillsPath: join(configPath, agent.skillsDir),
      });
    }
  }

  return detected;
}
