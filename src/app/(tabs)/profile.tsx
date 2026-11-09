import { Alert, Linking, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Avatar, ListRow, Pill } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { LINKS } from '@/lib/config';
import { displayPhone } from '@/lib/flow';
import { queryClient } from '@/lib/queryClient';
import { useSession } from '@/state/session';

/** Screen 15 · Profile (grouped settings list, no hamburger menu). */
export default function ProfileTab() {
  const user = useSession((s) => s.user);
  const savedCount = useSession((s) => s.prefs.saved.length);
  const signOut = useSession((s) => s.signOut);
  const isCompanion = user?.role === 'companion';
  const verified = user?.is_verified;

  const logout = () =>
    Alert.alert('Log out?', 'You can log back in with your number and OTP or your PIN.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          queryClient.clear();
          router.replace('/welcome');
        },
      },
    ]);

  return (
    <Screen>
      <Text variant="title2" style={{ paddingTop: space.sm }} accessibilityRole="header">
        My profile
      </Text>
      <View style={styles.head}>
        <Avatar uri={user?.profilePhoto} name={user?.fullName} size={76} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="title3" numberOfLines={1}>
            {user?.fullName || 'Your name'}
          </Text>
          {verified ? (
            <View style={styles.verified}>
              <Icon name="badgeCheck" size={16} color={colors.moss} />
              <Text variant="footnote" color={colors.moss}>
                Verified member
              </Text>
            </View>
          ) : (
            <Pill label={user?.verification_status === 'pending' ? 'Verification pending' : 'Not verified yet'} tone="warning" />
          )}
          {user?.phone ? (
            <Text variant="footnote" muted>
              {displayPhone(user.phone)}
            </Text>
          ) : null}
        </View>
      </View>

      {isCompanion ? (
        <View style={styles.group}>
          <ListRow icon="chart" label="Companion dashboard" onPress={() => router.push('/home')} />
          <ListRow icon="wallet" label="Earnings" onPress={() => router.push('/fellow/earnings')} />
          <ListRow icon="shieldCheck" label="Verification status" value={user?.verification_status} onPress={() => router.push('/fellow/verification')} last />
        </View>
      ) : (
        <View style={styles.group}>
          <ListRow icon="sparkle" label="Become a companion" value="Earn doing what you love" onPress={() => router.push('/fellow/apply')} last />
        </View>
      )}

      <View style={styles.group}>
        <ListRow icon="user" label="Personal information" onPress={() => router.push('/edit-profile')} />
        <ListRow icon="heart" label="Saved companions" value={savedCount ? `${savedCount} saved` : undefined} onPress={() => router.push('/saved')} />
        <ListRow icon="bell" label="Notifications" onPress={() => router.push('/notifications')} />
        <ListRow icon="lock" label={user?.hasPin ? 'Change PIN' : 'Set a PIN'} onPress={() => router.push({ pathname: '/pin', params: { mode: 'set' } })} last />
      </View>

      <View style={styles.group}>
        <ListRow icon="help" label="Help & support" onPress={() => Linking.openURL(LINKS.support)} />
        <ListRow icon="shield" label="Code of conduct" onPress={() => Linking.openURL(LINKS.conduct)} />
        <ListRow icon="doc" label="Terms & privacy" onPress={() => Linking.openURL(LINKS.terms)} last />
      </View>

      <View style={styles.group}>
        <ListRow icon="logout" label="Log out" onPress={logout} danger />
        <ListRow icon="trash" label="Delete account" onPress={() => router.push('/delete-account')} danger last />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.lg, marginVertical: space.xl },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  group: { backgroundColor: colors.paper, borderRadius: radius.xl, overflow: 'hidden', marginBottom: space.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
});
