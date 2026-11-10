import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { svc, qk } from '@/services';
import { StyleSheet, View , AppState, Platform } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import NetInfo from '@react-native-community/netinfo';
import { focusManager, onlineManager, useQuery } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, space } from '@/theme/tokens';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import { Button } from './Button';
import { EASE_OUT_CSS } from './motion';

// ───────── Connectivity ─────────

/**
 * Wire React Query to the device: queries pause offline and refetch when the
 * connection is back, and "focus" means the app came back to the foreground
 * (so live lists refresh when someone reopens the app).
 */
export function connectOnlineManager() {
  focusManager.setEventListener((setFocused) => {
    if (Platform.OS === 'web') return undefined;
    const sub = AppState.addEventListener('change', (s) => setFocused(s === 'active'));
    return () => sub.remove();
  });
  onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((s) => setOnline(s.isConnected !== false && s.isInternetReachable !== false)),
  );
}

/** true / false once known; null while the first check runs. */
export function useOnline(): boolean | null {
  const [online, setOnline] = useState<boolean | null>(null);
  useEffect(() => NetInfo.addEventListener((s) => setOnline(s.isConnected !== false && s.isInternetReachable !== false)), []);
  return online;
}

/** A calm bar at the top while offline; a short "Back online" when it returns. */
export function OfflineBanner() {
  const online = useOnline();
  const insets = useSafeAreaInsets();
  const [showBack, setShowBack] = useState(false);
  const wasOffline = useRef(false);
  useEffect(() => {
    if (online === false) wasOffline.current = true;
    if (online && wasOffline.current) {
      wasOffline.current = false;
      setShowBack(true);
      const t = setTimeout(() => setShowBack(false), 2500);
      return () => clearTimeout(t);
    }
  }, [online]);
  if (online !== false && !showBack) return null;
  const off = online === false;
  return (
    <View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.banner, { top: insets.top + 6 }, { backgroundColor: off ? colors.ink : colors.moss }]}
    >
      <Icon name={off ? 'info' : 'check'} size={16} color={colors.onMoss} />
      <Text variant="footnote" color={colors.onMoss}>
        {off ? 'You’re offline. We’ll keep what you’ve done and retry when you’re back.' : 'Back online'}
      </Text>
    </View>
  );
}

// ───────── Loading that stays honest on slow networks ─────────

/** true once `active` has lasted longer than `ms` (default 6 s). */
export function useSlow(active: boolean, ms = 6000) {
  const [since, setSince] = useState<number | null>(null);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setSince(Date.now()), ms);
    return () => {
      clearTimeout(t);
      setSince(null);
    };
  }, [active, ms]);
  return active && since !== null;
}

/** Indeterminate progress bar (a moving segment), not a frozen spinner. */
export function ProgressBar({ style }: { style?: object }) {
  const reduced = useReducedMotion();
  return (
    <View style={[styles.track, style]} accessibilityRole="progressbar" accessibilityLabel="Loading">
      <Animated.View
        style={[
          styles.bar,
          reduced
            ? { width: '40%' }
            : {
                animationName: SLIDE,
                animationDuration: 1200,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out',
              },
        ]}
      />
    </View>
  );
}
const SLIDE = { from: { transform: [{ translateX: -120 }] }, to: { transform: [{ translateX: 320 }] } };

/** Skeleton rows that shimmer while a list loads (makes the wait feel shorter than a spinner). */
export function Skeleton({ rows = 3, height = 76 }: { rows?: number; height?: number }) {
  const reduced = useReducedMotion();
  return (
    <View style={{ gap: space.md }} accessibilityLabel="Loading" accessibilityRole="progressbar">
      {Array.from({ length: rows }, (_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.skel,
            { height },
            reduced ? null : { animationName: PULSE, animationDuration: 1100, animationIterationCount: 'infinite', animationDirection: 'alternate', animationDelay: i * 120 },
          ]}
        />
      ))}
    </View>
  );
}
const PULSE = { from: { opacity: 1 }, to: { opacity: 0.45 } };

// ───────── Success ─────────

/** Confirm it, celebrate it, then show what's next. A check that pops in with a ring. */
export function Celebrate({ title, body, icon = 'check', children }: { title: string; body?: string; icon?: IconName; children?: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <View style={styles.celebrate} accessibilityLiveRegion="polite">
      <View style={styles.ringWrap}>
        {!reduced ? <Animated.View style={[styles.ring, { animationName: RING, animationDuration: 900, animationTimingFunction: EASE_OUT_CSS, animationFillMode: 'forwards' }]} /> : null}
        <Animated.View style={[styles.okCircle, reduced ? null : { animationName: POP, animationDuration: 520, animationTimingFunction: EASE_OUT_CSS, animationFillMode: 'backwards' }]}>
          <Icon name={icon} size={34} color={colors.onMoss} strokeWidth={2.6} />
        </Animated.View>
      </View>
      <Text variant="title1" center accessibilityRole="header">
        {title}
      </Text>
      {body ? (
        <Text variant="callout" muted center style={{ maxWidth: 320 }}>
          {body}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
const POP = { from: { opacity: 0, transform: [{ scale: 0.4 }] }, '70%': { opacity: 1, transform: [{ scale: 1.08 }] }, to: { opacity: 1, transform: [{ scale: 1 }] } };
const RING = { from: { opacity: 0.6, transform: [{ scale: 0.6 }] }, to: { opacity: 0, transform: [{ scale: 1.9 }] } };

/** A one-line status strip for inline results (saved, sent, couldn't save). */
export function Notice({ tone = 'info', text, action, onAction }: { tone?: 'info' | 'success' | 'warning' | 'danger'; text: string; action?: string; onAction?: () => void }) {
  const bg = tone === 'success' ? colors.green50 : tone === 'warning' ? colors.warningSoft : tone === 'danger' ? colors.dangerSoft : colors.paper;
  const fg = tone === 'success' ? colors.moss : tone === 'warning' ? colors.clay : tone === 'danger' ? colors.danger : colors.ink;
  return (
    <View style={[styles.notice, { backgroundColor: bg }]} accessibilityLiveRegion="polite">
      <Icon name={tone === 'success' ? 'check' : 'info'} size={18} color={fg} />
      <Text variant="footnote" color={fg} style={{ flex: 1 }}>
        {text}
      </Text>
      {action ? <Button label={action} variant="ghost" compact onPress={onAction} /> : null}
    </View>
  );
}

// ───────── Drafts: nothing typed is lost to a closed app or an expired session ─────────

/**
 * useState that is also saved on the device (debounced). Clear it on success.
 * Used for setup, companion sign-up, booking forms and admin notes.
 */
export function useDraft<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void, () => void, boolean] {
  const storeKey = `prsnn.draft.${key}`;
  const [value, setValue] = useState<T>(initial);
  const [restored, setRestored] = useState(false);
  const loaded = useRef(false);
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(storeKey)
      .then((raw) => {
        if (!alive) return;
        if (raw) {
          try {
            setValue((v) => ({ ...(v as object), ...JSON.parse(raw) }) as T);
            setRestored(true);
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
      });
    return () => {
      alive = false;
    };
  }, [storeKey]);
  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(() => AsyncStorage.setItem(storeKey, JSON.stringify(value)).catch(() => {}), 400);
    return () => clearTimeout(t);
  }, [storeKey, value]);
  const clear = () => {
    AsyncStorage.removeItem(storeKey).catch(() => {});
  };
  return [value, setValue, clear, restored];
}

const styles = StyleSheet.create({
  banner: { position: 'absolute', left: space.lg, right: space.lg, zIndex: 100, flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: 10, paddingHorizontal: space.lg, borderRadius: radius.pill },
  track: { height: 4, borderRadius: 2, backgroundColor: colors.mistDeep, overflow: 'hidden', width: 200 },
  bar: { width: 80, height: 4, borderRadius: 2, backgroundColor: colors.moss },
  skel: { borderRadius: radius.lg, backgroundColor: colors.mistDeep },
  celebrate: { alignItems: 'center', gap: space.md, paddingVertical: space.xxl },
  ringWrap: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center', marginBottom: space.sm },
  ring: { position: 'absolute', width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: colors.moss },
  okCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
  notice: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
});

// ───────── Live lists ─────────

/** How often live lists (companions on Home, Search, categories) reload while open. */
export const LIVE_INTERVAL = 60_000;

/**
 * The companion list, kept fresh: reloads every 60 s while the screen is open,
 * when the app returns to the foreground, and when you come back to the screen.
 */
export function useLiveCompanions() {
  const q = useQuery({ queryKey: qk.companions, queryFn: svc.companions, refetchInterval: LIVE_INTERVAL, refetchOnWindowFocus: true, staleTime: 15_000 });
  const first = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (first.current) {
        first.current = false;
        return;
      }
      void q.refetch();
    }, [q.refetch]), // eslint-disable-line react-hooks/exhaustive-deps
  );
  return q;
}
