import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = (__ENV.API_BASE_URL || '').replace(/\/$/, '');

export const options = {
  scenarios: {
    rendimiento: {
      executor: 'constant-vus',
      vus: 2,
      duration: '20s',
    },
    esfuerzo_controlado: {
      executor: 'ramping-vus',
      startTime: '20s',
      startVUs: 2,
      stages: [
        { duration: '15s', target: 5 },
        { duration: '15s', target: 10 },
        { duration: '10s', target: 0 },
      ],
    },
  },
  thresholds: {
    checks: ['rate>0.99'],
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  if (!baseUrl) throw new Error('API_BASE_URL es obligatoria.');
  const response = http.get(`${baseUrl}/api/products`, {
    tags: { endpoint: 'catalogo' },
  });
  check(response, {
    'catálogo responde correctamente': (result) => result.status >= 200 && result.status < 300,
  });
  sleep(1);
}
