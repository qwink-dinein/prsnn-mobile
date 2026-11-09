import { useEffect, useState } from 'react';
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

/** App-wide background work that needs React Query: live prices, push token after sign-in. */
function AppEffects() {
  usePricingSync();
  const token = useSession((s) => s.token);
  useEffect(() => {
    if (token) void registerForPush();
  }, [token]);
  return null;
}

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
      router.replace('/login');
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const ready = hydrated && fontsReady;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.mist }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ConfirmProvider>
          <AppEffects />
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.mist }, animation: 'default' }}>
            <Stack.Screen name="index" options={{ animation: 'fade' }} />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="pay/[bookingId]" options={{ presentation: 'card' }} />
            <Stack.Screen name="confirmed" options={{ gestureEnabled: false, animation: 'fade' }} />
            <Stack.Screen name="admin" />
          </Stack>
          </ConfirmProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
