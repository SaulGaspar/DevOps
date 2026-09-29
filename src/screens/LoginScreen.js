import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';

// Pantalla de inicio de sesión (HU1) - solo diseño, sin lógica de autenticación.
export default function LoginScreen() {
  const [mostrarPassword, setMostrarPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Encabezado con marca */}
        <View style={styles.hero}>
          <Text style={styles.logo}>
            SPORT<Text style={styles.logoAccent}>LIKE</Text>
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>⚡ TU EXPERIENCIA SPORTLIKE</Text>
          </View>

          <Text style={styles.heroTitle}>
            Vuelve a tu <Text style={styles.heroAccent}>próxima meta.</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Inicia sesión y continúa con tus compras y pedidos.
          </Text>
        </View>

        {/* Tarjeta del formulario */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>BIENVENIDO A SPORTLIKE</Text>
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>Ingresa tus datos para continuar.</Text>

          <Text style={styles.label}>Usuario o correo</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@gmail.com"
            placeholderTextColor={COLORS.placeholder}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Tu contraseña"
              placeholderTextColor={COLORS.placeholder}
              secureTextEntry={!mostrarPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)}>
              <Text style={styles.showText}>
                {mostrarPassword ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotWrapper}>
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity>
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
  bg: '#F3F6FA',
  white: '#FFFFFF',
  text: '#0B1F3A',
  muted: '#5B6B80',
  border: '#D5DCE6',
  placeholder: '#93A0B2',
  link: '#0A4DA2',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },
  scroll: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 72,
  },
  logo: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 28,
  },
  logoAccent: {
    color: COLORS.lime,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.lime,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  badgeText: {
    color: COLORS.lime,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  heroAccent: {
    color: COLORS.lime,
  },
  heroSubtitle: {
    color: '#C5D0E0',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -32,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
  },
  eyebrow: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 4,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 2,
    marginBottom: 20,
  },
  label: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  showText: {
    color: COLORS.link,
    fontSize: 12,
    fontWeight: '700',
  },
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 22,
  },
  link: {
    color: COLORS.link,
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  button: {
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.navyDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  footerText: {
    color: COLORS.muted,
    fontSize: 12,
  },
});