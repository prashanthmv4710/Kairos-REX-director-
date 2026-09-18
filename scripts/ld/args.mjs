/**
 * cli/engine/args.mjs — dependency-free argv parsing.
 *
 * The engine ships into user projects, so it cannot depend on commander (or
 * anything else). FLAGS is the single spec: this parser reads it, and the
 * published bin's commander adapter registers from it, so the two invocation
 * paths cannot drift apart. A test asserts that correspondence.
 *
 * Ships verbatim into generated projects as scripts/ld/args.mjs.
 */

/** value: 'string' | 'number' | 'boolean' */
export const FLAGS = {
  budget: {value: 'number', help: 'Token budget for `context` (default 6000)'},
  limit: {value: 'number', help: 'Max results per list for `search`'},
  only: {value: 'string', help: 'Restrict `search` to: rules | components'},
  root: {value: 'string', help: 'Project root override (else auto-detected)'},
  json: {value: 'boolean', help: 'Machine-readable output'},
  scores: {value: 'boolean', help: 'Show ranking scores (`explain`)'},
  help: {value: 'boolean', help: 'Show usage'},
};

export const COMMANDS = {
  context: 'Assemble the rules + APIs that bear on one ask (the main entry point)',
  search: 'Ranked search over rule sections AND components/utilities',
  show: 'Full API for one component, hook or utility',
  rule: 'Print one rule section, or a whole rule',
  utils: 'List the runtime utilities available in this project',
  icons: 'List or search icon names by font (or theme name) — with a usage snippet',
  illustrations: 'List or search illustration names by type — with a usage snippet',
  media: 'List or search brand media asset names by tenant — with a usage snippet',
  products: 'List or search catalog products by category — with a usage snippet',
  list: 'List everything in the catalogue',
  explain: 'Dry-run: what would `context` retrieve, and at what score',
  doctor: 'Self-check — corpus, latency, config',
  menu: 'Interactive browser (humans; requires a TTY)',
  help: 'Show usage',
};

/** Aliases callers reach for. `ctx` is the one worth typing. */
const ALIASES = {ctx: 'context', find: 'search', doc: 'show', rules: 'rule', '--help': 'help', '-h': 'help'};

/**
 * @param {string[]} argv process.argv.slice(2)
 * @returns {{command: string|null, rest: string[], flags: object, errors: string[]}}
 */
export function parseArgs(argv) {
  const flags = {};
  const rest = [];
  const errors = [];
  let command = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--') {
      rest.push(...argv.slice(i + 1));
      break;
    }

    if (arg.startsWith('--')) {
      const [rawName, inlineValue] = arg.slice(2).split('=');
      const name = rawName.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const spec = FLAGS[name];
      if (!spec) {
        errors.push(`Unknown option: --${rawName}`);
        continue;
      }
      if (spec.value === 'boolean') {
        flags[name] = inlineValue === undefined ? true : inlineValue !== 'false';
        continue;
      }
      const value = inlineValue ?? argv[++i];
      if (value === undefined || value.startsWith('--')) {
        errors.push(`--${rawName} needs a value`);
        continue;
      }
      if (spec.value === 'number') {
        const n = Number.parseInt(value, 10);
        if (!Number.isFinite(n) || n < 1) {
          errors.push(`--${rawName} must be a positive integer`);
          continue;
        }
        flags[name] = n;
      } else {
        flags[name] = value;
      }
      continue;
    }

    if (arg.startsWith('-') && arg.length > 1 && !command) {
      const mapped = ALIASES[arg];
      if (mapped) {
        command = mapped;
        continue;
      }
      errors.push(`Unknown option: ${arg}`);
      continue;
    }

    if (command === null) {
      command = ALIASES[arg] ?? arg;
    } else {
      rest.push(arg);
    }
  }

  if (flags.only && !['rules', 'components'].includes(flags.only)) {
    errors.push('--only must be "rules" or "components"');
  }

  return {command, rest, flags, errors};
}

export function usage(invoke = 'node scripts/ld/cli.mjs') {
  const lines = [
    '',
    'Living Design context engine',
    '',
    `  ${invoke} context "<your ask>"      the one command worth running first`,
    '',
    'Commands:',
  ];
  const w = Math.max(...Object.keys(COMMANDS).map((c) => c.length));
  for (const [name, help] of Object.entries(COMMANDS)) {
    lines.push(`  ${name.padEnd(w)}  ${help}`);
  }
  lines.push('', 'Options:');
  const fw = Math.max(...Object.keys(FLAGS).map((f) => f.length));
  for (const [name, spec] of Object.entries(FLAGS)) {
    lines.push(`  --${name.padEnd(fw)}  ${spec.help}`);
  }
  lines.push(
    '',
    'Examples:',
    `  ${invoke} context "build a PDP with product cards"`,
    `  ${invoke} search bottom drawer`,
    `  ${invoke} show ProductService`,
    `  ${invoke} rule a11y#forms`,
    '',
    'The path above works from ANY working directory — the engine resolves its',
    'own project from its own location, so an absolute path is always safe:',
    `  node /abs/path/to/project/scripts/ld/cli.mjs context "<ask>"`,
    '',
  );
  return lines.join('\n');
}
