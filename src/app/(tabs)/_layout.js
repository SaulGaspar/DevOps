import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

const ICONOS = {
  index: 'home-outline',
  buscar: 'search-outline',
  carrito: 'cart-outline',
  perfil: 'person-outline',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#0a7f3f',
        tabBarInactiveTintColor: '#6b7280',
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONOS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Catálogo' }} />
      <Tabs.Screen name="buscar" options={{ title: 'Buscar' }} />
      <Tabs.Screen name="carrito" options={{ title: 'Carrito' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
