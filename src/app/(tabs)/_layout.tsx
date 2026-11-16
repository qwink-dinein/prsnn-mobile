import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useSession } from '@/state/session';
import { badgeLabel } from '@/lib/live';
import { useMode, useModeBookings } from '@/lib/mode';
import { goToLogin } from '@/lib/flow';

/**
 * Signed out while on a tab (Log out, an expired session, a sign-out elsewhere). Whatever signed the
 * person out already sends them to the PIN or login screen; this only steps in if nothing did. It used
 * to redirect to the welcome screen at once, which flashed the welcome photo before the PIN screen.
 */
function SignedOut() {
  useEffect(() => {
    const t = setTimeout(() => void goToLogin('/welcome'), 400);
    return () => clearTimeout(t);
  }, []);
  return <View style={{ flex: 1, backgroundColor: colors.mist }} />;
}

const tab = (icon: IconName) =>
  function TabIcon({ color, focused }: { color: unknown; focused: boolean }) {
    return <Icon name={icon} size={24} color={String(color)} strokeWidth={focused ? 2.1 : 1.7} />;
  };

export default function TabsLayout() {
  const token = useSession((s) => s.token);
  // Each mode has its own tabs and its own counts (src/domain/mode.ts).
  const { mode } = useMode();
  const { by, offers, unreadChats } = useModeBookings();
  if (!token) return <SignedOut />;
  const companionMode = mode === 'companion';
  // Requests: offers waiting for my answer. My bookings: bookings I still need to pay for.
  const toPay = by.booking.filter((b) => b.paymentStatus !== 'paid' && ['pending', 'accepted'].includes(b.status) && (b.flow !== 'prepaid' || b.allocation?.state === 'awaiting_payment')).length;
  const bookingsCount = companionMode ? offers : toPay;
  const bookingsBadge = badgeLabel(bookingsCount);
  const messagesBadge = badgeLabel(unreadChats[mode]);
  const bookingsTitle = companionMode ? 'Requests' : 'My bookings';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.moss,
        tabBarInactiveTintColor: colors.gray400,
        // No fixed height: React Navigation adds the device's bottom inset (home
        // indicator, Android gesture bar). A fixed 64/88 put labels under the system bar.
        tabBarStyle: { backgroundColor: colors.paper, borderTopColor: colors.line, ...(Platform.OS === 'web' ? { height: 60, paddingBottom: 6 } : null) },
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
        // Five short labels in a fixed bar: very large system text would clip them.
        tabBarAllowFontScaling: false,
        sceneStyle: { backgroundColor: colors.mist },
        // Live counts (src/lib/live.ts): champagne circle, midnight number, hidden at 0.
        tabBarBadgeStyle: { backgroundColor: colors.champagne, color: colors.midnight, fontFamily: fonts.bold, fontSize: 11, minWidth: 18, height: 18, lineHeight: 18, borderWidth: 2, borderColor: colors.paper },
      }}
    >
      <Tabs.Screen name="home" options={{ title: companionMode ? 'Today' : 'Home', tabBarIcon: tab(companionMode ? 'chart' : 'home') }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: tab('search'), href: companionMode ? null : undefined }} />
      <Tabs.Screen
        name="bookings"
        options={{
          title: bookingsTitle,
          tabBarIcon: tab('calendar'),
          tabBarBadge: bookingsBadge ?? undefined,
          tabBarAccessibilityLabel: bookingsBadge ? `${bookingsTitle}, ${bookingsCount} waiting for you` : undefined,
        }}
      />
      <Tabs.Screen name="earnings" options={{ title: 'Earnings', tabBarIcon: tab('wallet'), href: companionMode ? undefined : null }} />
      <Tabs.Screen
        name="messages"
        options={{ title: 'Chats', tabBarIcon: tab('message'), tabBarBadge: messagesBadge ?? undefined, tabBarAccessibilityLabel: messagesBadge ? `Chats, ${unreadChats[mode]} unread` : undefined }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tab('user') }} />
    </Tabs>
  );
}
