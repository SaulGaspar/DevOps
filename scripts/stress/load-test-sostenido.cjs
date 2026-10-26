
const fs = require('node:fs');
const path = require('node:path');
const { performance } = require('node:perf_hooks');

const URL = 'http://127.0.0.1:3100/productos';

const phases = [
  { name: 'Inicial', durationMs: 10000, concurrency: 2 },
  { name: 'Media', durationMs: 15000, concurrency: 10 },
  { name: 'Elevada', durationMs: 20000, concurrency: 30 },
  { name: 'Recuperacion', durationMs: 10000, concurrency: 2 },
];

const TARGET_INTERVAL_MS = 100;

async function requestProduct() {
  const start = performance.now();

  try {
    const response = await fetch(URL, {
      signal: AbortSignal.timeout(5000),
    });

    const products = await response.json();

    return {
      success:
        response.status === 200 &&
        Array.isArray(products) &&
        products.length === 100,
      ms: performance.now() - start,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      ms: performance.now() - start,
      status: 0,
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
  const results = [];
  const started = performance.now();
  const deadline = started + phase.durationMs;

  async function worker() {
    while (performance.now() < deadline) {
      results.push(await requestProduct());

      const remaining = deadline - performance.now();

      if (remaining > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.min(TARGET_INTERVAL_MS, remaining))
        );
      }
    }
  }

  await Promise.all(
    Array.from({ length: phase.concurrency }, () => worker())
  );

  const elapsed = (performance.now() - started) / 1000;
  const successful = results.filter((result) => result.success).length;
  const failed = results.length - successful;
  const times = results.map((result) => result.ms);

  return {
    fase: phase.name,
    duracionProgramadaSegundos: phase.durationMs / 1000,
    duracionRealSegundos: Number(elapsed.toFixed(2)),
    concurrencia: phase.concurrency,
    solicitudes: results.length,
    exitosas: successful,
    fallidas: failed,
    errorPct: Number((failed / results.length * 100).toFixed(2)),
    promedioMs: Number(
      (times.reduce((sum, value) => sum + value, 0) / times.length).toFixed(2)
    ),
    p95Ms: Number(percentile(times, 0.95).toFixed(2)),
    maxMs: Number(Math.max(...times).toFixed(2)),
    solicitudesPorSegundo: Number((results.length / elapsed).toFixed(2)),
  };
}

async function main() {
  console.log('SPORTLIKE - PRUEBA DE ESFUERZO SOSTENIDA');
  console.log('Entorno: servidor HTTP local simulado');
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

  const output = path.join(directory, 'resultados-sostenidos.json');

  fs.writeFileSync(
    output,
    JSON.stringify({
      fecha: new Date().toISOString(),
      entorno: 'Servidor HTTP local simulado',
      destino: URL,
      intervaloEntreSolicitudesMs: TARGET_INTERVAL_MS,
      fases: results,
    }, null, 2)
  );

  console.log(`Evidencia guardada en ${output}`);

  if (results.some((result) => result.fallidas > 0)) {
    console.error('La prueba detectó solicitudes fallidas.');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
