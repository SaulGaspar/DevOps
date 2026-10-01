const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function normalizeEmail(value = '') {
  return value.trim().toLowerCase();
}

export function validateEmail(value = '') {
  const normalizedEmail = normalizeEmail(value);
  if (!normalizedEmail) return 'Ingresa tu correo electrónico.';
  if (!EMAIL_PATTERN.test(normalizedEmail)) return 'Ingresa un correo electrónico válido.';
  return '';
}

export function validateLogin({ correo = '', password = '' }) {
  const errors = {};
  const normalizedEmail = normalizeEmail(correo);

  const emailError = validateEmail(normalizedEmail);
  if (emailError) errors.correo = emailError;

  if (!password) {
    errors.password = 'Ingresa tu contraseña.';
  }

  return errors;
}

function isValidBirthDate(value) {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && date < new Date();
}

export function validateRegister(values) {
  const errors = {};
  const correo = normalizeEmail(values.correo);
  const telefono = values.telefono.replace(/\D/g, '');

  if (!values.nombre.trim()) errors.nombre = 'Ingresa tu nombre.';
  if (!values.apellidoPaterno.trim()) {
    errors.apellidoPaterno = 'Ingresa tu apellido paterno.';
  }
  if (!isValidBirthDate(values.fechaNacimiento)) {
    errors.fechaNacimiento = 'Usa una fecha válida con formato AAAA-MM-DD.';
  }
  if (!EMAIL_PATTERN.test(correo)) {
    errors.correo = 'Ingresa un correo electrónico válido.';
  }
  if (telefono.length !== 10) {
    errors.telefono = 'El teléfono debe contener 10 dígitos.';
  }
  if (values.usuario.trim().length < 3) {
    errors.usuario = 'El usuario debe contener al menos 3 caracteres.';
  }
  if (values.password.length < 8) {
    errors.password = 'La contraseña debe contener al menos 8 caracteres.';
  } else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
    errors.password = 'La contraseña debe incluir letras y números.';
  }
  if (values.confirmarPassword !== values.password) {
    errors.confirmarPassword = 'Las contraseñas no coinciden.';
  }
  if (!values.aceptaTerminos) {
    errors.aceptaTerminos = 'Debes aceptar los términos y el aviso de privacidad.';
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
