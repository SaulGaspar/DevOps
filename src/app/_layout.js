import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { NotificationProvider } from '../context/NotificationContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ animation: 'slide_from_right', gestureEnabled: true, headerTitleAlign: 'center' }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ title: 'Iniciar sesión' }} />
            <Stack.Screen name="registro" options={{ title: 'Crear cuenta' }} />
            <Stack.Screen name="registro-google" options={{ title: 'Registro con Google' }} />
            <Stack.Screen name="recuperar-contrasena" options={{ title: 'Recuperar contraseña' }} />
            <Stack.Screen name="producto/[id]" options={{ title: 'Detalle del producto' }} />
            <Stack.Screen name="producto/[id]/resenas" options={{ title: 'Reseñas' }} />
            <Stack.Screen name="checkout" options={{ title: 'Finalizar compra' }} />
            <Stack.Screen name="pago/resultado" options={{ headerBackVisible: false, title: 'Resultado del pago' }} />
            <Stack.Screen name="pedido/[id]" options={{ title: 'Detalle del pedido' }} />
            <Stack.Screen name="notificaciones" options={{ title: 'Notificaciones' }} />
            <Stack.Screen name="promociones" options={{ title: 'Promociones' }} />
            <Stack.Screen name="direcciones" options={{ title: 'Direcciones' }} />
            <Stack.Screen name="direccion" options={{ title: 'Dirección' }} />
            <Stack.Screen name="devoluciones" options={{ title: 'Cambios y devoluciones' }} />
            <Stack.Screen name="contacto" options={{ title: 'Contacto' }} />
            <Stack.Screen name="ajustes" options={{ title: 'Ajustes' }} />
          </Stack>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
