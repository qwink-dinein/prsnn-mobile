import { forwardRef, useRef, useState, type ComponentRef } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

type FieldProps = TextInputProps & { label?: string; error?: string | null; hint?: string; icon?: IconName; prefix?: string };

export const TextField = forwardRef<ComponentRef<typeof TextInput>, FieldProps>(function TextField({ label, error, hint, icon, prefix, style, multiline, ...rest }, ref) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <Text variant="subhead" color={colors.gray600}>
          {label}
        </Text>
      ) : null}
      <View style={[styles.field, multiline && styles.multiline, focused && styles.focused, !!error && styles.errored]}>
        {icon ? <Icon name={icon} size={18} color={colors.gray500} /> : null}
        {prefix ? (
          <Text variant="body" color={colors.gray600}>
            {prefix}
          </Text>
        ) : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.gray400}
          accessibilityLabel={label ?? rest.placeholder}
          {...rest}
          multiline={multiline}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[styles.input, multiline && { minHeight: 96, textAlignVertical: 'top' }, style]}
        />
      </View>
      {error ? (
        <Text variant="footnote" color={colors.danger} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="footnote" muted>
          {hint}
        </Text>
      ) : null}
    </View>
  );
});

/**
 * One-time-code boxes backed by a single hidden input, so iOS "From Messages"
 * autofill and Android SMS Retriever paste work and the keyboard is numeric.
 */
export function CodeBoxes({ length, value, onChange, secure, autoFocus = true }: { length: number; value: string; onChange: (v: string) => void; secure?: boolean; autoFocus?: boolean }) {
  const ref = useRef<ComponentRef<typeof TextInput>>(null);
  return (
    <Pressable onPress={() => ref.current?.focus()} accessibilityLabel={`${length}-digit code`} style={styles.codeRow}>
      {Array.from({ length }).map((_, i) => {
        const ch = value[i];
        const active = i === value.length;
        return (
          <View key={i} style={[styles.codeBox, active && styles.codeActive]}>
            <Text variant="title2" style={{ fontFamily: fonts.semibold }}>
              {ch ? (secure ? '•' : ch) : ''}
            </Text>
          </View>
        );
      })}
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType={secure ? 'password' : 'oneTimeCode'}
        autoComplete={secure ? 'off' : 'sms-otp'}
        maxLength={length}
        autoFocus={autoFocus}
        caretHidden
        style={styles.hiddenInput}
        accessibilityLabel={secure ? 'PIN' : 'Verification code'}
      />
    </Pressable>
  );
}

/** On-screen keypad for the 4-digit PIN (mock-up screen 5). */
export function PinPad({ value, onChange, length = 4 }: { value: string; onChange: (v: string) => void; length?: number }) {
  const press = (k: string) => {
    Haptics.selectionAsync().catch(() => {});
    if (k === 'del') onChange(value.slice(0, -1));
    else if (value.length < length) onChange(value + k);
  };
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
  return (
    <View style={styles.pad}>
      {keys.map((k, i) =>
        k === '' ? (
          <View key={i} style={styles.key} />
        ) : (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={k === 'del' ? 'Delete' : k}
            onPress={() => press(k)}
            style={({ pressed }) => [styles.key, pressed && { backgroundColor: colors.mistDeep }]}
          >
            {k === 'del' ? <Icon name="backspace" size={24} color={colors.gray600} /> : <Text variant="title2" style={{ fontFamily: fonts.medium }}>{k}</Text>}
          </Pressable>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: 54,
    paddingHorizontal: space.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  multiline: { alignItems: 'flex-start', paddingVertical: space.md },
  focused: { borderColor: colors.moss, borderWidth: 1.5 },
  errored: { borderColor: colors.danger },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.ink, paddingVertical: 12 },
  codeRow: { flexDirection: 'row', justifyContent: 'center', gap: space.sm },
  codeBox: {
    flex: 1,
    maxWidth: 56,
    height: 60,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeActive: { borderColor: colors.moss, borderWidth: 1.5 },
  hiddenInput: { position: 'absolute', opacity: 0.01, width: 1, height: 1 },
  pad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: space.sm, paddingHorizontal: space.xl },
  key: { width: '30%', height: 60, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
});
