const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function normalizeEmail(value = '') {
  return typeof value === 'string' ? value.trim().toLowerCase().slice(0, 254) : '';
}

export function validateEmail(value = '') {
  const normalizedEmail = normalizeEmail(value);
  if (!normalizedEmail) return 'Ingresa tu correo electrónico.';
  if (!EMAIL_PATTERN.test(normalizedEmail)) return 'Ingresa un correo electrónico válido.';
  return '';
}

export function validateLogin({ correo = '', password = '' } = {}) {
  const errors = {};
  const normalizedEmail = normalizeEmail(correo);

  const emailError = validateEmail(normalizedEmail);
  if (emailError) errors.correo = emailError;

  if (!password) {
    errors.password = 'Ingresa tu contraseña.';
  } else if (typeof password !== 'string' || password.length > 128) {
    errors.password = 'La contraseña no tiene un formato válido.';
  }

  return errors;
}

function isValidBirthDate(value) {
  if (!DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day
    && date < new Date()
  );
}

const REGISTER_FIELD_LABELS = {
  nombre: 'nombre',
  apellidoPaterno: 'apellido paterno',
  fechaNacimiento: 'fecha de nacimiento',
  correo: 'correo electrónico',
  telefono: 'teléfono',
  usuario: 'usuario',
  password: 'contraseña',
  confirmarPassword: 'confirmación de contraseña',
  aceptaTerminos: 'aceptación de términos',
};

export function validateRegister(values = {}) {
  const errors = {};
  const text = (value) => typeof value === 'string' ? value : '';
  const correo = normalizeEmail(values.correo);
  const telefono = text(values.telefono).replace(/\D/g, '');
  const nombre = text(values.nombre);
  const apellidoPaterno = text(values.apellidoPaterno);
  const usuario = text(values.usuario);
  const password = text(values.password);
  const confirmarPassword = text(values.confirmarPassword);

  if (!nombre.trim() || nombre.length > 80) errors.nombre = 'Ingresa un nombre válido.';
  if (!apellidoPaterno.trim() || apellidoPaterno.length > 80) {
    errors.apellidoPaterno = 'Ingresa tu apellido paterno.';
  }
  if (!text(values.fechaNacimiento)) {
    errors.fechaNacimiento = 'Selecciona tu fecha de nacimiento.';
  } else if (!isValidBirthDate(text(values.fechaNacimiento))) {
    errors.fechaNacimiento = 'Selecciona una fecha de nacimiento válida.';
  }
  if (!EMAIL_PATTERN.test(correo)) {
    errors.correo = 'Ingresa un correo electrónico válido.';
  }
  if (telefono.length !== 10) {
    errors.telefono = 'El teléfono debe contener 10 dígitos.';
  }
  if (!/^[a-zA-Z0-9_-]{4,20}$/.test(usuario.trim())) {
    errors.usuario = 'Usa de 4 a 20 caracteres: letras, números, guion o guion bajo.';
  }
  if (password.length > 128 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
    errors.password = 'Usa mínimo 8 caracteres con mayúscula, minúscula, número y símbolo (@$!%*?&).';
  }
  if (confirmarPassword !== password) {
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

export function summarizeRegisterErrors(errors = {}) {
  const fields = Object.keys(errors).map((key) => REGISTER_FIELD_LABELS[key] || key);
  if (!fields.length) return '';
  return `Revisa ${fields.length === 1 ? 'el campo' : 'los campos'}: ${fields.join(', ')}.`;
}

export function buildRegistrationPayload(values = {}) {
  return {
    nombre: String(values.nombre || '').trim(),
    apellidoP: String(values.apellidoPaterno || '').trim(),
    apellidoM: String(values.apellidoMaterno || '').trim(),
    fechaNac: String(values.fechaNacimiento || ''),
    correo: normalizeEmail(values.correo),
    telefono: String(values.telefono || '').replace(/\D/g, ''),
    usuario: String(values.usuario || '').trim(),
    password: String(values.password || ''),
  };
}

export function friendlyRegistrationError(error) {
  const message = String(error?.message || 'No pudimos crear tu cuenta. Intenta nuevamente.');
  if (/faltan campos requeridos/i.test(message)) {
    return 'El servidor no recibió todos los datos. Revisa los campos marcados e intenta nuevamente.';
  }
  if (/usuario, correo o teléfono ya registrado/i.test(message)) {
    return 'El usuario, correo o teléfono ya pertenece a una cuenta. Intenta iniciar sesión o usa datos diferentes.';
  }
  if (/error registrando usuario/i.test(message)) {
    return 'No pudimos crear tu cuenta en este momento. Intenta nuevamente en unos minutos.';
  }
  return message;
}
