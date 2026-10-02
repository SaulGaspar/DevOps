import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { authApi } from '../services/api';
import { normalizeEmail, validateEmail } from '../utils/authValidation';

export default function ForgotPasswordScreen() {
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function submit() {
    const emailError = validateEmail(correo);
    setError(emailError);
    setMensaje('');
    if (emailError) return;

    setEnviando(true);
    try {
      await authApi.forgotPassword({ correo: normalizeEmail(correo) });
      setMensaje('Si el correo está registrado, recibirás instrucciones para recuperar tu cuenta.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text style={styles.logo}>
            SPORT<Text style={styles.logoAccent}>LIKE</Text>
          </Text>
          <Text style={styles.heroTitle}>
            ¿Olvidaste tu <Text style={styles.heroAccent}>contraseña?</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Te enviaremos instrucciones para crear una nueva.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Restablecer acceso</Text>
          <Text style={styles.subtitle}>Escribe el correo con el que creaste tu cuenta.</Text>

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            accessibilityLabel="Correo electrónico"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setCorreo}
            placeholder="ejemplo@gmail.com"
            placeholderTextColor="#738196"
            style={[styles.input, error && styles.inputError]}
            value={correo}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {mensaje ? (
            <Text accessibilityLiveRegion="polite" style={styles.successText}>
              {mensaje}
            </Text>
          ) : null}

          <TouchableOpacity disabled={enviando} onPress={submit} style={styles.button}>
            {enviando ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Enviar instrucciones</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity accessibilityRole="link" onPress={() => router.replace('/login')}>
            <Text style={styles.link}>Volver a iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const NAVY = '#0B1F3A';
const LIME = '#B7F02B';

const styles = StyleSheet.create({
  container: { backgroundColor: NAVY, flex: 1 },
  scroll: { flexGrow: 1 },
  hero: { backgroundColor: NAVY, paddingBottom: 72, paddingHorizontal: 24, paddingTop: 48 },
  logo: { color: 'white', fontSize: 22, fontWeight: '800', letterSpacing: 4 },
  logoAccent: { color: LIME },
  heroTitle: { color: 'white', fontSize: 32, fontWeight: '800', lineHeight: 38, marginTop: 28 },
  heroAccent: { color: LIME },
  heroSubtitle: { color: '#C5D0E0', fontSize: 14, lineHeight: 20, marginTop: 10 },
  card: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flex: 1,
    marginTop: -32,
    padding: 24,
  },
  title: { color: NAVY, fontSize: 26, fontWeight: '800' },
  subtitle: { color: '#5B6B80', fontSize: 13, marginBottom: 20, marginTop: 4 },
  label: { color: NAVY, fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: {
    borderColor: '#D5DCE6',
    borderRadius: 8,
    borderWidth: 1,
    color: NAVY,
    fontSize: 14,
    height: 48,
    paddingHorizontal: 12,
  },
  inputError: { borderColor: '#B42318' },
  errorText: { color: '#B42318', fontSize: 12, marginTop: 6 },
  successText: { color: '#067647', fontSize: 13, lineHeight: 18, marginTop: 12 },
  button: {
    alignItems: 'center',
    backgroundColor: '#07152B',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: { color: 'white', fontSize: 15, fontWeight: '800' },
  link: {
    color: '#0A4DA2',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 22,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
