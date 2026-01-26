const { execSync } = require('child_process');

function run(cmd) {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
  } catch (e) {
    return e.stdout ? e.stdout.toString() : '';
  }
}

function writeStepSummary(markdown) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    require('fs').appendFileSync(summaryPath, markdown + '\n');
  } else {
    console.log(markdown);
  }
}

function main() {
  const raw = run('npm outdated --json');
  let data = {};
  try {
    data = JSON.parse(raw || '{}');
  } catch (e) {
    data = {};
  }

  const deps = Object.entries(data);
  const total = deps.length;

  let critical = 0;
  let major = 0;
  let minor = 0;

  const rows = deps.map(([name, info]) => {
    const current = info.current || '-';
    const wanted = info.wanted || '-';
    const latest = info.latest || '-';

    let bump = 'patch/minor';
    try {
      const curMajor = String(current).split('.')[0];
      const latMajor = String(latest).split('.')[0];
      if (curMajor !== latMajor) bump = 'major';
    } catch {}

    if (bump === 'major') major++;
    else minor++;

    return `| ${name} | ${current} | ${wanted} | ${latest} | ${bump} |`;
  });

  const header = `# Weekly Dependency Outdated Report\n\n- Total outdated: **${total}**\n- Major bumps: **${major}**\n- Minor/patch: **${minor}**\n\n`;
  const table = [
    '| Dependency | Current | Wanted | Latest | Bump |',
    '|---|---|---|---|---|',
    ...rows,
  ].join('\n');

  writeStepSummary(header + table + '\n');

  // Exit with 0 to not fail CI by default; adjust policy as needed
  process.exit(0);
}

main();
