import {
  hasErrors,
  normalizeEmail,
  validateEmail,
  validateLogin,
  validateRegister,
} from '../src/utils/authValidation';

describe('validaciones de autenticación', () => {
  test('normaliza el correo antes de enviarlo', () => {
    expect(normalizeEmail('  Saul@Example.COM ')).toBe('saul@example.com');
  });

  test('rechaza un login vacío o con correo inválido', () => {
    expect(validateLogin({ correo: '', password: '' })).toEqual({
      correo: 'Ingresa tu correo electrónico.',
      password: 'Ingresa tu contraseña.',
    });
    expect(validateEmail('correo-invalido')).toBe('Ingresa un correo electrónico válido.');
  });

  test('acepta credenciales con formato válido', () => {
    expect(validateLogin({ correo: 'saul@example.com', password: 'Segura123' })).toEqual({});
  });

  test('valida los datos críticos del registro', () => {
    const errors = validateRegister({
      nombre: 'Saúl',
      apellidoPaterno: 'Gaspar',
      apellidoMaterno: '',
      fechaNacimiento: '2000-10-10',
      correo: 'saul@example.com',
      telefono: '7711234567',
      usuario: 'saul',
      password: 'Segura123',
      confirmarPassword: 'Segura123',
      aceptaTerminos: true,
    });

    expect(hasErrors(errors)).toBe(false);
  });

  test('rechaza contraseñas débiles y confirmaciones diferentes', () => {
    const errors = validateRegister({
      nombre: 'Saúl',
      apellidoPaterno: 'Gaspar',
      apellidoMaterno: '',
      fechaNacimiento: '2000-10-10',
      correo: 'saul@example.com',
      telefono: '7711234567',
      usuario: 'saul',
      password: 'abc',
      confirmarPassword: 'otra',
      aceptaTerminos: false,
    });

    expect(errors.password).toBeDefined();
    expect(errors.confirmarPassword).toBeDefined();
    expect(errors.aceptaTerminos).toBeDefined();
  });
});
