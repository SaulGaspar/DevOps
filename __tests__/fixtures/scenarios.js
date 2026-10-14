// Datos sintéticos compartidos: nunca usar cuentas ni tokens reales.
export const loginCases = [
  { name: 'correo vacío', input: { correo: '', password: 'Segura123' }, field: 'correo' },
  { name: 'correo inválido', input: { correo: 'invalido', password: 'Segura123' }, field: 'correo' },
  { name: 'contraseña vacía', input: { correo: 'qa@example.com', password: '' }, field: 'password' },
];
export const products = [
  { id: 'sku-1', nombre: 'Tenis QA', precio: 499, stock_total: 2 },
  { id: 'sku-2', nombre: 'Playera QA', precio: 199, stock_total: 0 },
];
export const apiCases = {
  success: { token: 'token-ficticio', usuario: { nombre: 'QA' } },
  unauthorized: { message: 'Credenciales incorrectas' },
  serverError: { message: 'Servicio temporalmente no disponible' },
};
