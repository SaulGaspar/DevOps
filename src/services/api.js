const DEFAULT_TIMEOUT_MS = 15000;

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');
const LOGIN_PATH = process.env.EXPO_PUBLIC_LOGIN_PATH || '/auth/login';
const REGISTER_PATH = process.env.EXPO_PUBLIC_REGISTER_PATH || '/auth/register';
const FORGOT_PASSWORD_PATH =
  process.env.EXPO_PUBLIC_FORGOT_PASSWORD_PATH || '/auth/forgot-password';

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function requireApiUrl() {
  if (!API_URL || API_URL.includes('api.ejemplo.com')) {
    throw new ApiError(
      'La API todavía no está configurada. Define EXPO_PUBLIC_API_URL en tu archivo .env.',
    );
  }
  return API_URL;
}

async function request(path, { method = 'GET', body, token } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(`${requireApiUrl()}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
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
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('No fue posible conectarse con el servidor.');
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeSession(payload) {
  const source = payload?.data || payload;
  const token = source?.token || source?.accessToken || source?.access_token;
  const usuario = source?.usuario || source?.user || source?.cliente;

  if (!token) {
    throw new ApiError('La API no devolvió un token de sesión válido.');
  }

  return {
    token,
    usuario: usuario || {},
  };
}

export const authApi = {
  async login({ correo, password }) {
    const payload = await request(LOGIN_PATH, {
      method: 'POST',
      body: { correo, password },
    });
    return normalizeSession(payload);
  },

  async register(datos) {
    const payload = await request(REGISTER_PATH, {
      method: 'POST',
      body: datos,
    });

    const source = payload?.data || payload;
    const token = source?.token || source?.accessToken || source?.access_token;
    if (!token) {
      return { usuario: source?.usuario || source?.user || null, token: null };
    }
    return normalizeSession(payload);
  },

  forgotPassword({ correo }) {
    return request(FORGOT_PASSWORD_PATH, {
      method: 'POST',
      body: { correo },
    });
  },
};
