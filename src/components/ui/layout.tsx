import type { ReactNode } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { colors, CONTENT_MAX, GUTTER, HIT, radius, shadow, space } from '@/theme/tokens';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import { Button } from './Button';
import { Wordmark } from './Brand';
import { LockedPhoto } from '../LockedPhoto';
import { ProgressBar, useOnline, useSlow } from './states';

/** Every screen: mist background, safe areas, optional scroll and a footer pinned above the home indicator. */
export function Screen({
  children,
  scroll = true,
  edges = ['top'],
  footer,
  padded = true,
  style,
  refreshControl,
}: {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  footer?: ReactNode;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  refreshControl?: React.ComponentProps<typeof ScrollView>['refreshControl'];
}) {
  // Tablets and wide windows: content keeps a readable width, centred (design.md · fit every device).
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.column, padded && styles.padded, { paddingBottom: footer ? space.xl : space.huge }, style]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, styles.column, padded && styles.padded, style]}>{children}</View>
  );
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {body}
        {footer ? (
          <SafeAreaView edges={['bottom']} style={styles.footer}>
            <View style={styles.column}>{footer}</View>
          </SafeAreaView>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** Inline navigation bar: back at top-left (swipe-back still works), centred title, optional trailing action. */
export function Header({ title, right, onBack, back = true }: { title?: string; right?: ReactNode; onBack?: () => void; back?: boolean }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerSide}>
        {back ? (
          <IconButton
            name="chevronLeft"
            label="Back"
            onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
          />
        ) : null}
      </View>
      <Text variant="headline" numberOfLines={1} style={styles.headerTitle} accessibilityRole="header">
        {title ?? ''}
      </Text>
      <View style={[styles.headerSide, { alignItems: 'flex-end' }]}>{right}</View>
    </View>
  );
}

export function IconButton({ name, label, onPress, color = colors.ink, filled, size = 22, style }: { name: IconName; label: string; onPress?: () => void; color?: string; filled?: boolean; size?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }, style]}
    >
      <Icon name={name} size={size} color={color} filled={filled} />
    </Pressable>
  );
}

export function Card({ children, style, onPress, accessibilityLabel }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; accessibilityLabel?: string }) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Chip({ label, selected, onPress, icon }: { label: string; selected?: boolean; onPress?: () => void; icon?: IconName }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.chipOn, pressed && { opacity: 0.8 }]}
    >
      {icon ? <Icon name={icon} size={16} color={selected ? colors.onMoss : colors.moss} /> : null}
      <Text variant="subhead" color={selected ? colors.onMoss : colors.ink}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Small status pill. */
export function Pill({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'success' | 'warning' | 'danger' }) {
  const map = {
    neutral: [colors.mistDeep, colors.gray600],
    success: [colors.successSoft, colors.moss],
    warning: [colors.warningSoft, colors.clay],
    danger: [colors.dangerSoft, colors.danger],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text variant="caption" color={fg}>
        {label}
      </Text>
    </View>
  );
}

export function Avatar({ uri, name, size = 48, online, locked }: { uri?: string | null; name?: string; size?: number; online?: boolean; locked?: boolean }) {
  if (locked) {
    return (
      <View style={{ width: size, height: size }}>
        <LockedPhoto style={{ width: size, height: size, borderRadius: size / 2 }} size={size > 70 ? 'md' : 'sm'} />
        {online ? <View style={[styles.dot, { right: size * 0.02, bottom: size * 0.02 }]} accessibilityLabel="Verified" /> : null}
      </View>
    );
  }
  const initials = (name ?? '?')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <View style={{ width: size, height: size }}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.mistDeep }} contentFit="cover" transition={150} accessibilityIgnoresInvertColors />
      ) : (
        <View style={[styles.initials, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text variant={size > 60 ? 'title2' : 'headline'} color={colors.moss}>
            {initials}
          </Text>
        </View>
      )}
      {online ? <View style={[styles.dot, { right: size * 0.02, bottom: size * 0.02 }]} accessibilityLabel="Verified" /> : null}
    </View>
  );
}

/** Settings-style row: leading icon, label, optional value, chevron. */
export function ListRow({ icon, label, value, onPress, danger, last }: { icon: IconName; label: string; value?: string; onPress?: () => void; danger?: boolean; last?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, !last && styles.rowLine, pressed && { backgroundColor: colors.mistDeep }]}
    >
      <Icon name={icon} size={20} color={danger ? colors.danger : colors.moss} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="callout" color={danger ? colors.danger : colors.ink}>
          {label}
        </Text>
        {value ? (
          <Text variant="footnote" muted numberOfLines={2}>
            {value}
          </Text>
        ) : null}
      </View>
      {!danger ? <Icon name="chevronRight" size={18} color={colors.gray400} /> : null}
    </Pressable>
  );
}

export function Section({ title, action, onAction, children, style }: { title: string; action?: string; onAction?: () => void; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ marginTop: space.xxl }, style]}>
      <View style={styles.sectionHead}>
        <Text variant="title3" accessibilityRole="header">
          {title}
        </Text>
        {action ? (
          <Pressable accessibilityRole="button" onPress={onAction} hitSlop={10} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Text variant="subhead" color={colors.moss}>
              {action}
            </Text>
            <Icon name="chevronRight" size={14} color={colors.moss} />
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

/** Loading: a spinner first; after 6 s a moving bar and an honest "slow connection" line. */
export function Loading({ label = 'Loading…' }: { label?: string }) {
  const slow = useSlow(true);
  const online = useOnline();
  return (
    <View style={styles.center} accessibilityLabel={label} accessibilityRole="progressbar">
      {slow ? <ProgressBar /> : <ActivityIndicator color={colors.moss} />}
      {online === false ? (
        <Text variant="footnote" muted center style={{ marginTop: space.md, maxWidth: 280 }}>
          You’re offline. This will load as soon as you’re connected.
        </Text>
      ) : slow ? (
        <Text variant="footnote" muted center style={{ marginTop: space.md, maxWidth: 280 }}>
          Still working — your connection seems slow. Hang on, it’s on its way.
        </Text>
      ) : null}
    </View>
  );
}

export function EmptyState({ icon = 'sparkle', title, body, action, onAction }: { icon?: IconName; title: string; body?: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Icon name={icon} size={26} color={colors.moss} />
      </View>
      <Text variant="title3" center>
        {title}
      </Text>
      {body ? (
        <Text variant="callout" muted center style={{ maxWidth: 300 }}>
          {body}
        </Text>
      ) : null}
      {action ? <Button label={action} onPress={onAction} compact style={{ marginTop: space.sm }} /> : null}
    </View>
  );
}

/** Says what went wrong and how to fix it. Offline gets its own words (and retries by itself on reconnect). */
export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const online = useOnline();
  if (online === false || /no connection|network|fetch/i.test(message ?? '')) {
    return <EmptyState icon="info" title="You’re offline" body="Check Wi-Fi or mobile data. We’ll load this as soon as you’re back online." action={onRetry ? 'Try again' : undefined} onAction={onRetry} />;
  }
  return <EmptyState icon="info" title="That didn’t load" body={`${message ?? 'Something went wrong on our side.'} Try again in a moment — if it keeps happening, contact support.`} action={onRetry ? 'Try again' : undefined} onAction={onRetry} />;
}

/** The "prsnn." wordmark with the champagne dot (see Brand.tsx). */
export function Logo({ size = 28, color = colors.ink }: { size?: number; color?: string }) {
  return <Wordmark size={size} color={color} />;
}

/** Segmented control (Upcoming / Past / Cancelled). */
export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={styles.seg} accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.value)}
            style={[styles.segItem, on && styles.segOn]}
          >
            <Text variant="subhead" color={on ? colors.onMoss : colors.gray600} numberOfLines={1}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const layoutStyles = StyleSheet.create({
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  fill: { flex: 1 },
  padded: { paddingHorizontal: GUTTER },
  column: { width: '100%', maxWidth: CONTENT_MAX, alignSelf: 'center' },
  footer: { paddingHorizontal: GUTTER, paddingTop: space.md, paddingBottom: space.sm, backgroundColor: colors.mist, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  header: { flexDirection: 'row', alignItems: 'center', minHeight: 52, paddingHorizontal: space.xs },
  headerSide: { width: 72, justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center' },
  iconBtn: { width: HIT, height: HIT, alignItems: 'center', justifyContent: 'center', borderRadius: HIT / 2 },
  card: { backgroundColor: colors.paper, borderRadius: radius.xl, padding: space.lg, borderWidth: 1, borderColor: colors.line, ...shadow.card },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 38, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  chipOn: { backgroundColor: colors.moss, borderColor: colors.moss },
  pill: { alignSelf: 'flex-start', flexShrink: 1, maxWidth: '100%', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  initials: { backgroundColor: colors.mossSoft, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.paper },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 56, paddingHorizontal: space.lg, paddingVertical: space.sm },
  rowLine: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xxxl },
  empty: { alignItems: 'center', gap: space.sm, paddingVertical: space.huge, paddingHorizontal: space.xl },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.mossSoft, alignItems: 'center', justifyContent: 'center', marginBottom: space.xs },
  seg: { flexDirection: 'row', backgroundColor: colors.mistDeep, borderRadius: radius.md, padding: 4, gap: 4 },
  segItem: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm, paddingHorizontal: 6 },
  segOn: { backgroundColor: colors.moss },
});
