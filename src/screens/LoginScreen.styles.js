import { StyleSheet } from 'react-native';

export const COLORS = {
  navy: '#0B1F3A',
  navyDark: '#07152B',
  lime: '#B7F02B',
  white: '#FFFFFF',
  text: '#0B1F3A',
  muted: '#5B6B80',
  border: '#D5DCE6',
  placeholder: '#93A0B2',
  link: '#0A4DA2',
  error: '#C62828',
  errorBg: '#FDECEA',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navy },
  scroll: { flexGrow: 1 },

  // Encabezado azul (igual que el lado izquierdo de la web)
  hero: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 64,
  },
  logo: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 24,
  },
  logoAccent: { color: COLORS.lime },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.lime,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  badgeText: { color: COLORS.lime, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  heroTitle: { color: COLORS.white, fontSize: 34, fontWeight: '800', lineHeight: 40 },
  heroAccent: { color: COLORS.lime },
  heroSubtitle: { color: '#C5D0E0', fontSize: 14, lineHeight: 20, marginTop: 10 },
  features: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 },
  featureText: { color: COLORS.white, fontSize: 12, fontWeight: '600', marginRight: 16, marginBottom: 6 },

  // Tarjeta blanca del formulario
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
  eyebrow: { color: COLORS.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: COLORS.text, fontSize: 28, fontWeight: '800', marginTop: 4 },
  subtitle: { color: COLORS.muted, fontSize: 13, marginTop: 2, marginBottom: 20 },

  errorBanner: { backgroundColor: COLORS.errorBg, borderRadius: 8, padding: 12, marginBottom: 16 },
  errorBannerText: { color: COLORS.error, fontSize: 13, fontWeight: '600' },

  label: { color: COLORS.text, fontSize: 12, fontWeight: '700', marginBottom: 6 },
  labelSpaced: { marginTop: 16 },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  inputError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 4 },
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
  passwordInput: { flex: 1, fontSize: 14, color: COLORS.text },
  eyeText: { fontSize: 18 },

  button: {
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.navyDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },

  linksRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  link: { color: COLORS.link, fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.muted, fontSize: 11, marginHorizontal: 10 },

  googleButton: {
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.navyDark,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: { color: COLORS.text, fontSize: 16, fontWeight: '800', marginRight: 8 },
  googleText: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
});

export default styles;