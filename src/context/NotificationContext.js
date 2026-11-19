import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';
import { notificationApi } from '../services/api';
import { configureNotifications } from '../services/notifications';
import { notificationOrderId } from '../utils/notifications';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { token } = useAuth();
  const [registration, setRegistration] = useState({ status: 'idle', token: null });

  useEffect(() => {
    let active = true;
    let subscription;
    if (!token) {
      const timer = setTimeout(() => setRegistration({ status: 'idle', token: null }), 0);
      return () => clearTimeout(timer);
    }

    if (Platform.OS === 'web') {
      const timer = setTimeout(() => setRegistration({ status: 'unsupported', token: null }), 0);
      return () => clearTimeout(timer);
    }

    configureNotifications().then(async (result) => {
      if (!active) return;
      setRegistration(result);
      if (result.token) {
        await notificationApi.register(result.token, token).catch(() => {});
      }
      const Notifications = await import('expo-notifications');
      if (!active) return;
      subscription = Notifications.addNotificationResponseReceivedListener((response) => {
        const orderId = notificationOrderId(response);
        if (orderId) router.push(`/pedido/${orderId}`);
      });
      const response = await Notifications.getLastNotificationResponseAsync();
      const orderId = notificationOrderId(response);
      if (orderId) router.push(`/pedido/${orderId}`);
    });

    return () => {
      active = false;
      subscription?.remove();
    };
  }, [token]);

  const value = useMemo(() => ({ registration }), [registration]);
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  return useContext(NotificationContext);
}
