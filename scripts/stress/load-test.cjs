
const fs = require('node:fs');
const path = require('node:path');
const { performance } = require('node:perf_hooks');

const URL = 'http://127.0.0.1:3100/productos';

const phases = [
  { name: 'Inicial', total: 30, concurrency: 2 },
  { name: 'Media', total: 100, concurrency: 10 },
  { name: 'Elevada', total: 300, concurrency: 30 },
  { name: 'Recuperacion', total: 30, concurrency: 2 },
];

async function requestProduct() {
  const start = performance.now();

  try {
    const response = await fetch(URL, {
      signal: AbortSignal.timeout(5000),
    });

    const products = await response.json();

    const success =
      response.status === 200 &&
      Array.isArray(products) &&
      products.length === 100;

    return {
      success,
      status: response.status,
      ms: performance.now() - start,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      ms: performance.now() - start,
      error: error.message,
    };
  }
}

function percentile(values, fraction) {
  if (!values.length) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil(sorted.length * fraction) - 1;

  return sorted[Math.max(0, index)];
}

async function runPhase(phase) {
  let next = 0;
  const results = [];
  const started = performance.now();

  async function worker() {
    while (next < phase.total) {
      next++;
      results.push(await requestProduct());
    }
  }

  await Promise.all(
    Array.from(
      { length: phase.concurrency },
      () => worker()
    )
  );

  const duration = (performance.now() - started) / 1000;
  const success = results.filter((item) => item.success);
  const errors = results.length - success.length;
  const times = results.map((item) => item.ms);

  return {
    fase: phase.name,
    solicitudes: results.length,
    concurrencia: phase.concurrency,
    exitosas: success.length,
    fallidas: errors,
    errorPct: Number((errors / results.length * 100).toFixed(2)),
    promedioMs: Number(
      (times.reduce((sum, ms) => sum + ms, 0) / times.length).toFixed(2)
    ),
    p95Ms: Number(percentile(times, 0.95).toFixed(2)),
    maxMs: Number(Math.max(...times).toFixed(2)),
    solicitudesPorSegundo: Number(
      (results.length / duration).toFixed(2)
    ),
    duracionSegundos: Number(duration.toFixed(2)),
  };
}

async function main() {
  console.log('PRUEBA DE ESFUERZO — SPORTLIKE');
  console.log('Destino: servidor local simulado');
  console.log('');

  const results = [];

  for (const phase of phases) {
    console.log(`Ejecutando fase: ${phase.name}`);
    const result = await runPhase(phase);
    results.push(result);
    console.table([result]);
  }

  const directory = path.join('evidencias', 'stress');
  fs.mkdirSync(directory, { recursive: true });

  const file = path.join(directory, 'resultados.json');

  fs.writeFileSync(
    file,
    JSON.stringify({
      fecha: new Date().toISOString(),
      entorno: 'Servidor HTTP local simulado',
      destino: URL,
      fases: results,
    }, null, 2)
  );

  console.log(`Resultados guardados en ${file}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
