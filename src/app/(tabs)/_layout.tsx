import { Redirect, Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useSession } from '@/state/session';

const tab = (icon: IconName) =>
  function TabIcon({ color, focused }: { color: unknown; focused: boolean }) {
    return <Icon name={icon} size={24} color={String(color)} strokeWidth={focused ? 2.1 : 1.7} />;
  };

export default function TabsLayout() {
  const token = useSession((s) => s.token);
  const isCompanion = useSession((s) => s.user?.role === 'companion');
  if (!token) return <Redirect href="/welcome" />;

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
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: tab(isCompanion ? 'chart' : 'home') }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: tab('search') }} />
      <Tabs.Screen name="bookings" options={{ title: isCompanion ? 'Requests' : 'Bookings', tabBarIcon: tab('calendar') }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages', tabBarIcon: tab('message') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tab('user') }} />
    </Tabs>
  );
}
