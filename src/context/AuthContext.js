import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext(null);
const TOKEN_KEY = 'sportlike.auth.token';
const USER_KEY = 'sportlike.auth.user';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);
        if (!active || !storedToken) return;
        setToken(storedToken);
        setUsuario(storedUser ? JSON.parse(storedUser) : {});
      } catch {
        await Promise.all([
          SecureStore.deleteItemAsync(TOKEN_KEY),
          SecureStore.deleteItemAsync(USER_KEY),
        ]);
      } finally {
        if (active) setCargandoSesion(false);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const iniciarSesion = useCallback(async ({ usuario: nextUser, token: nextToken }) => {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, nextToken),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(nextUser || {})),
    ]);
    setUsuario(nextUser || {});
    setToken(nextToken);
  }, []);

  const cerrarSesion = useCallback(async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
    setUsuario(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ usuario, token, cargandoSesion, iniciarSesion, cerrarSesion }),
    [usuario, token, cargandoSesion, iniciarSesion, cerrarSesion],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
