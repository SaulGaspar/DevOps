import {
  buildRegistrationPayload,
  friendlyRegistrationError,
  hasErrors,
  normalizeEmail,
  summarizeRegisterErrors,
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
      password: 'Segura123!',
      confirmarPassword: 'Segura123!',
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

  test('transforma los nombres del formulario al contrato real del backend', () => {
    expect(buildRegistrationPayload({
      nombre: ' Saúl ',
      apellidoPaterno: ' Gaspar ',
      apellidoMaterno: ' Pérez ',
      fechaNacimiento: '2000-10-10',
      correo: ' SAUL@EXAMPLE.COM ',
      telefono: '771 123 4567',
      usuario: ' saul_g ',
      password: 'Segura123!',
    })).toEqual({
      nombre: 'Saúl',
      apellidoP: 'Gaspar',
      apellidoM: 'Pérez',
      fechaNac: '2000-10-10',
      correo: 'saul@example.com',
      telefono: '7711234567',
      usuario: 'saul_g',
      password: 'Segura123!',
    });
  });

  test('explica qué campos deben corregirse', () => {
    expect(summarizeRegisterErrors({ correo: 'inválido', telefono: 'inválido' }))
      .toBe('Revisa los campos: correo electrónico, teléfono.');
    expect(friendlyRegistrationError(new Error('Faltan campos requeridos')))
      .toContain('no recibió todos los datos');
  });

  test('rechaza fechas inexistentes y reglas que el backend no acepta', () => {
    const base = {
      nombre: 'Saúl',
      apellidoPaterno: 'Gaspar',
      fechaNacimiento: '2000-02-31',
      correo: 'saul@example.com',
      telefono: '7711234567',
      usuario: 'abc',
      password: 'Segura123',
      confirmarPassword: 'Segura123',
      aceptaTerminos: true,
    };

    expect(validateRegister(base)).toEqual(expect.objectContaining({
      fechaNacimiento: expect.any(String),
      usuario: expect.any(String),
      password: expect.any(String),
    }));
  });
});
