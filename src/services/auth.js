import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function loginRequest(usuario, password) {
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: usuario.trim(), password }),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    // el limitador puede responder algo que no es JSON
  }

  if (res.status === 429) {
    throw new Error('Demasiados intentos. Espera unos minutos e inténtalo de nuevo.');
  }
  if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');

  await SecureStore.setItemAsync('token', data.token);
  return data.user;
}