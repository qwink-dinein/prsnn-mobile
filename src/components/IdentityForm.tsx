import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, space } from '@/theme/tokens';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { Chip } from './ui/layout';
import { defaultVisibility, GENDER_OPTIONS, SEE_OPTIONS, VISIBILITY_COPY } from '@/domain/privacy';
import type { Gender, SeeGender, Visibility } from '@/domain/types';

export interface IdentityValue {
  gender?: Gender;
  seeGender?: SeeGender;
  visibility?: Visibility;
  /** The person tapped a visibility option (the card states that this is their agreement). */
  consent: boolean;
}

/**
 * "I am", "Show me" and profile visibility with an explicit consent tick.
 * Choosing a gender pre-selects the default visibility (men open, women and
 * non-binary locked) until the person picks one themselves.
 */
export function IdentityForm({ value, onChange, showSee = true, role = 'member' }: { value: IdentityValue; onChange: (v: IdentityValue) => void; showSee?: boolean; role?: 'member' | 'companion' }) {
  return (
    <View style={{ gap: space.xl }}>
      <View style={{ gap: space.sm }}>
        <Text variant="headline">I am</Text>
        <View style={styles.wrap} accessibilityRole="radiogroup">
          {GENDER_OPTIONS.map((g) => (
            <Chip
              key={g.value}
              label={g.label}
              selected={value.gender === g.value}
              onPress={() => onChange({ ...value, gender: g.value, visibility: value.visibility ?? defaultVisibility(g.value), consent: value.consent })}
            />
          ))}
        </View>
      </View>

      {showSee ? (
        <View style={{ gap: space.sm }}>
          <Text variant="headline">Show me</Text>
          <Text variant="footnote" muted>
            You’ll only see {role === 'companion' ? 'people' : 'companions'} of this gender. Change it any time in Profile.
          </Text>
          <View style={styles.wrap} accessibilityRole="radiogroup">
            {SEE_OPTIONS.map((g) => (
              <Chip key={g.value} label={g.label} selected={value.seeGender === g.value} onPress={() => onChange({ ...value, seeGender: g.value })} />
            ))}
          </View>
        </View>
      ) : null}

      <View style={{ gap: space.sm }}>
        <Text variant="headline">Who can see your photo</Text>
        {(['open', 'locked'] as Visibility[]).map((v) => {
          const on = value.visibility === v;
          return (
            <Pressable
              key={v}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              accessibilityLabel={`${VISIBILITY_COPY[v].title}. ${VISIBILITY_COPY[v].body}`}
              onPress={() => onChange({ ...value, visibility: v, consent: true })}
              style={[styles.option, on && styles.optionOn]}
            >
              <Icon name={v === 'locked' ? 'lock' : 'eye'} size={20} color={colors.moss} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="callout" style={{ fontFamily: 'DMSans-SemiBold' }}>
                  {VISIBILITY_COPY[v].title}
                  {value.gender && defaultVisibility(value.gender) === v ? <Text variant="caption" muted>{'  '}· default</Text> : null}
                </Text>
                <Text variant="footnote" muted>
                  {VISIBILITY_COPY[v].body}
                </Text>
              </View>
              <View style={[styles.radio, on && styles.radioOn]}>{on ? <View style={styles.radioDot} /> : null}</View>
            </Pressable>
          );
        })}
        <Text variant="caption" muted>
          Tapping an option means you agree to your profile being shown that way. Change it any time in Profile → Privacy.
        </Text>
      </View>
    </View>
  );
}

export const identityComplete = (v: IdentityValue, needSee = true) => !!(v.gender && (!needSee || v.seeGender) && v.visibility && v.consent);

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  option: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: colors.line },
  optionOn: { borderColor: colors.moss, backgroundColor: colors.green50 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.gray300, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.moss },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.moss },
  consent: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md, padding: space.md, borderRadius: radius.md, backgroundColor: colors.mistDeep, minHeight: 48 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.gray400, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  boxOn: { backgroundColor: colors.moss, borderColor: colors.moss },
});
