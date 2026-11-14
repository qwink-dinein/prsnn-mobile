import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { colors, radius, space } from '@/theme/tokens';
import { formatINR } from '@/domain/booking';
import { offeredHours, priceFor } from '@/domain/pricing';
import type { Companion } from '@/domain/types';
import { useSession } from '@/state/session';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { Avatar } from './ui/layout';
import { LockedPhoto } from './LockedPhoto';

/** Lowest package this companion offers (prices are the same for everyone). */
export const fromPrice = (c: Pick<Companion, 'packages'>) => priceFor(offeredHours(c.packages)[0]) ?? 399;

export const firstName = (name?: string) => (name ?? '').trim().split(/\s+/)[0] || 'Companion';
export const placeOf = (c: Pick<Companion, 'area' | 'city'>) => [c.area, c.city].filter(Boolean).join(', ');

export function HeartButton({ id, size = 20, onDark }: { id: string; size?: number; onDark?: boolean }) {
  const saved = useSession((s) => s.prefs.saved.includes(id));
  const toggle = useSession((s) => s.toggleSaved);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? 'Remove from saved' : 'Save companion'}
      accessibilityState={{ selected: saved }}
      onPress={() => toggle(id)}
      hitSlop={10}
      style={[styles.heart, onDark && styles.heartOnPhoto]}
    >
      <Icon name="heart" size={size} color={colors.clay} filled={saved} />
    </Pressable>
  );
}

function Photo({ c, style }: { c: Companion; style: object }) {
  if (c.locked) return <LockedPhoto style={style} />;
  if (c.profilePhoto) return <Image source={{ uri: c.profilePhoto }} style={style} contentFit="cover" transition={200} accessibilityIgnoresInvertColors />;
  return (
    <View style={[style, styles.photoFallback]}>
      <Text style={styles.photoInitial}>{firstName(c.fullName).charAt(0)}</Text>
    </View>
  );
}

/** "ID verified" only after a real check; new companions are labelled honestly. */
export function TrustBadge({ c }: { c: Pick<Companion, 'idVerified'> }) {
  const ok = c.idVerified !== false;
  return (
    <View style={[styles.badge, !ok && styles.badgeNew]}>
      {ok ? <Icon name="shieldCheck" size={12} color={colors.moss} /> : null}
      <Text variant="caption" color={ok ? colors.moss : colors.gray600}>
        {ok ? 'ID verified' : 'New on prsnn'}
      </Text>
    </View>
  );
}

/** Tall card in the "Popular near you" rail (mock-up 6). */
export function CompanionCard({ c, width }: { c: Companion; width: number }) {
  const photoH = width * 1.05;
  // The heart sits on top of the card as a sibling, not inside it: a button inside a
  // button is invalid on the web and steals taps on some Android versions.
  return (
    <View style={{ width }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${c.fullName ?? 'Companion'}, ${placeOf(c)}, from ${formatINR(fromPrice(c))}`}
        onPress={() => router.push(`/companion/${c.id}`)}
        style={({ pressed }) => [styles.card, { width }, pressed && { opacity: 0.9 }]}
      >
        <Photo c={c} style={[styles.cardPhoto, { height: photoH }]} />
        <View style={styles.cardBody}>
          <Text variant="headline" numberOfLines={1} style={{ paddingRight: 36 }}>
            {firstName(c.fullName)}
          </Text>
          <Text variant="footnote" muted numberOfLines={1}>
            {placeOf(c) || 'Nearby'}
          </Text>
          <Text variant="subhead" color={colors.moss}>
            From {formatINR(fromPrice(c))}
          </Text>
          <TrustBadge c={c} />
        </View>
      </Pressable>
      <View style={[styles.heartSlot, { top: photoH + space.md - 6, right: space.sm }]}>
        <HeartButton id={c.id} size={18} />
      </View>
    </View>
  );
}

/** List row used in Search (mock-up 7) and Saved. */
export function CompanionRow({ c, onPress }: { c: Companion; onPress?: () => void }) {
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${c.fullName ?? 'Companion'}, ${placeOf(c)}`}
        onPress={onPress ?? (() => router.push(`/companion/${c.id}`))}
        style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.mistDeep }]}
      >
        <Avatar uri={c.profilePhoto} name={c.fullName} size={64} online locked={c.locked} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="headline" numberOfLines={1}>
            {c.fullName ?? 'Companion'}
          </Text>
          <Text variant="footnote" muted numberOfLines={1}>
            {placeOf(c) || 'Nearby'}
          </Text>
          {c.tags.length ? (
            <Text variant="caption" color={colors.gray500} numberOfLines={1}>
              {c.tags.slice(0, 3).join(' · ')}
            </Text>
          ) : null}
          <TrustBadge c={c} />
        </View>
        <View style={{ alignItems: 'flex-end', gap: space.sm }}>
          {/* Space for the heart, which sits on top of the row (see CompanionCard). */}
          <View style={{ width: 32, height: 32 }} />
          <Text variant="subhead" color={colors.moss}>
            From {formatINR(fromPrice(c))}
          </Text>
        </View>
      </Pressable>
      <View style={[styles.heartSlot, { top: space.md, right: space.sm }]}>
        <HeartButton id={c.id} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.paper, borderRadius: radius.xl, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  cardPhoto: { width: '100%', backgroundColor: colors.mistDeep },
  cardBody: { padding: space.md, gap: 2 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md, paddingHorizontal: space.sm, borderRadius: radius.lg },
  heart: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  heartSlot: { position: 'absolute' },
  heartOnPhoto: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.92)' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 3, alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 2, borderRadius: radius.pill, backgroundColor: colors.mossSoft, marginTop: 2 },
  badgeNew: { backgroundColor: colors.mistDeep },
  photoFallback: { backgroundColor: colors.mossSoft, alignItems: 'center', justifyContent: 'center' },
  photoInitial: { fontFamily: 'Urbanist-SemiBold', fontSize: 48, color: colors.moss },
});
