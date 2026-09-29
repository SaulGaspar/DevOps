import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CartScreen from '../screens/CartScreen';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const ICONOS = {
  Inicio: 'home-outline',
  Buscar: 'search-outline',
  Carrito: 'cart-outline',
  Perfil: 'person-outline',
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#0a7f3f',
        tabBarInactiveTintColor: '#6b7280',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONOS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Carrito" component={CartScreen} />
      <Tab.Screen
        name="Perfil"
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}