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
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { hasErrors, normalizeEmail, validateLogin } from '../utils/authValidation';

export default function LoginScreen() {
  const { iniciarSesion } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function submit() {
    const validationErrors = validateLogin({ correo, password });
    setErrors(validationErrors);
    setErrorGeneral('');
    if (hasErrors(validationErrors)) return;

    setEnviando(true);
    try {
      const session = await authApi.login({
        correo: normalizeEmail(correo),
        password,
      });
      await iniciarSesion(session);
      router.replace('/perfil');
    } catch (error) {
      setErrorGeneral(error.message);
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
            Vuelve a tu <Text style={styles.heroAccent}>próxima meta.</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Inicia sesión y continúa con tus compras y pedidos.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.eyebrow}>BIENVENIDO A SPORTLIKE</Text>
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>Ingresa tus datos para continuar.</Text>

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            accessibilityLabel="Correo electrónico"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setCorreo}
            placeholder="ejemplo@gmail.com"
            placeholderTextColor={COLORS.placeholder}
            style={[styles.input, errors.correo && styles.inputError]}
            textContentType="emailAddress"
            value={correo}
          />
          {errors.correo ? <Text style={styles.errorText}>{errors.correo}</Text> : null}

          <Text style={styles.label}>Contraseña</Text>
          <View style={[styles.passwordRow, errors.password && styles.inputError]}>
            <TextInput
              accessibilityLabel="Contraseña"
              autoCapitalize="none"
              autoComplete="current-password"
              onChangeText={setPassword}
              onSubmitEditing={submit}
              placeholder="Tu contraseña"
              placeholderTextColor={COLORS.placeholder}
              secureTextEntry={!mostrarPassword}
              style={styles.passwordInput}
              textContentType="password"
              value={password}
            />
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => setMostrarPassword((value) => !value)}
            >
              <Text style={styles.showText}>{mostrarPassword ? 'Ocultar' : 'Mostrar'}</Text>
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <TouchableOpacity
            accessibilityRole="link"
            onPress={() => router.push('/recuperar-contrasena')}
            style={styles.forgotWrapper}
          >
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {errorGeneral ? (
            <Text accessibilityLiveRegion="polite" style={styles.generalError}>
              {errorGeneral}
            </Text>
          ) : null}

          <TouchableOpacity
            accessibilityRole="button"
            disabled={enviando}
            onPress={submit}
            style={[styles.button, enviando && styles.buttonDisabled]}
            testID="login-submit"
          >
            {enviando ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity accessibilityRole="link" onPress={() => router.push('/registro')}>
              <Text style={styles.link}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const COLORS = {
  navy: '#0B1F3A',
  navyDark: '#07152B',
  lime: '#B7F02B',
  white: '#FFFFFF',
  text: '#0B1F3A',
  muted: '#5B6B80',
  border: '#D5DCE6',
  placeholder: '#738196',
  link: '#0A4DA2',
  error: '#B42318',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navy },
  scroll: { flexGrow: 1 },
  hero: {
    backgroundColor: COLORS.navy,
    paddingBottom: 72,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  logo: { color: COLORS.white, fontSize: 22, fontWeight: '800', letterSpacing: 4 },
  logoAccent: { color: COLORS.lime },
  heroTitle: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    marginTop: 28,
  },
  heroAccent: { color: COLORS.lime },
  heroSubtitle: { color: '#C5D0E0', fontSize: 14, lineHeight: 20, marginTop: 10 },
  card: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flex: 1,
    marginTop: -32,
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  eyebrow: { color: COLORS.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: COLORS.text, fontSize: 26, fontWeight: '800', marginTop: 4 },
  subtitle: { color: COLORS.muted, fontSize: 13, marginBottom: 20, marginTop: 2 },
  label: { color: COLORS.text, fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    color: COLORS.text,
    fontSize: 14,
    height: 48,
    marginBottom: 6,
    paddingHorizontal: 12,
  },
  passwordRow: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 12,
  },
  passwordInput: { color: COLORS.text, flex: 1, fontSize: 14 },
  inputError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, fontSize: 12, marginBottom: 12 },
  generalError: { color: COLORS.error, fontSize: 13, marginBottom: 12, textAlign: 'center' },
  showText: { color: COLORS.link, fontSize: 12, fontWeight: '700' },
  forgotWrapper: { alignSelf: 'flex-end', marginBottom: 22, marginTop: 12 },
  link: {
    color: COLORS.link,
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.navyDark,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.65 },
  buttonText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  footerText: { color: COLORS.muted, fontSize: 12 },
});
