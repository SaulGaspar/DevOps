import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

export default function GoogleRegistrationScreen() {
  const params = useLocalSearchParams();
  const registrationToken = Array.isArray(params.token) ? params.token[0] : params.token;
  const { iniciarSesion } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [usuario, setUsuario] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        if (!registrationToken) throw new Error('El registro con Google no es válido.');
        const data = await authApi.googleRegistration(registrationToken);
        if (active) setPerfil(data);
      } catch (nextError) {
        if (active) setError(nextError.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [registrationToken]);

  async function complete() {
    const normalized = usuario.trim();
    if (!/^[A-Za-z0-9_-]{4,20}$/.test(normalized)) {
      setError('Elige un usuario de 4 a 20 caracteres: letras, números, guion o guion bajo.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const session = await authApi.completeGoogle({ usuario: normalized, registrationToken });
      await iniciarSesion(session);
      router.replace('/perfil');
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color="#071A31" /><Text style={styles.muted}>Preparando tu cuenta...</Text></View>;
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.logo}>SPORT<Text style={styles.lime}>LIKE</Text></Text>
        <Text style={styles.title}>Termina tu registro</Text>
        <Text style={styles.muted}>Google verificó {perfil?.correo || 'tu correo'}. Solo falta elegir tu usuario de SportLike.</Text>
        <Text style={styles.label}>Nombre de usuario</Text>
        <TextInput
          autoCapitalize="none"
          autoComplete="username-new"
          editable={!saving && Boolean(perfil)}
          onChangeText={setUsuario}
          placeholder="deportista_01"
          placeholderTextColor="#738196"
          style={styles.input}
          value={usuario}
        />
        {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
        <Pressable disabled={saving || !perfil} onPress={complete} style={[styles.button, (saving || !perfil) && styles.disabled]}>
          {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Crear cuenta y continuar</Text>}
        </Pressable>
        <Pressable onPress={() => router.replace('/login')}><Text style={styles.cancel}>Volver al inicio de sesión</Text></Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: '#F3F6FA', flex: 1, justifyContent: 'center', padding: 20 },
  center: { alignItems: 'center', flex: 1, gap: 12, justifyContent: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 22 },
  logo: { color: '#071A31', fontSize: 18, fontWeight: '900', letterSpacing: 4 },
  lime: { color: '#79A800' },
  title: { color: '#071A31', fontSize: 25, fontWeight: '800', marginTop: 24 },
  muted: { color: '#5B6B80', lineHeight: 20, marginTop: 8 },
  label: { color: '#132C4A', fontSize: 13, fontWeight: '700', marginBottom: 7, marginTop: 22 },
  input: { borderColor: '#CFD9E6', borderRadius: 10, borderWidth: 1, color: '#071A31', height: 48, paddingHorizontal: 12 },
  error: { color: '#B42318', fontSize: 12, marginTop: 10 },
  button: { alignItems: 'center', backgroundColor: '#071A31', borderRadius: 10, marginTop: 20, padding: 14 },
  disabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontWeight: '800' },
  cancel: { color: '#0A4DA2', fontSize: 13, marginTop: 16, textAlign: 'center', textDecorationLine: 'underline' },
});
