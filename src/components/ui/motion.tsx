import { useCallback, useState, type ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
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
