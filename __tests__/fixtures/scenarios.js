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

export const securityCases = {
  oversizedText: 'A'.repeat(5000),
  invalidPrices: ['no-numero', '-1', 'Infinity'],
  invalidProducts: [
    null,
    { id: 'sin-precio', precio: Number.NaN, stock_total: 1 },
    { id: 'stock-invalido', precio: 100, stock_total: Number.NaN },
    { id: 'stock-decimal', precio: 100, stock_total: 1.5 },
  ],
  malformedRegistration: {
    nombre: null,
    apellidoPaterno: {},
    fechaNacimiento: 'fecha-invalida',
    correo: ['qa@example.com'],
    telefono: undefined,
    usuario: null,
    password: 12345678,
    confirmarPassword: null,
    aceptaTerminos: false,
  },
};
