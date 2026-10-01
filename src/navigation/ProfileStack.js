import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  const { usuario } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      {usuario ? (
        <Stack.Screen
          name="PerfilInicio"
          component={ProfileScreen}
          options={{ title: 'Perfil' }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Iniciar sesión' }}
          />
          <Stack.Screen
            name="Registro"
            component={RegisterScreen}
            options={{ title: 'Crear cuenta' }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ title: 'Recuperar contraseña' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}