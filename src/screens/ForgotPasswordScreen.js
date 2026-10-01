import React from 'react';
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

// Recuperación de contraseña (#5) - solo diseño, sin llamadas a la API.
export default function ForgotPasswordScreen() {
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
            <Text style={styles.badgeText}>🔒 RECUPERAR ACCESO</Text>
          </View>

          <Text style={styles.heroTitle}>
            ¿Olvidaste tu <Text style={styles.heroAccent}>contraseña?</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            No te preocupes, te enviaremos un enlace para crear una nueva.
          </Text>
        </View>

        {/* Tarjeta del formulario */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>RECUPERAR CONTRASEÑA</Text>
          <Text style={styles.title}>Restablecer acceso</Text>
          <Text style={styles.subtitle}>
            Escribe el correo con el que creaste tu cuenta.
          </Text>

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@gmail.com"
            placeholderTextColor={COLORS.placeholder}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TouchableOpacity style={styles.button} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Enviar enlace</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿Ya la recordaste? </Text>
            <TouchableOpacity>
              <Text style={styles.link}>Iniciar sesión</Text>
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
    marginBottom: 20,
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
  link: {
    color: COLORS.link,
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  footerText: {
    color: COLORS.muted,
    fontSize: 12,
  },
});