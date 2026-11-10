import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { PressScale } from './motion';
import * as Haptics from 'expo-haptics';
import { colors, HIT, radius } from '@/theme/tokens';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
  disabled?: boolean;
  /** Light haptic on press. Use only for meaningful confirmations (pay, book, send). */
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
  compact?: boolean;
  /** Overrides for buttons on coloured backgrounds (e.g. the red panic screen). */
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
};

const BG: Record<Variant, string> = {
  primary: colors.moss,
  secondary: colors.paper,
  ghost: 'transparent',
  danger: colors.dangerSoft,
};
const FG: Record<Variant, string> = {
  primary: colors.onMoss,
  secondary: colors.moss,
  ghost: colors.moss,
  danger: colors.danger,
};

export function Button({ label, onPress, variant = 'primary', icon, iconRight, loading, disabled, haptic, style, accessibilityHint, compact, textColor, backgroundColor, borderColor }: Props) {
  const inactive = disabled || loading;
  const fg = textColor ?? FG[variant];
  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={() => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.();
      }}
      style={style}
      innerStyle={[styles.base, compact && styles.compact, { backgroundColor: backgroundColor ?? BG[variant] }, variant === 'secondary' && styles.outline, borderColor ? { borderWidth: 1.5, borderColor } : null, inactive && styles.disabled]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={18} color={fg} /> : null}
          <Text variant="button" color={fg} numberOfLines={1}>
            {label}
          </Text>
          {iconRight ? <Icon name={iconRight} size={18} color={fg} /> : null}
        </View>
      )}
    </PressScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  compact: { minHeight: HIT - 8, paddingHorizontal: 16, borderRadius: radius.md },
  outline: { borderWidth: 1, borderColor: colors.lineStrong },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  disabled: { opacity: 0.45 },
});
