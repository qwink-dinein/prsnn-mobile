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

/** Tall card in the "Popular near you" rail (mock-up 6). */
export function CompanionCard({ c, width }: { c: Companion; width: number }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${c.fullName ?? 'Companion'}, ${placeOf(c)}, from ${formatINR(fromPrice(c))}`}
      onPress={() => router.push(`/companion/${c.id}`)}
      style={({ pressed }) => [styles.card, { width }, pressed && { opacity: 0.9 }]}
    >
      <Photo c={c} style={[styles.cardPhoto, { height: width * 1.05 }]} />
      <View style={styles.cardBody}>
        <View style={styles.rowBetween}>
          <Text variant="headline" numberOfLines={1} style={{ flex: 1 }}>
            {firstName(c.fullName)}
          </Text>
          <HeartButton id={c.id} size={18} />
        </View>
        <Text variant="footnote" muted numberOfLines={1}>
          {placeOf(c) || 'Nearby'}
        </Text>
        <Text variant="subhead" color={colors.moss}>
          From {formatINR(fromPrice(c))}
        </Text>
      </View>
    </Pressable>
  );
}

/** List row used in Search (mock-up 7) and Saved. */
export function CompanionRow({ c }: { c: Companion }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${c.fullName ?? 'Companion'}, ${placeOf(c)}`}
      onPress={() => router.push(`/companion/${c.id}`)}
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
      </View>
      <View style={{ alignItems: 'flex-end', gap: space.sm }}>
        <HeartButton id={c.id} />
        <Text variant="subhead" color={colors.moss}>
          From {formatINR(fromPrice(c))}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.paper, borderRadius: radius.xl, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  cardPhoto: { width: '100%', backgroundColor: colors.mistDeep },
  cardBody: { padding: space.md, gap: 2 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md, paddingHorizontal: space.sm, borderRadius: radius.lg },
  heart: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  heartOnPhoto: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(250,249,246,0.92)' },
  photoFallback: { backgroundColor: colors.mossSoft, alignItems: 'center', justifyContent: 'center' },
  photoInitial: { fontFamily: 'Lora-SemiBold', fontSize: 48, color: colors.moss },
});
