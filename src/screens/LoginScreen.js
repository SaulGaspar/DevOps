import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import styles, { COLORS } from './LoginScreen.styles';

// Pantalla de inicio de sesión (HU1) con el diseño de la web de SportLike.
export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Encabezado */}
        <View style={styles.hero}>
          <Text style={styles.logo}>
            SPORT<Text style={styles.logoAccent}>LIKE</Text>
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>⚡ TIENDA DEPORTIVA EN LÍNEA</Text>
          </View>

          <Text style={styles.heroTitle}>
            Impulsa tu{'\n'}
            <Text style={styles.heroAccent}>mejor versión.</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Productos deportivos de alta calidad que combinan innovación, rendimiento y estilo
            para acompañarte en cada meta.
          </Text>

          <View style={styles.features}>
            <Text style={styles.featureText}>🛡 Compra segura</Text>
            <Text style={styles.featureText}>🚚 Entrega confiable</Text>
            <Text style={styles.featureText}>↩ Devoluciones claras</Text>
          </View>
        </View>

        {/* Tarjeta del formulario */}
        <View style={styles.card}>
          <Text style={styles.eyebrow}>BIENVENIDO DE NUEVO</Text>
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>Accede a tu cuenta SportLike.</Text>

          <Text style={styles.label}>Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu usuario"
            placeholderTextColor={COLORS.placeholder}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
            textContentType="username"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={[styles.label, styles.labelSpaced]}>Contraseña</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Tu contraseña"
              placeholderTextColor={COLORS.placeholder}
              secureTextEntry={!mostrarPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)}>
              <Text style={styles.eyeText}>{mostrarPassword ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.linksRow}>
            <TouchableOpacity onPress={() => navigation?.navigate('ForgotPassword')}>
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation?.navigate('Register')}>
              <Text style={styles.link}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o continúa con</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} activeOpacity={0.85}>
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleText}>Iniciar con Google</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}