describe('integración del cliente móvil con el contrato HTTP de la API', () => {
  const originalUrl = process.env.EXPO_PUBLIC_API_URL;
  const originalFetch = global.fetch;
  let authApi;
  let productApi;

  beforeEach(() => {
    jest.resetModules();
    process.env.EXPO_PUBLIC_API_URL = 'https://staging.sportlike.test';
    global.fetch = jest.fn();
    ({ authApi, productApi } = require('../src/services/api'));
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.EXPO_PUBLIC_API_URL;
    else process.env.EXPO_PUBLIC_API_URL = originalUrl;
  });

  function respond(payload, status = 200) {
    global.fetch.mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => 'application/json' },
      json: async () => payload,
    });
  }

  test('envía credenciales y normaliza la sesión del backend', async () => {
    respond({ data: { access_token: 'token-test', user: { nombre: 'Saúl' } } });
    await expect(authApi.login({ correo: 'saul@example.com', password: 'Prueba123' }))
      .resolves.toEqual({ token: 'token-test', usuario: { nombre: 'Saúl' } });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/login'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ correo: 'saul@example.com', password: 'Prueba123' }) }));
  });

  test('codifica filtros y conserva los productos recibidos', async () => {
    respond([{ id: 8, nombre: 'Tenis' }]);
    await expect(productApi.list({ q: ' tenis ', categoria: 'Ropa deportiva' }))
      .resolves.toEqual([{ id: 8, nombre: 'Tenis' }]);
    expect(global.fetch.mock.calls[0][0]).toBe('https://staging.sportlike.test/api/products?q=tenis&categoria=Ropa+deportiva');
  });

  test('codifica el identificador del detalle', async () => {
    respond({ id: 'A/B' });
    await productApi.detail('A/B');
    expect(global.fetch.mock.calls[0][0]).toBe('https://staging.sportlike.test/api/products/A%2FB');
  });

  test('propaga errores HTTP con su estado y mensaje', async () => {
    respond({ message: 'Credenciales inválidas' }, 401);
    await expect(authApi.login({ correo: 'saul@example.com', password: 'Incorrecta' }))
      .rejects.toMatchObject({ status: 401, message: 'Credenciales inválidas' });
  });

  test('rechaza una sesión que no contiene token', async () => {
    respond({ usuario: { nombre: 'Saúl' } });
    await expect(authApi.login({ correo: 'saul@example.com', password: 'Prueba123' }))
      .rejects.toThrow('La API no devolvió un token');
  });

  test('transforma fallos de red en un mensaje para la app', async () => {
    global.fetch.mockRejectedValue(new TypeError('network failed'));
    await expect(productApi.list()).rejects.toThrow('No fue posible conectarse');
  });
});
