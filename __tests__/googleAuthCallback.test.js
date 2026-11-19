import { parseGoogleAuthCallback } from '../src/utils/googleAuth';

describe('Google OAuth móvil', () => {
  test('recupera una sesión existente desde el fragmento', () => {
    expect(parseGoogleAuthCallback('sportlike://login#token=jwt-demo')).toEqual({
      type: 'session',
      token: 'jwt-demo',
    });
  });

  test('detecta una cuenta nueva que debe completar su registro', () => {
    expect(parseGoogleAuthCallback('sportlike://login#registration_token=ticket-demo')).toEqual({
      type: 'registration',
      registrationToken: 'ticket-demo',
    });
  });

  test('rechaza respuestas de error o sin credenciales', () => {
    expect(() => parseGoogleAuthCallback('sportlike://login#error=google_access_failed')).toThrow(
      'No se pudo iniciar sesión con Google',
    );
    expect(() => parseGoogleAuthCallback('sportlike://login')).toThrow(
      'Google no devolvió una sesión válida',
    );
  });
});
