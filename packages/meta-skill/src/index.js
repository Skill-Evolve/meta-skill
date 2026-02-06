import { detectAgents } from './agents.js';
import { install, uninstall } from './installer.js';

const HELP = `
  Usage: npx @skill-evolve/meta-skill [command]

  Commands:
    install     Install meta-skill to all detected agents (default)
    uninstall   Remove meta-skill from all agents
    detect      List detected agents on this machine
    help        Show this help message
`;

export async function main() {
  const command = process.argv[2] || 'install';

  console.log('\n  SkillEvolve Meta-Skill\n');

  if (command === 'help' || command === '--help' || command === '-h') {
    console.log(HELP);
    return;
  }

  // Detect agents
  const agents = detectAgents();

  if (agents.length === 0) {
    console.log('  No supported agents detected on this machine.');
    console.log('  Supported: Claude Code, Cursor, Codex, Gemini CLI, Qwen Code, OpenCode, OpenClaw\n');
    process.exit(1);
  }

  console.log(`  Detected ${agents.length} agent(s):`);
  for (const agent of agents) {
    console.log(`    - ${agent.name} (${agent.fullPath.replace(process.env.HOME, '~')})`);
  }

  switch (command) {
    case 'install':
      install(agents);
      console.log('\n  Done! The meta-skill is now available to all your agents.\n');
      break;

    case 'uninstall':
      uninstall(agents);
      console.log('\n  Done! Meta-skill has been removed.\n');
      break;

    case 'detect':
      // Already printed above
      console.log('');
      break;

    default:
      console.log(`  Unknown command: ${command}`);
      console.log(HELP);
      process.exit(1);
  }
}
