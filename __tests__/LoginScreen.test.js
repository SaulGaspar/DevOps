import { fireEvent, render, waitFor } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';
import { authApi } from '../src/services/api';

const mockIniciarSesion = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: (...args) => mockReplace(...args),
  },
}));

jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({ iniciarSesion: mockIniciarSesion }),
}));

jest.mock('../src/services/api', () => ({
  authApi: { login: jest.fn() },
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('muestra errores cuando se intenta enviar el formulario vacío', async () => {
    const { getByTestId, getByText } = await render(<LoginScreen />);

    await fireEvent.press(getByTestId('login-submit'));

    expect(getByText('Ingresa tu correo electrónico.')).toBeTruthy();
    expect(getByText('Ingresa tu contraseña.')).toBeTruthy();
    expect(authApi.login).not.toHaveBeenCalled();
  });

  test('inicia sesión y navega al perfil con datos válidos', async () => {
    authApi.login.mockResolvedValue({
      token: 'token-prueba',
      usuario: { nombre: 'Saúl' },
    });
    const { getByLabelText, getByTestId } = await render(<LoginScreen />);

    await fireEvent.changeText(getByLabelText('Correo electrónico'), 'SAUL@example.com');
    await fireEvent.changeText(getByLabelText('Contraseña'), 'Segura123');
    await fireEvent.press(getByTestId('login-submit'));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        correo: 'saul@example.com',
        password: 'Segura123',
      });
      expect(mockIniciarSesion).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith('/perfil');
    });
  });
});
