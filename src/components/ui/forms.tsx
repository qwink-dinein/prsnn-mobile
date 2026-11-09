import { forwardRef, useEffect, useRef, useState, type ComponentRef } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import { PressScale } from './motion';

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
          maxFontSizeMultiplier={1.35}
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

/**
 * On-screen keypad for the 4-digit PIN (mock-up screen 5).
 *
 * - Large round keys (76pt) with a visible surface so they read as buttons.
 * - A digit registers on press-IN, like the system passcode pad; nothing is
 *   lost when tapping fast because the parent applies changes with a
 *   functional update (`onKey` gets the key, not a stale value).
 * - Press feedback: scale 0.94 + darker fill in 100ms, one selection haptic.
 * - On web and with a hardware keyboard, digits and Backspace work too.
 */
export function PinPad({ onKey, disabled }: { onKey: (k: string) => void; disabled?: boolean }) {
  // Did press-in already register this press? (React Native Web can skip
  // press-in on a very quick click; then the release registers the key.)
  const registered = useRef(false);
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const handler = (e: KeyboardEvent) => {
      if (disabled) return;
      if (/^[0-9]$/.test(e.key)) onKey(e.key);
      else if (e.key === 'Backspace') onKey('del');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKey, disabled]);

  const rows = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', 'del']];
  return (
    <View style={styles.pad}>
      {rows.map((row, r) => (
        <View key={r} style={styles.padRow}>
          {row.map((k, i) =>
            k === '' ? (
              <View key={i} style={styles.keySpace} />
            ) : (
              <PressScale
                key={i}
                accessibilityRole="button"
                accessibilityLabel={k === 'del' ? 'Delete' : k}
                disabled={disabled}
                hitSlop={6}
                scaleTo={0.94}
                onPressIn={() => {
                  registered.current = true;
                  Haptics.selectionAsync().catch(() => {});
                  onKey(k);
                }}
                onPress={() => {
                  if (!registered.current) onKey(k);
                  registered.current = false;
                }}
                innerStyle={[styles.key, k === 'del' && styles.keyDel]}
                pressedStyle={k === 'del' ? styles.keyDelPressed : styles.keyPressed}
              >
                {k === 'del' ? (
                  <Icon name="backspace" size={26} color={colors.gray600} />
                ) : (
                  <Text style={styles.keyText} maxFontSizeMultiplier={1.3}>
                    {k}
                  </Text>
                )}
              </PressScale>
            ),
          )}
        </View>
      ))}
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
  pad: { alignSelf: 'center', width: '100%', maxWidth: 300, gap: space.md },
  padRow: { flexDirection: 'row', justifyContent: 'space-between' },
  key: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
  },
  keyPressed: { backgroundColor: colors.mossSoft, borderColor: colors.mossSoft },
  keyDel: { backgroundColor: 'transparent', borderColor: 'transparent' },
  keyDelPressed: { backgroundColor: colors.mistDeep },
  keySpace: { width: 76, height: 76 },
  keyText: { fontFamily: fonts.medium, fontSize: 28, lineHeight: 34, color: colors.ink },
});
