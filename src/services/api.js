import { apiClient, ApiError } from './ApiClient';

const LOGIN_PATH = process.env.EXPO_PUBLIC_LOGIN_PATH || '/auth/login';
const REGISTER_PATH = process.env.EXPO_PUBLIC_REGISTER_PATH || '/auth/register';
const FORGOT_PASSWORD_PATH =
  process.env.EXPO_PUBLIC_FORGOT_PASSWORD_PATH || '/api/forgot-password';

export { ApiError };

const request = (...args) => apiClient.request(...args);

export function resolveApiAssetUrl(value) {
  return apiClient.resolveAssetUrl(value);
}

export function resolveApiUrl(path = '') {
  return `${apiClient.getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
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

  googleRegistration(registrationToken) {
    return request('/api/google/registration', { token: registrationToken });
  },

  async completeGoogle({ usuario, registrationToken }) {
    const payload = await request('/api/google/complete', {
      method: 'POST',
      body: { usuario },
      token: registrationToken,
    });
    return normalizeSession(payload);
  },
};

export const productApi = {
  list(filters = {}) {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q.trim());
    if (filters.categoria) params.set('categoria', filters.categoria);
    if (filters.marca) params.set('marca', filters.marca);
    const query = params.toString();
    return request(`/api/products${query ? `?${query}` : ''}`);
  },

  categories() {
    return request('/api/products/categories');
  },

  detail(id) {
    return request(`/api/products/${encodeURIComponent(id)}`);
  },

  recommendations(id, limit = 4) {
    return request(
      `/api/products/${encodeURIComponent(id)}/recommendations?limit=${encodeURIComponent(limit)}`,
    );
  },
};
export const profileApi = {
  me: (token) => request('/api/me', { token }),
  update: (body, token) => request('/api/update-profile', { method: 'POST', body, token }),
  password: (actual, nueva, token) => request('/api/update-password', { method: 'POST', body: { actual, nueva }, token }),
};

export const promotionApi = {
  active: () => request('/api/promotions/active'),
};

export const addressApi = {
  list: (token) => request('/api/user/addresses', { token }),
  create: (body, token) => request('/api/user/addresses', { method: 'POST', body, token }),
  update: (id, body, token) => request(`/api/user/addresses/${encodeURIComponent(id)}`, { method: 'PUT', body, token }),
  remove: (id, token) => request(`/api/user/addresses/${encodeURIComponent(id)}`, { method: 'DELETE', token }),
  makeDefault: (id, token) => request(`/api/user/addresses/${encodeURIComponent(id)}/default`, { method: 'PATCH', token }),
};

export const orderApi = {
  mine: (token) => request('/api/orders/mis-pedidos', { token }),
  notifications: (token) => request('/api/orders/notificaciones', { token }),
};

export const paymentApi = {
  preference: (body, token) => request('/api/payments/preference', {
    method: 'POST',
    body: { ...body, platform: 'mobile' },
    token,
  }),
  complete: (body, token) => request('/api/payments/complete', { method: 'POST', body, token }),
  status: (paymentId, token) => request(`/api/payments/payment/${encodeURIComponent(paymentId)}`, { token }),
};

export const notificationApi = {
  register: (pushToken, token) => request('/api/notifications/token', {
    method: 'POST',
    body: { token: pushToken, platform: 'expo' },
    token,
  }),
  remove: (pushToken, token) => request('/api/notifications/token', {
    method: 'DELETE',
    body: { token: pushToken },
    token,
  }),
};

export const returnApi = {
  list: (token) => request('/api/returns', { token }),
  eligibleOrders: (token) => request('/api/returns/eligible-orders', { token }),
  create: (body, token) => request('/api/returns', { method: 'POST', body, token }),
};

export const reviewApi = {
  list: (productId) => request(`/api/reviews/product/${encodeURIComponent(productId)}`),
  mine: (productId, token) => request(`/api/reviews/product/${encodeURIComponent(productId)}/mine`, { token }),
  create: (productId, body, token) => request(`/api/reviews/product/${encodeURIComponent(productId)}`, { method: 'POST', body, token }),
};

export const contactApi = {
  send: (body) => request('/api/contact', { method: 'POST', body }),
};
