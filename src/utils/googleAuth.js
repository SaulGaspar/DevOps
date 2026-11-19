export function parseGoogleAuthCallback(url) {
  if (typeof url !== 'string' || !url) {
    throw new Error('Google no devolvió una respuesta válida.');
  }

  const parsed = new URL(url);
  const params = new URLSearchParams(parsed.hash.replace(/^#/, ''));

  if (params.get('error')) {
    throw new Error('No se pudo iniciar sesión con Google. Intenta nuevamente.');
  }

  const token = params.get('token');
  if (token) return { type: 'session', token };

  const registrationToken = params.get('registration_token');
  if (registrationToken) return { type: 'registration', registrationToken };

  throw new Error('Google no devolvió una sesión válida.');
}
