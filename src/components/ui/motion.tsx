import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/theme/tokens';
import Animated, {
  cubicBezier,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/** Strong ease-out for UI (never ease-in: it delays the moment people are watching). */
export const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

/** The same curve for Reanimated CSS animations and transitions. */
export const EASE_OUT_CSS = cubicBezier(0.23, 1, 0.32, 1);

const fadeUp = {
  from: { opacity: 0, transform: [{ translateY: 12 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }] },
};
const fadeOnly = { from: { opacity: 0 }, to: { opacity: 1 } };

/**
 * One-time entrance for a block of a screen: fades up 12pt. Pass `index` to
 * stagger siblings by 70ms. Reduced motion → a short fade, no movement.
 * Use on screens people see occasionally (login, onboarding) — not on tabs.
 *
 * A Reanimated CSS animation (plays on mount, UI thread). Not an `entering`
 * layout animation: those take the element out of flow on web when the
 * screen's layout later changes, and this needs no layout tracking at all.
 */
export function Enter({ index = 0, children, style }: { index?: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  return (
    <Animated.View
      style={[
        style,
        {
          animationName: reduced ? fadeOnly : fadeUp,
          animationDuration: reduced ? 200 : 420,
          animationDelay: reduced ? 0 : 80 + index * 70,
          animationTimingFunction: EASE_OUT_CSS,
          animationFillMode: 'backwards',
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * Horizontal shake for a rejected input (wrong PIN, invalid number). Runs on
 * the UI thread. Reduced motion → no movement; the error text carries it.
 */
export function useShake() {
  const reduced = useReducedMotion();
  const x = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));
  const shake = useCallback(() => {
    if (reduced) return;
    const t = (to: number, d: number) => withTiming(to, { duration: d, easing: EASE_OUT });
    x.set(withSequence(t(-10, 50), t(9, 60), t(-6, 60), t(3, 60), t(0, 70)));
  }, [reduced, x]);
  return { style, shake };
}

type ScaleProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Visual inside the animated wrapper (background, radius live here). */
  innerStyle?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  scaleTo?: number;
  children: ReactNode;
};

/**
 * Press feedback: scales to 0.97 on press-in in 120ms (a Reanimated CSS
 * transition, so it runs on the UI thread and needs no shared value).
 */
export function PressScale({ style, innerStyle, pressedStyle, scaleTo = 0.97, children, onPressIn, onPressOut, ...rest }: ScaleProps) {
  const [pressed, setPressed] = useState(false);
  const reduced = useReducedMotion();
  return (
    <Pressable
      {...rest}
      pressRetentionOffset={{ top: 16, left: 16, right: 16, bottom: 16 }}
      onPressIn={(e) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        onPressOut?.(e);
      }}
      style={style}
    >
      <Animated.View
        style={[
          innerStyle,
          pressed && pressedStyle,
          {
            transform: [{ scale: pressed && !reduced ? scaleTo : 1 }],
            transitionProperty: 'transform',
            transitionDuration: pressed ? 100 : 160,
            transitionTimingFunction: 'ease-out',
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

const pop = {
  '0%': { opacity: 0, transform: [{ scale: 0.4 }] },
  '60%': { opacity: 1, transform: [{ scale: 1.06 }] },
  '100%': { opacity: 1, transform: [{ scale: 1 }] },
};
const rise = {
  from: { opacity: 0, transform: [{ translateY: 12 }, { scale: 0.98 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
};
const fromLeft = { from: { opacity: 0, transform: [{ translateX: -48 }] }, to: { opacity: 1, transform: [{ translateX: 0 }] } };
const fromRight = { from: { opacity: 0, transform: [{ translateX: 48 }] }, to: { opacity: 1, transform: [{ translateX: 0 }] } };

/** True once `flag` has gone from false to true while mounted (not when it starts true). */
export function useBecameTrue(flag: boolean): boolean {
  const first = useRef(flag);
  const [became, setBecame] = useState(false);
  useEffect(() => {
    if (flag && !first.current) setBecame(true);
    if (!flag) first.current = false;
  }, [flag]);
  return became;
}

/**
 * Pops its child in (scale 0.4 → 1.06 → 1, 360ms) the moment `active` turns true while the
 * screen is open, e.g. a booking step completing. Already-true on mount → no animation.
 */
export function Pop({ active, children, style, duration = 360, delay = 0 }: { active: boolean; children: ReactNode; style?: StyleProp<ViewStyle>; duration?: number; delay?: number }) {
  const reduced = useReducedMotion();
  const play = useBecameTrue(active);
  return (
    <Animated.View
      style={[
        style,
        play
          ? { animationName: reduced ? fadeOnly : pop, animationDuration: reduced ? 200 : duration, animationDelay: reduced ? 0 : delay, animationTimingFunction: EASE_OUT_CSS, animationFillMode: 'backwards' }
          : null,
      ]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * A bar that fills top-down (or left-right) when `filled` turns true: the booking-progress line.
 * Starts in its final state on mount; only real changes animate (420ms).
 */
export function FillLine({ filled, color, track, style, vertical = true }: { filled: boolean; color: string; track: string; style?: StyleProp<ViewStyle>; vertical?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <View style={[{ backgroundColor: track, overflow: 'hidden' }, style]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: color,
            transformOrigin: vertical ? 'top' : 'left',
            transform: [vertical ? { scaleY: filled ? 1 : 0 } : { scaleX: filled ? 1 : 0 }],
            transitionProperty: 'transform',
            transitionDuration: reduced ? 0 : 420,
            transitionTimingFunction: EASE_OUT_CSS,
          },
        ]}
      />
    </View>
  );
}

/** A new chat bubble rising from the input (260ms). `animate` false → renders still (history). */
export function RiseIn({ animate, children, style }: { animate: boolean; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  return (
    <Animated.View
      style={[
        style,
        animate ? { animationName: reduced ? fadeOnly : rise, animationDuration: reduced ? 200 : 260, animationTimingFunction: EASE_OUT_CSS, animationFillMode: 'backwards' } : null,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const bob = {
  '0%': { opacity: 0.45, transform: [{ translateY: 0 }] },
  '30%': { opacity: 1, transform: [{ translateY: -4 }] },
  '60%': { opacity: 0.45, transform: [{ translateY: 0 }] },
  '100%': { opacity: 0.45, transform: [{ translateY: 0 }] },
};

/** "Typing…" bubble: three dots bobbing in turn (1s loop). Reduced motion → still dots. */
export function TypingDots({ name }: { name?: string }) {
  const reduced = useReducedMotion();
  return (
    <RiseIn animate style={typing.bubble}>
      <View accessible accessibilityLabel={`${name ?? 'They'} ${name ? 'is' : 'are'} typing`} accessibilityLiveRegion="polite" style={typing.row}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[
              typing.dot,
              reduced ? { opacity: 0.6 } : { animationName: bob, animationDuration: 1000, animationDelay: i * 150, animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out' },
            ]}
          />
        ))}
      </View>
    </RiseIn>
  );
}
const typing = StyleSheet.create({
  bubble: { alignSelf: 'flex-start', backgroundColor: colors.paper, borderRadius: 18, borderBottomLeftRadius: 6, paddingHorizontal: 14, paddingVertical: 12, marginTop: 4 },
  row: { flexDirection: 'row', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textSubtle },
});

/** Two people sliding together, with a badge popping between them (booking confirmed). */
export function MeetPair({ left, right, badge, size = 84 }: { left: ReactNode; right: ReactNode; badge: ReactNode; size?: number }) {
  const reduced = useReducedMotion();
  const slide = (name: typeof fromLeft) =>
    reduced ? { animationName: fadeOnly, animationDuration: 200 } : { animationName: name, animationDuration: 560, animationTimingFunction: EASE_OUT_CSS, animationFillMode: 'backwards' as const };
  const overlap = size * 0.22;
  return (
    <View style={{ width: size * 2 - overlap, height: size + 8, alignSelf: 'center' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Animated.View style={[{ position: 'absolute', left: 0, top: 0 }, slide(fromLeft)]}>{left}</Animated.View>
      <Animated.View style={[{ position: 'absolute', right: 0, top: 0 }, slide(fromRight)]}>{right}</Animated.View>
      <Animated.View
        style={[
          { position: 'absolute', left: (size * 2 - overlap) / 2 - 18, bottom: -6 },
          reduced ? { animationName: fadeOnly, animationDuration: 200 } : { animationName: pop, animationDuration: 420, animationDelay: 480, animationTimingFunction: EASE_OUT_CSS, animationFillMode: 'backwards' },
        ]}
      >
        {badge}
      </Animated.View>
    </View>
  );
}

const easeOutQuart = (k: number) => 1 - Math.pow(1 - k, 4);

/**
 * A number that rolls from its old value to the new one (450ms, ease-out) so a price change
 * registers. First render shows the value as is; reduced motion → jumps straight there.
 */
export function useCountUp(value: number, duration = 450): number {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (reduced || start === value) {
      from.current = value;
      setShown(value);
      return;
    }
    let raf = 0;
    const t0 = Date.now();
    const step = () => {
      const k = Math.min(1, (Date.now() - t0) / duration);
      const v = start + (value - start) * easeOutQuart(k);
      from.current = v;
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduced]);
  return Math.round(shown);
}
