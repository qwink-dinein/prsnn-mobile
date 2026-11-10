import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { router } from 'expo-router';
import { svc } from '@/services';
import { DEMO } from './config';

/**
 * Push notifications (admin broadcasts). Needs a real build with an EAS
 * project id — Expo Go (SDK 53+) and the web build can't receive remote
 * pushes, so this quietly does nothing there.
 *
 * Asks for permission once, gets the Expo push token and saves it on the
 * account (PUT /profile/push-token). Never throws.
 */
export async function registerForPush(): Promise<string | null> {
  try {
    if (DEMO || Platform.OS === 'web' || !Device.isDevice) return null;
    if (Constants.executionEnvironment === 'storeClient') return null; // Expo Go
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (!projectId) return null;

    const Notifications = await import('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async (n) => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: n.request.content.data?.type === 'panic', shouldSetBadge: false }),
    });
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', { name: 'prsnn', importance: Notifications.AndroidImportance.DEFAULT });
      // Panic alerts to staff: loud, heads-up, vibrating.
      await Notifications.setNotificationChannelAsync('panic', { name: 'Safety alerts', importance: Notifications.AndroidImportance.MAX, vibrationPattern: [0, 400, 200, 400], sound: 'default', lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC, bypassDnd: true });
    }
    // Tapping a push opens the right screen.
    Notifications.addNotificationResponseReceivedListener((r) => openFromPush(r.notification.request.content.data as { type?: string }));
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') status = (await Notifications.requestPermissionsAsync()).status;
    if (status !== 'granted') return null;

    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    await svc.savePushToken(token);
    return token;
  } catch {
    return null;
  }
}

function openFromPush(data: { type?: string } | undefined) {
  const t = data?.type;
  if (t === 'panic') router.push('/admin/panics');
  else if (t === 'booking_offer') router.push('/bookings');
  else if (t) router.push('/notifications');
}

/** On sign-out: stop pushes to this device for the old account. */
export async function unregisterPush(): Promise<void> {
  try {
    if (DEMO || Platform.OS === 'web') return;
    await svc.savePushToken(null);
  } catch {
    // signed out anyway
  }
}
