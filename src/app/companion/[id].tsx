import { useRef, useState, type ComponentRef } from 'react';
import { useAppWidth } from '@/lib/layout';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { ErrorState, IconButton, Loading, Pill } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Brand } from '@/components/ui/Brand';
import { LockedPhoto } from '@/components/LockedPhoto';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { HeartButton, firstName, fromPrice, placeOf } from '@/components/companions';
import { hoursLabel, offeredHours, priceFor } from '@/domain/pricing';
import { availableDayNames, CATEGORIES, DEFAULT_END, DEFAULT_START, formatINR, formatTime, matchesCategory, toDateKey } from '@/domain/booking';
import { BookingPicker, type BookingChoice } from '@/components/BookingPicker';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import { useSession } from '@/state/session';
import { openPhoto } from '@/lib/photoViewer';
import { SafetyMenu } from '@/components/SafetyActions';
import { hasVisiblePhoto } from '@/domain/search';

/** Screen 8 · Companion profile. */
export default function CompanionProfile() {
  const { id, category, hours, book } = useLocalSearchParams<{ id: string; category?: string; hours?: string; book?: string }>();
  const heroRef = useRef<ComponentRef<typeof View>>(null);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  // From the photo viewer's Book button: scroll to the booking picker once both have a place on screen.
  const sheetY = useRef<number | null>(null);
  const pickerY = useRef<number | null>(null);
  const scrolled = useRef(false);
  const scrollToPicker = () => {
    if (book !== '1' || scrolled.current || sheetY.current == null || pickerY.current == null) return;
    scrolled.current = true;
    scrollRef.current?.scrollTo({ y: Math.max(0, sheetY.current + pickerY.current - 16), animated: true });
  };
  const me = useSession((s) => s.user);
  const insets = useSafeAreaInsets();
  const { width } = useAppWidth();
  const q = useQuery({ queryKey: qk.companion(id), queryFn: () => svc.companion(id) });
  const [choice, setChoice] = useState<BookingChoice>({ hours: null, date: null, time: null });
  const ready = !!(choice.hours && choice.date && choice.time);

  if (q.isLoading) return <Loading />;
  if (q.isError || !q.data)
    return (
      <SafeAreaView style={styles.safe}>
        <IconButton name="chevronLeft" label="Back" onPress={() => router.back()} />
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      </SafeAreaView>
    );

  const c = q.data;
  const isMe = me?.id === c.id;
  const cats = CATEGORIES.filter((k) => matchesCategory(c.tags, k.key));
  const days = availableDayNames(c.availability);
  const photoH = Math.min(width * 1.05, 460);

  return (
    <View style={styles.safe}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 120 + insets.bottom }} showsVerticalScrollIndicator={false}>
        <View ref={heroRef} collapsable={false} style={{ height: photoH, backgroundColor: colors.mossSoft }}>
          {c.locked ? (
            <LockedPhoto style={StyleSheet.absoluteFill} size="lg" />
          ) : c.profilePhoto ? (
            <Image source={{ uri: c.profilePhoto }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} accessibilityLabel={`Photo of ${c.fullName}`} />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.fallback]}>
              <Text style={styles.initial}>{firstName(c.fullName).charAt(0)}</Text>
            </View>
          )}
          {hasVisiblePhoto(c) ? (
            <Pressable
              accessibilityRole="imagebutton"
              accessibilityLabel={`Open ${firstName(c.fullName)}’s photo`}
              onPress={() => openPhoto(heroRef.current, c, { actions: false })}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          <View style={[styles.photoBar, { top: insets.top + space.xs }]}>
            <IconButton name="chevronLeft" label="Back" onPress={() => router.back()} style={styles.round} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
              {isMe ? null : <SafetyMenu person={{ id: c.id, name: firstName(c.fullName) }} onBlocked={() => router.back()} style={styles.round} />}
              <HeartButton id={c.id} onDark size={22} />
            </View>
          </View>
        </View>

        <View style={styles.sheet} onLayout={(e) => {
          sheetY.current = e.nativeEvent.layout.y;
          scrollToPicker();
        }}>
          <View style={styles.nameRow}>
            <Text variant="title1" style={{ flexShrink: 1 }}>
              {c.fullName ?? 'Companion'}
            </Text>
            <Icon name="badgeCheck" size={22} color={colors.moss} />
          </View>
          {c.locked ? (
            <View style={styles.lockNote}>
              <Icon name="lock" size={16} color={colors.moss} />
              <Text variant="footnote" color={colors.gray600} style={{ flex: 1 }}>
                {firstName(c.fullName)} keeps their photo private. It unlocks once your booking is confirmed and paid.
              </Text>
            </View>
          ) : null}
          {placeOf(c) ? (
            <View style={styles.meta}>
              <Icon name="mapPin" size={16} color={colors.gray500} />
              <Text variant="callout" muted>
                {placeOf(c)}
              </Text>
            </View>
          ) : null}
          {c.idVerified === false ? (
            <View style={styles.meta}>
              <Pill label="New on prsnn" />
              <Text variant="footnote" color={colors.moss} style={{ flex: 1 }}>
                ID checked by our team before you meet. If it doesn’t pass, you get another companion or a full refund.
              </Text>
            </View>
          ) : (
            <View style={styles.meta}>
              <Icon name="shieldCheck" size={16} color={colors.moss} />
              <Text variant="footnote" color={colors.moss}>
                ID verified by <Brand /> · public places only
              </Text>
            </View>
          )}

          {cats.length || c.tags.length ? (
            <View style={styles.tags}>
              {cats.map((k) => (
                <View key={k.key} style={styles.tagCard}>
                  <Icon name={k.icon as IconName} size={22} color={colors.moss} />
                  <Text variant="caption">{k.label}</Text>
                </View>
              ))}
              {c.tags
                .filter((t) => !cats.some((k) => matchesCategory([t], k.key)))
                .slice(0, 4)
                .map((t) => (
                  <Pill key={t} label={t} />
                ))}
            </View>
          ) : null}

          <Text variant="title3" style={styles.h}>
            About me
          </Text>
          <Text variant="body" color={colors.gray600}>
            {c.description || `${firstName(c.fullName)} hasn’t written a bio yet.`}
          </Text>

          {isMe ? null : (
            <>
              <Text variant="title3" style={styles.h}>
                Book {firstName(c.fullName)}
              </Text>
              <View style={styles.meta}>
                <Icon name="calendar" size={16} color={colors.gray500} />
                <Text variant="footnote" muted style={{ flex: 1 }}>
                  {days.length ? `${days.join(' · ')} · ${formatTime(c.startTime || DEFAULT_START)} – ${formatTime(c.endTime || DEFAULT_END)}` : 'No days set yet'}
                </Text>
              </View>
              {days.length ? (
                <View
                  onLayout={(e) => {
                    pickerY.current = e.nativeEvent.layout.y;
                    scrollToPicker();
                  }}
                >
                  <BookingPicker c={c} onChange={setChoice} initialHours={hours ? Number(hours) : undefined} />
                </View>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.sm }]}>
        <View style={{ flex: 1, minWidth: 0 }}>
          {choice.hours ? (
            <>
              <Text variant="title3">{formatINR(priceFor(choice.hours) ?? 0)}</Text>
              <Text variant="caption" muted numberOfLines={1}>
                {hoursLabel(choice.hours)}
                {ready ? ` · ${choice.date!.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}, ${formatTime(choice.time!)}` : ' · longer costs less per hour'}
              </Text>
            </>
          ) : (
            <>
              <Text variant="title3">From {formatINR(fromPrice(c))}</Text>
              <Text variant="caption" muted>
                for {hoursLabel(offeredHours(c.packages)[0] ?? 1)} · longer costs less per hour
              </Text>
            </>
          )}
        </View>
        <Button
          label={isMe ? 'This is you' : !days.length ? 'Not available' : !choice.date ? 'Pick a day' : !choice.time ? 'Pick a time' : 'Continue'}
          disabled={isMe || !ready}
          onPress={() =>
            router.push({
              pathname: '/book/review',
              params: { id: c.id, date: toDateKey(choice.date!), time: choice.time!, duration: String(choice.hours! * 60), ...(category ? { category } : {}) },
            })
          }
          style={{ flex: 1.3 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  fallback: { alignItems: 'center', justifyContent: 'center' },
  initial: { fontFamily: 'Urbanist-SemiBold', fontSize: 120, color: colors.moss },
  photoBar: { position: 'absolute', left: space.md, right: space.md, flexDirection: 'row', justifyContent: 'space-between' },
  round: { backgroundColor: 'rgba(255,255,255,0.92)' },
  sheet: { marginTop: -28, backgroundColor: colors.mist, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, paddingHorizontal: GUTTER, paddingTop: space.xl, gap: space.xs },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  meta: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.lg, alignItems: 'center' },
  tagCard: { alignItems: 'center', gap: 4, minWidth: 68, paddingVertical: space.md, paddingHorizontal: space.sm, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  h: { marginTop: space.xl, marginBottom: space.xs },
  lockNote: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md, borderRadius: radius.md, backgroundColor: colors.green50, marginVertical: space.xs, borderWidth: 1, borderColor: colors.line },
  pkg: { minWidth: 84, paddingVertical: space.sm, paddingHorizontal: space.md, borderRadius: radius.md, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, gap: 2 },
  infoCard: { backgroundColor: colors.paper, borderRadius: radius.lg, padding: space.lg, gap: space.sm, borderWidth: 1, borderColor: colors.line },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: space.lg, paddingHorizontal: GUTTER, paddingTop: space.md, backgroundColor: colors.paper, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
});
