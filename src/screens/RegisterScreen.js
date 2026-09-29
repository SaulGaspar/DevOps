import React from 'react';
import {
  View, Text, TextInput, ScrollView, KeyboardAvoidingView,
  Platform, Pressable, Switch, StyleSheet,
} from 'react-native';

const NAVY = '#071a31';
const LIME = '#c6f62d';

function Campo({ etiqueta, ...props }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput style={styles.input} placeholderTextColor="#9aa8ba" {...props} />
    </View>
  );
}

export default function RegisterScreen() {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.pantalla} keyboardShouldPersistTaps="handled">
        <View style={styles.encabezado}>
          <Text style={styles.marca}>SPORT<Text style={styles.lima}>LIKE</Text></Text>
          <Text style={styles.lema}>Todo empieza con una <Text style={styles.lima}>nueva meta.</Text></Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.titulo}>Crear cuenta</Text>
          <Text style={styles.subtitulo}>Completa tus datos para comenzar.</Text>

          <Campo etiqueta="Nombre" placeholder="Tu nombre" />
          <Campo etiqueta="Apellido paterno" placeholder="Apellido paterno" />
          <Campo etiqueta="Apellido materno" placeholder="Apellido materno" />
          <Campo etiqueta="Fecha de nacimiento" placeholder="AAAA-MM-DD" />
          <Campo etiqueta="Correo electrónico" placeholder="ejemplo@gmail.com"
            keyboardType="email-address" autoCapitalize="none" />
          <Campo etiqueta="Teléfono" placeholder="10 dígitos" keyboardType="number-pad" />
          <Campo etiqueta="Usuario" placeholder="Elige un nombre de usuario" autoCapitalize="none" />
          <Campo etiqueta="Contraseña" placeholder="••••••••" secureTextEntry autoCapitalize="none" />
          <Campo etiqueta="Confirmar contraseña" placeholder="Repite tu contraseña"
            secureTextEntry autoCapitalize="none" />

          <View style={styles.terminos}>
            <Switch value={false} />
            <Text style={styles.terminosTexto}>
              Acepto los Términos y Condiciones y el Aviso de Privacidad.
            </Text>
          </View>

          <Pressable style={styles.boton}>
            <Text style={styles.botonTexto}>Crear mi cuenta</Text>
          </Pressable>

          <Text style={styles.login}>¿Ya tienes cuenta? Inicia sesión</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#f3f6fa' },
  encabezado: { backgroundColor: NAVY, padding: 28, paddingTop: 56 },
  marca: { color: 'white', fontSize: 20, fontWeight: '900', letterSpacing: 5, marginBottom: 16 },
  lima: { color: LIME },
  lema: { color: 'white', fontSize: 28, fontWeight: '900', lineHeight: 32 },
  tarjeta: { backgroundColor: 'white', margin: 16, padding: 20, borderRadius: 16 },
  titulo: { color: NAVY, fontSize: 24, fontWeight: '800' },
  subtitulo: { color: '#718096', marginTop: 2, marginBottom: 18 },
  campo: { marginBottom: 14 },
  etiqueta: { color: '#132c4a', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  input: {
    height: 46, borderWidth: 1, borderColor: '#cfd9e6', borderRadius: 10,
    paddingHorizontal: 12, fontSize: 15, backgroundColor: 'white',
  },
  terminos: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  terminosTexto: { flex: 1, color: '#53657a', fontSize: 13 },
  boton: { backgroundColor: NAVY, borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 20 },
  botonTexto: { color: 'white', fontWeight: '800' },
  login: { textAlign: 'center', color: '#64748b', marginTop: 16, fontSize: 13 },
});