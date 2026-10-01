import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { usuario, cerrarSesion } = useAuth();

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Ionicons name="person-circle-outline" size={96} color="#9ca3af" />
        <Text style={styles.title}>Inicia sesión o regístrate</Text>
        <Text style={styles.subtitle}>
          Accede a tus pedidos, direcciones guardadas y favoritos.
        </Text>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.btnPrimaryText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.navigate('Registro')}
        >
          <Text style={styles.btnSecondaryText}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name="person-circle" size={96} color="#0a7f3f" />
      <Text style={styles.title}>Hola, {usuario.nombre}</Text>
      <TouchableOpacity style={styles.btnSecondary} onPress={cerrarSesion}>
        <Text style={styles.btnSecondaryText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 12 },
  subtitle: { textAlign: 'center', color: '#6b7280', marginTop: 8, marginBottom: 24 },
  btnPrimary: {
    backgroundColor: '#0a7f3f',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnSecondary: {
    borderWidth: 1,
    borderColor: '#0a7f3f',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  btnSecondaryText: { color: '#0a7f3f', fontSize: 16, fontWeight: 'bold' },
});