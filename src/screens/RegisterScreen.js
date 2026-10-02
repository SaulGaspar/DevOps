import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { hasErrors, normalizeEmail, validateRegister } from '../utils/authValidation';

const INITIAL_VALUES = {
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  fechaNacimiento: '',
  correo: '',
  telefono: '',
  usuario: '',
  password: '',
  confirmarPassword: '',
  aceptaTerminos: false,
};

function Campo({ error, etiqueta, name, onChange, value, ...props }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        accessibilityLabel={etiqueta}
        onChangeText={(text) => onChange(name, text)}
        placeholderTextColor="#738196"
        style={[styles.input, error && styles.inputError]}
        value={value}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default function RegisterScreen() {
  const { iniciarSesion } = useAuth();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  function update(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function submit() {
    const validationErrors = validateRegister(values);
    setErrors(validationErrors);
    setErrorGeneral('');
    if (hasErrors(validationErrors)) return;

    setEnviando(true);
    try {
      const result = await authApi.register({
        nombre: values.nombre.trim(),
        apellidoPaterno: values.apellidoPaterno.trim(),
        apellidoMaterno: values.apellidoMaterno.trim(),
        fechaNacimiento: values.fechaNacimiento,
        correo: normalizeEmail(values.correo),
        telefono: values.telefono.replace(/\D/g, ''),
        usuario: values.usuario.trim(),
        password: values.password,
      });

      if (result.token) {
        await iniciarSesion(result);
        router.replace('/perfil');
      } else {
        router.replace({ pathname: '/login', params: { registro: 'exitoso' } });
      }
    } catch (error) {
      setErrorGeneral(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        style={styles.pantalla}
      >
        <View style={styles.encabezado}>
          <Text style={styles.marca}>
            SPORT<Text style={styles.lima}>LIKE</Text>
          </Text>
          <Text style={styles.lema}>
            Todo empieza con una <Text style={styles.lima}>nueva meta.</Text>
          </Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.titulo}>Crear cuenta</Text>
          <Text style={styles.subtitulo}>Completa tus datos para comenzar.</Text>

          <Campo
            etiqueta="Nombre"
            error={errors.nombre}
            name="nombre"
            onChange={update}
            placeholder="Tu nombre"
            value={values.nombre}
          />
          <Campo
            etiqueta="Apellido paterno"
            error={errors.apellidoPaterno}
            name="apellidoPaterno"
            onChange={update}
            placeholder="Apellido paterno"
            value={values.apellidoPaterno}
          />
          <Campo
            etiqueta="Apellido materno"
            name="apellidoMaterno"
            onChange={update}
            placeholder="Apellido materno"
            value={values.apellidoMaterno}
          />
          <Campo
            etiqueta="Fecha de nacimiento"
            error={errors.fechaNacimiento}
            name="fechaNacimiento"
            onChange={update}
            placeholder="AAAA-MM-DD"
            value={values.fechaNacimiento}
          />
          <Campo
            autoCapitalize="none"
            autoComplete="email"
            etiqueta="Correo electrónico"
            error={errors.correo}
            keyboardType="email-address"
            name="correo"
            onChange={update}
            placeholder="ejemplo@gmail.com"
            textContentType="emailAddress"
            value={values.correo}
          />
          <Campo
            etiqueta="Teléfono"
            error={errors.telefono}
            keyboardType="number-pad"
            maxLength={10}
            name="telefono"
            onChange={update}
            placeholder="10 dígitos"
            textContentType="telephoneNumber"
            value={values.telefono}
          />
          <Campo
            autoCapitalize="none"
            autoComplete="username-new"
            etiqueta="Usuario"
            error={errors.usuario}
            name="usuario"
            onChange={update}
            placeholder="Elige un nombre de usuario"
            value={values.usuario}
          />
          <Campo
            autoCapitalize="none"
            autoComplete="new-password"
            etiqueta="Contraseña"
            error={errors.password}
            name="password"
            onChange={update}
            placeholder="Mínimo 8 caracteres"
            secureTextEntry
            textContentType="newPassword"
            value={values.password}
          />
          <Campo
            autoCapitalize="none"
            autoComplete="new-password"
            etiqueta="Confirmar contraseña"
            error={errors.confirmarPassword}
            name="confirmarPassword"
            onChange={update}
            placeholder="Repite tu contraseña"
            secureTextEntry
            textContentType="newPassword"
            value={values.confirmarPassword}
          />

          <View style={styles.terminos}>
            <Switch
              accessibilityLabel="Aceptar términos y aviso de privacidad"
              onValueChange={(value) => update('aceptaTerminos', value)}
              value={values.aceptaTerminos}
            />
            <Text style={styles.terminosTexto}>
              Acepto los Términos y Condiciones y el Aviso de Privacidad.
            </Text>
          </View>
          {errors.aceptaTerminos ? (
            <Text style={styles.errorText}>{errors.aceptaTerminos}</Text>
          ) : null}

          {errorGeneral ? (
            <Text accessibilityLiveRegion="polite" style={styles.generalError}>
              {errorGeneral}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            disabled={enviando}
            onPress={submit}
            style={[styles.boton, enviando && styles.botonDeshabilitado]}
            testID="register-submit"
          >
            {enviando ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.botonTexto}>Crear mi cuenta</Text>
            )}
          </Pressable>

          <Pressable accessibilityRole="link" onPress={() => router.replace('/login')}>
            <Text style={styles.login}>¿Ya tienes cuenta? Inicia sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const NAVY = '#071a31';
const LIME = '#c6f62d';
const ERROR = '#B42318';

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pantalla: { backgroundColor: '#f3f6fa', flex: 1 },
  scrollContent: { paddingBottom: 24 },
  encabezado: { backgroundColor: NAVY, padding: 28, paddingTop: 48 },
  marca: { color: 'white', fontSize: 20, fontWeight: '900', letterSpacing: 5, marginBottom: 16 },
  lima: { color: LIME },
  lema: { color: 'white', fontSize: 28, fontWeight: '900', lineHeight: 32 },
  tarjeta: { backgroundColor: 'white', borderRadius: 16, margin: 16, padding: 20 },
  titulo: { color: NAVY, fontSize: 24, fontWeight: '800' },
  subtitulo: { color: '#5B6B80', marginBottom: 18, marginTop: 2 },
  campo: { marginBottom: 12 },
  etiqueta: { color: '#132c4a', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  input: {
    backgroundColor: 'white',
    borderColor: '#cfd9e6',
    borderRadius: 10,
    borderWidth: 1,
    color: NAVY,
    fontSize: 15,
    height: 48,
    paddingHorizontal: 12,
  },
  inputError: { borderColor: ERROR },
  errorText: { color: ERROR, fontSize: 12, marginTop: 5 },
  generalError: { color: ERROR, fontSize: 13, marginTop: 14, textAlign: 'center' },
  terminos: { alignItems: 'center', flexDirection: 'row', gap: 10, marginTop: 4 },
  terminosTexto: { color: '#53657a', flex: 1, fontSize: 13 },
  boton: { alignItems: 'center', backgroundColor: NAVY, borderRadius: 10, marginTop: 20, padding: 14 },
  botonDeshabilitado: { opacity: 0.65 },
  botonTexto: { color: 'white', fontWeight: '800' },
  login: { color: '#0A4DA2', fontSize: 13, marginTop: 16, textAlign: 'center', textDecorationLine: 'underline' },
});
