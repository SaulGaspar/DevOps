// Integración cliente HTTP + serialización + respuestas; fetch simulado.
// NO equivale a una prueba extremo a extremo con un backend desplegado.
import { authApi, productApi, ApiError } from '../src/services/api';
import { apiCases } from './fixtures/scenarios';

const originalFetch = global.fetch;
const originalApiUrl = process.env.EXPO_PUBLIC_API_URL;

beforeAll(() => { process.env.EXPO_PUBLIC_API_URL = 'https://qa.example.com'; });
afterAll(() => {
  global.fetch = originalFetch;
  if (originalApiUrl === undefined) delete process.env.EXPO_PUBLIC_API_URL;
  else process.env.EXPO_PUBLIC_API_URL = originalApiUrl;
});
beforeEach(() => { global.fetch = jest.fn(); });

function reply(status, data) {
  return { ok: status >= 200 && status < 300, status,
    headers: { get: () => 'application/json' }, json: async () => data };
}

describe('Integración contrato HTTP de autenticación', () => {
  test('envía credenciales POST y procesa sesión', async () => {
    global.fetch.mockResolvedValue(reply(200, apiCases.success));
    const result = await authApi.login({ correo: 'qa@example.com', password: 'Segura123' });
    expect(result.usuario.nombre).toBe('QA');
    expect(result.token).toBe('token-ficticio');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://qa.example.com/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ correo: 'qa@example.com', password: 'Segura123' }),
      }),
    );
  });
  test.each([[401, apiCases.unauthorized], [503, apiCases.serverError]])(
    'devuelve ApiError cuando HTTP responde %i', async (status, payload) => {
      global.fetch.mockResolvedValue(reply(status, payload));
      await expect(authApi.login({ correo: 'qa@example.com', password: 'incorrecta' }))
        .rejects.toMatchObject({ name: 'ApiError', status, message: payload.message });
    },
  );
  test('rechaza una respuesta sin token', async () => {
    global.fetch.mockResolvedValue(reply(200, { usuario: {} }));
    await expect(authApi.login({ correo: 'qa@example.com', password: 'Segura123' }))
      .rejects.toThrow('La API no devolvió un token de sesión válido.');
  });
  test('normaliza errores de red', async () => {
    global.fetch.mockRejectedValue(new Error('network'));
    await expect(authApi.login({ correo: 'qa@example.com', password: 'Segura123' }))
      .rejects.toBeInstanceOf(ApiError);
  });
});
describe('Integración contrato HTTP de catálogo', () => {
  test('construye filtros codificados en solicitud GET', async () => {
    global.fetch.mockResolvedValue(reply(200, { products: [] }));
    await productApi.list({ q: 'tenis negro', categoria: 'calzado' });
    expect(global.fetch.mock.calls[0][0]).toContain('q=tenis+negro');
    expect(global.fetch.mock.calls[0][0]).toContain('categoria=calzado');
  });
});
