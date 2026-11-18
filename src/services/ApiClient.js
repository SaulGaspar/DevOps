const DEFAULT_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Cliente HTTP compartido por toda la aplicación.
 *
 * ApiClient es un Singleton: aunque otro módulo intente construirlo de nuevo,
 * obtiene la misma instancia. No almacena datos del usuario; únicamente
 * centraliza URL, timeout, cabeceras y manejo de errores de red.
 */
export class ApiClient {
  static instance;

  constructor({ timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    if (ApiClient.instance) return ApiClient.instance;
    this.timeoutMs = timeoutMs;
    ApiClient.instance = this;
  }

  getBaseUrl() {
    const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');
    let parsedUrl;

    try {
      parsedUrl = new URL(configuredUrl);
    } catch {
      throw new ApiError(
        'La API todavía no está configurada. Define una URL válida en EXPO_PUBLIC_API_URL.',
      );
    }

    if (
      !['http:', 'https:'].includes(parsedUrl.protocol)
      || parsedUrl.hostname === 'api.ejemplo.com'
    ) {
      throw new ApiError(
        'La API todavía no está configurada. Define EXPO_PUBLIC_API_URL en tu archivo .env.',
      );
    }

    return configuredUrl;
  }

  async request(path, { method = 'GET', body, token } = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.getBaseUrl()}${path}`, {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const contentType = response.headers?.get?.('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await response.json()
        : null;

      if (!response.ok) {
        throw new ApiError(
          payload?.message || payload?.error || 'No se pudo completar la solicitud.',
          response.status,
          payload,
        );
      }

      return payload || {};
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw new ApiError('La solicitud tardó demasiado. Intenta nuevamente.');
      }
      if (error instanceof ApiError) throw error;
      throw new ApiError('No fue posible conectarse con el servidor.');
    } finally {
      clearTimeout(timeout);
    }
  }

  resolveAssetUrl(value) {
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) return value;
    return `${this.getBaseUrl()}${value.startsWith('/') ? value : `/${value}`}`;
  }
}

export const apiClient = new ApiClient();

export default apiClient;
