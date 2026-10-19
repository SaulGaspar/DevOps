/* Genera un resumen verificable del JSON de Jest. Retorna error si fallaron casos. */
const fs = require('node:fs');
const path = require('node:path');
const input = process.argv[2];
const output = process.argv[3] || 'qa-report.md';
if (!input || !fs.existsSync(input)) {
  console.error('RECHAZADO: no existe el resultado Jest solicitado.');
  process.exit(1);
}
const result = JSON.parse(fs.readFileSync(input, 'utf8'));
const success = result.success && result.numFailedTests === 0 && result.numFailedTestSuites === 0 && result.numTotalTests > 0;
const cases = (result.testResults || []).flatMap(s =>
  (s.assertionResults || []).map(t => ({ suite: path.basename(s.name), name: t.fullName, status: t.status, message: (t.failureMessages || []).join(' ').slice(0, 500) })));
const report = [
  '# Evidencia automática de pruebas - SportLike',
  '',
  '**Veredicto: ' + (success ? 'APROBADO ✅' : 'RECHAZADO ❌') + '**',
  '',
  '| Métrica | Resultado |', '|---|---:|',
  '| Casos totales | ' + result.numTotalTests + ' |',
  '| Aprobados | ' + result.numPassedTests + ' |',
  '| Fallidos | ' + result.numFailedTests + ' |',
  '| Omitidos | ' + result.numPendingTests + ' |',
  '| Suites aprobadas | ' + result.numPassedTestSuites + ' |',
  '| Suites fallidas | ' + result.numFailedTestSuites + ' |',
  '', '## Casos ejecutados', '',
  '| Archivo | Caso | Estado |', '|---|---|---|',
  ...cases.map(c => '| ' + c.suite.replaceAll('|','/') + ' | ' + c.name.replaceAll('|','/').replaceAll('\n',' ') + ' | ' + c.status + ' |'),
  '', '## Errores detectados', '',
  ...cases.filter(c => c.status === 'failed').map(c => '- **' + c.name + '**: ' + c.message.replaceAll('\n',' ').replaceAll('|','/')),
  ...(success ? ['Sin pruebas fallidas.'] : []),
  '', '## Regla de decisión', '',
  'Si hay fallos, no se ejecuta la entrega posterior. Corregir el código, repetir el pipeline y conservar el enlace de la ejecución.',
].join('\n');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, report + '\n');
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
console.log('QA: ' + (success ? 'APROBADO' : 'RECHAZADO') + '; ' + result.numPassedTests + '/' + result.numTotalTests + ' casos aprobados.');
if (!success) process.exit(1);
