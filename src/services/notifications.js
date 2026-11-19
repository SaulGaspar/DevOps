import Constants from 'expo-constants';
import { Platform } from 'react-native';

export async function configureNotifications() {
  if (Platform.OS === 'web') return { status: 'unsupported', token: null };

  const Notifications = await import('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('orders', {
      name: 'Estado de pedidos',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 150, 250],
      lightColor: '#B7F02B',
    });
  }

  const current = await Notifications.getPermissionsAsync();
  const permission = current.status === 'granted'
    ? current
    : await Notifications.requestPermissionsAsync();
  if (permission.status !== 'granted') {
    return { status: 'denied', token: null };
  }

  const projectId = Constants.easConfig?.projectId || Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    return { status: 'missing-project-id', token: null };
  }

  try {
    const result = await Notifications.getExpoPushTokenAsync({ projectId });
    return { status: 'registered', token: result.data };
  } catch {
    return { status: 'unavailable', token: null };
  }
}
