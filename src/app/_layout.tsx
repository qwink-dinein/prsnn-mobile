import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MAX_APP_WIDTH, useAppWidth } from '@/lib/layout';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { fontAssets } from '@/theme/fonts';
import { colors } from '@/theme/tokens';
import { useSession } from '@/state/session';
import { setUnauthorizedHandler } from '@/lib/api';
import { ConfirmProvider } from '@/components/ui/confirm';
import { usePricingSync } from '@/lib/pricing';
import { registerForPush } from '@/lib/push';
import { useLiveMe, useLiveUnread } from '@/lib/live';
import { OfflineBanner, connectOnlineManager } from '@/components/ui/states';

/** App-wide background work that needs React Query: live prices, push token after sign-in. */
function AppEffects() {
  usePricingSync();
  useLiveMe();
  useLiveUnread();
  const token = useSession((s) => s.token);
  const expired = useSession((s) => s.expired);
  useEffect(() => {
    if (token) void registerForPush();
  }, [token]);
  // The session ended by itself: say so on the login screen. Forms keep their drafts on the device.
  useEffect(() => {
    if (!expired) return;
    useSession.setState({ expired: false });
    queryClient.clear();
    router.replace({ pathname: '/login', params: { expired: '1' } });
  }, [expired]);
  return null;
}

connectOnlineManager();

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const hydrated = useSession((s) => s.hydrated);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    Font.loadAsync(fontAssets)
      .catch(() => {}) // system fonts are the fallback
      .finally(() => setFontsReady(true));
    useSession.getState().hydrate();
    // An expired or revoked token signs the person out instead of failing every call.
    setUnauthorizedHandler(() => {
      useSession.getState().signOut();
      queryClient.clear();
      router.replace({ pathname: '/login', params: { expired: '1' } });
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const { wide } = useAppWidth();
  const ready = hydrated && fontsReady;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: wide ? colors.mistDeep : colors.mist }}>
      {/* Tablets and desktop: a centred phone-width column instead of stretched screens. */}
      <View style={[styles.column, wide && styles.columnWide]}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ConfirmProvider>
          <AppEffects />
          <StatusBar style="dark" />
          <OfflineBanner />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.mist }, animation: 'slide_from_right', animationDuration: 280 }}>
            <Stack.Screen name="index" options={{ animation: 'fade' }} />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="pay/[bookingId]" options={{ presentation: 'card' }} />
            <Stack.Screen name="confirmed" options={{ gestureEnabled: false, animation: 'fade' }} />
            <Stack.Screen name="admin" />
            <Stack.Screen name="panic/[bookingId]" options={{ gestureEnabled: false, animation: 'fade' }} />
          </Stack>
          </ConfirmProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  column: { flex: 1, width: '100%', backgroundColor: colors.mist },
  // A shadow, not a border: borders would eat into the width children measure from.
  columnWide: { maxWidth: MAX_APP_WIDTH, alignSelf: 'center', overflow: 'hidden', shadowColor: colors.ink, shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 0 } },
});
