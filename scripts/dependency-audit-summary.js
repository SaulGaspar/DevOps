/* Resume npm audit sin ocultar advertencias. La compuerta falla con vulnerabilidades críticas. */
const fs = require('node:fs');
const path = require('node:path');

const input = process.argv[2];
const output = process.argv[3] || 'qa-results/dependencias.md';

if (!input || !fs.existsSync(input)) {
  console.error('RECHAZADO: no existe el resultado de npm audit.');
  process.exit(1);
}

const audit = JSON.parse(fs.readFileSync(input, 'utf8'));
const counts = audit.metadata?.vulnerabilities || {};
const critical = Number(counts.critical || 0);
const passed = critical === 0;
const rows = ['info', 'low', 'moderate', 'high', 'critical']
  .map((severity) => `| ${severity} | ${Number(counts[severity] || 0)} |`);
const report = [
  '# Auditoría de dependencias - SportLike',
  '',
  `**Veredicto: ${passed ? 'APROBADO ✅' : 'RECHAZADO ❌'}**`,
  '',
  '| Severidad | Hallazgos |',
  '|---|---:|',
  ...rows,
  '',
  critical > 0
    ? 'La entrega queda bloqueada por vulnerabilidades críticas. Corregir y repetir el pipeline.'
    : 'No hay vulnerabilidades críticas. Los hallazgos restantes se conservan como deuda técnica visible y deben revisarse antes de elevar el umbral.',
].join('\n');

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${report}\n`);
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`);
}
console.log(report);
if (!passed) process.exit(1);
