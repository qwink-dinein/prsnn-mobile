import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { badgeLabel } from '@/lib/live';
import { setMode, useAdminWaiting, useMode, useModeBookings } from '@/lib/mode';
import type { AppMode } from '@/domain/mode';

const LABEL: Record<AppMode, string> = { admin: 'Admin', booking: 'Booking', companion: 'Companion' };

/**
 * Admin | Booking | Companion (each only if this person can use it), at the top of every main screen
 * and of Admin. Booking mode: a light pill with the midnight segment; Companion mode: a midnight pill with
 * the gold segment; Admin: a steel pill with the gold segment, so it's always clear which hat you're
 * wearing. A gold count on another mode shows what's waiting there. Hidden for people with one mode.
 */
export function ModeSwitch({ style }: { style?: object }) {
  const { current: mode, modes, canSwitch } = useMode();
  const { waiting: sideWaiting } = useModeBookings();
  const adminWaiting = useAdminWaiting();
  if (!canSwitch) return null;
  const waiting: Record<AppMode, number> = { ...sideWaiting, admin: adminWaiting };
  const dark = mode !== 'booking';
  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.pill, dark && styles.pillDark, mode === 'admin' && styles.pillAdmin]} accessibilityRole="tablist" accessibilityLabel="Mode">
        {modes.map((m) => {
          const on = m === mode;
          const count = on ? 0 : waiting[m];
          return (
            <Pressable
              key={m}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${LABEL[m]} mode${count ? `, ${count} waiting` : ''}`}
              onPress={() => {
                if (on) return;
                Haptics.selectionAsync().catch(() => {});
                setMode(m);
              }}
              style={[styles.seg, on && (dark ? styles.segOnDark : styles.segOn)]}
            >
              <Text style={[styles.label, { color: on ? (dark ? colors.midnight : colors.porcelain) : dark ? 'rgba(241,241,244,0.75)' : colors.gray600 }]} numberOfLines={1}>
                {LABEL[m]}
              </Text>
              {count ? (
                <View style={styles.count}>
                  <Text style={styles.countText}>{badgeLabel(count)}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Home (booking mode): "2 new requests in Companion mode · Switch", only when something is waiting there. */
export function OtherModeBanner() {
  const { current, modes } = useMode();
  const { offers, unreadChats } = useModeBookings();
  if (!modes.includes('companion') || current !== 'booking') return null;
  const parts = [offers ? `${offers} new ${offers === 1 ? 'request' : 'requests'}` : null, unreadChats.companion ? `${unreadChats.companion} unread ${unreadChats.companion === 1 ? 'message' : 'messages'}` : null].filter(Boolean);
  if (!parts.length) return null;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${parts.join(' and ')} in Companion mode. Switch to Companion mode`} onPress={() => setMode('companion')} style={styles.banner}>
      <Icon name="bell" size={18} color={colors.champagne} />
      <Text variant="footnote" color={colors.porcelain} style={{ flex: 1 }}>
        <Text variant="footnote" color={colors.champagne} style={{ fontFamily: fonts.semibold }}>
          {parts.join(' · ')}
        </Text>
        {' in Companion mode'}
      </Text>
      <Text variant="subhead" color={colors.champagne} style={{ fontFamily: fonts.semibold }}>
        Switch
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: GUTTER },
  pill: { flexDirection: 'row', padding: 3, borderRadius: radius.pill, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  pillDark: { backgroundColor: colors.midnight, borderColor: colors.midnight },
  pillAdmin: { backgroundColor: colors.steel, borderColor: colors.steel },
  seg: { flex: 1, minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: radius.pill, paddingHorizontal: space.sm },
  segOn: { backgroundColor: colors.midnight },
  segOnDark: { backgroundColor: colors.champagne },
  label: { fontFamily: fonts.semibold, fontSize: 14 },
  count: { minWidth: 18, height: 18, paddingHorizontal: 5, borderRadius: 9, backgroundColor: colors.champagne, alignItems: 'center', justifyContent: 'center' },
  countText: { fontFamily: fonts.bold, fontSize: 11, color: colors.midnight },
  banner: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginHorizontal: GUTTER, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.midnight, minHeight: 48 },
});
