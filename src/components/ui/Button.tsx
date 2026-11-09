import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
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

export function Button({ label, onPress, variant = 'primary', icon, iconRight, loading, disabled, haptic, style, accessibilityHint, compact }: Props) {
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={() => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        { backgroundColor: BG[variant] },
        variant === 'secondary' && styles.outline,
        inactive && styles.disabled,
        pressed && !inactive && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={FG[variant]} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={18} color={FG[variant]} /> : null}
          <Text variant="button" color={FG[variant]} numberOfLines={1}>
            {label}
          </Text>
          {iconRight ? <Icon name={iconRight} size={18} color={FG[variant]} /> : null}
        </View>
      )}
    </Pressable>
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
  pressed: { opacity: 0.85, transform: [{ scale: 0.985 }] },
});
