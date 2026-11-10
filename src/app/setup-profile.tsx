import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { IconButton } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Enter, PressScale } from '@/components/ui/motion';
import { TextField } from '@/components/ui/forms';
import { Notice, useDraft } from '@/components/ui/states';
import { LocationFields, type LocationValue } from '@/components/LocationFields';
import { CategoryTiles } from '@/components/CategoryTiles';
import { svc } from '@/services';
import { errorMessage, type UploadFile } from '@/lib/api';
import { goHome } from '@/lib/flow';
import { pickImage } from '@/lib/pickImage';
import { stateOf } from '@/domain/places';
import { defaultVisibility, GENDER_OPTIONS, VISIBILITY_COPY } from '@/domain/privacy';
import type { Gender, SeeGender, Visibility } from '@/domain/types';
import { useSession } from '@/state/session';
import { isStaff } from '@/domain/admin';

type Step = 'name' | 'contact' | 'where' | 'categories' | 'gender' | 'meet' | 'photo' | 'visibility';

const MEET: { value: SeeGender; title: string; body: string }[] = [
  { value: 'woman', title: 'Women companions', body: 'Only women companions are shown to you.' },
  { value: 'man', title: 'Men companions', body: 'Only men companions are shown to you.' },
  { value: 'nonbinary', title: 'Non-binary companions', body: 'Only non-binary companions are shown to you.' },
  { value: 'everyone', title: 'Anyone', body: 'All companions are shown to you.' },
];

const COUNTRIES = ['United Kingdom', 'United States', 'United Arab Emirates', 'Canada', 'Australia', 'Singapore', 'Germany', 'France', 'Saudi Arabia', 'Qatar', 'Other'];

/**
 * First run (and for older accounts, whatever is still missing). One question
 * per screen; tapping an answer moves on. Answers are kept as a draft on the
 * phone, so a closed app or an expired session loses nothing.
 * Members: name → (mobile, for email sign-ups) → where → categories → I am →
 * who to meet → photo (required, approved by our team) → who sees the photo.
 * Companions and staff only give their name here (companion sign-up asks the rest).
 */
export default function SetupProfile() {
  const user = useSession((s) => s.user);
  const updateUser = useSession((s) => s.updateUser);
  const simple = isStaff(user?.role) || user?.role === 'companion';
  const needsContact = !user?.phone;

  const [d, setD, clearDraft, restored] = useDraft(`setup.${user?.id ?? 'new'}`, {
    name: user?.fullName ?? '',
    contactPhone: user?.contactPhone ? `+${user.contactPhone}` : '',
    country: user?.country ?? '',
    place: { state: user?.state ?? stateOf(user?.city) ?? '', city: user?.city ?? '', area: user?.area ?? '' } as LocationValue,
    categories: (user?.categories ?? []) as string[],
    gender: user?.gender as Gender | undefined,
    see: user?.seeGender as SeeGender | undefined,
    visibility: user?.profileVisibility as Visibility | undefined,
    photoUri: '' as string,
  });
  const set = (p: Partial<typeof d>) => setD((cur) => ({ ...cur, ...p }));

  const steps: Step[] = useMemo(() => {
    if (simple) return ['name'];
    const all: Step[] = ['name', ...(needsContact ? (['contact'] as Step[]) : []), 'where', 'categories', 'gender', 'meet', 'photo', 'visibility'];
    return all;
  }, [simple, needsContact]);
  // Older accounts: start at the first unanswered question.
  const firstMissing = useMemo(() => {
    const done: Record<Step, boolean> = {
      name: !!user?.fullName,
      contact: !needsContact || !!user?.contactPhone,
      where: !!user?.city,
      categories: !!user?.categories?.length,
      gender: !!user?.gender,
      meet: !!user?.seeGender,
      photo: !!user?.photoStatus && user.photoStatus !== 'none',
      visibility: !!user?.profileVisibility,
    };
    const i = steps.findIndex((s) => !done[s]);
    return i < 0 ? 0 : i;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(firstMissing);
  const step = steps[i];
  const [photo, setPhoto] = useState<UploadFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState(false);

  const next = () => {
    setError(null);
    setTouched(false);
    setI((x) => Math.min(x + 1, steps.length - 1));
  };
  const back = () => (i > 0 ? (setError(null), setI(i - 1)) : router.canGoBack() ? router.back() : undefined);

  const save = async (visibility?: Visibility) => {
    setBusy(true);
    setError(null);
    try {
      const fresh = simple
        ? await svc.saveProfile({ fullName: d.name.trim() })
        : await svc.saveProfile(
            {
              fullName: d.name.trim(),
              state: d.place.state,
              city: d.place.city,
              area: d.place.area,
              categories: d.categories,
              gender: d.gender,
              seeGender: d.see,
              profileVisibility: visibility ?? d.visibility,
              visibilityConsent: true,
              ...(needsContact ? { contactPhone: d.contactPhone, country: d.country } : {}),
            },
            photo,
          );
      await updateUser({ ...fresh, hasPin: user?.hasPin });
      clearDraft();
      goHome({ ...user!, ...fresh });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const nameError = touched && d.name.trim().length < 2 ? 'Please enter your name (at least 2 letters).' : null;
  const phoneDigits = d.contactPhone.replace(/\D/g, '');
  const phoneError = touched && (phoneDigits.length < 8 || phoneDigits.length > 15 || !d.contactPhone.trim().startsWith('+')) ? 'Add your mobile with the country code, like +44 7700 900123.' : null;

  const titles: Record<Step, string> = {
    name: 'What should we call you?',
    contact: 'Your mobile number',
    where: 'Where are you?',
    categories: 'What can we help you with?',
    gender: 'I am',
    meet: 'Who would you like to meet?',
    photo: 'Add a clear photo of you',
    visibility: 'Who can see your photo?',
  };
  const subs: Partial<Record<Step, string>> = {
    name: simple ? (user?.role === 'companion' ? 'Members see your first name.' : 'Shown to the team in the activity log.') : 'Companions see your first name when you book.',
    contact: 'With your country code. For booking updates and safety alerts — never shown to anyone.',
    where: 'We show companions and popular plans near you. Change it any time.',
    categories: 'Tap all that fit. Home opens on them.',
    meet: 'Only these companions are shown to you. Change it any time in Privacy.',
    photo: 'Our team approves every photo. You can keep using prsnn while it’s reviewed.',
    visibility: 'Tap one to choose it. Tapping is your consent to this setting; change it any time in Privacy.',
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.top}>
        {i > 0 ? <IconButton name="chevronLeft" label="Back" onPress={back} /> : <View style={{ width: 48 }} />}
        <View style={styles.dots} accessibilityLabel={`Step ${i + 1} of ${steps.length}`}>
          {steps.map((s, k) => (
            <View key={s} style={[styles.dot, k <= i && styles.dotOn]} />
          ))}
        </View>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: space.huge }} keyboardShouldPersistTaps="handled">
        <Enter key={`h-${step}`} style={styles.head}>
          <Text variant="caption" color={colors.moss} style={{ fontWeight: '700', letterSpacing: 0.6 }}>
            STEP {i + 1} OF {steps.length}
          </Text>
          <Text variant="title1" accessibilityRole="header">
            {titles[step]}
          </Text>
          {subs[step] ? (
            <Text variant="callout" muted>
              {subs[step]}
            </Text>
          ) : null}
        </Enter>
        {restored && i === firstMissing ? (
          <View style={{ paddingHorizontal: GUTTER, marginBottom: space.md }}>
            <Notice tone="success" text="We kept your answers from last time." />
          </View>
        ) : null}

        <Enter key={`b-${step}`} index={1}>
          {step === 'name' ? (
            <View style={styles.body}>
              <TextField
                label="Full name"
                value={d.name}
                onChangeText={(v) => set({ name: v })}
                onBlur={() => setTouched(true)}
                textContentType="name"
                autoComplete="name"
                autoCapitalize="words"
                returnKeyType="next"
                autoFocus={!d.name}
                onSubmitEditing={() => (d.name.trim().length >= 2 ? (simple ? save() : next()) : setTouched(true))}
                error={nameError}
              />
              <Button label={simple ? 'Continue' : 'Next'} iconRight="arrowRight" loading={busy} disabled={d.name.trim().length < 2} onPress={simple ? () => save() : next} />
            </View>
          ) : step === 'contact' ? (
            <View style={styles.body}>
              <Text variant="footnote" color={colors.gray600}>
                Country you live in
              </Text>
              <View style={styles.chips}>
                {COUNTRIES.map((c) => (
                  <Chip key={c} label={c} on={d.country === c} onPress={() => set({ country: c })} />
                ))}
              </View>
              <TextField
                label="Mobile with country code"
                value={d.contactPhone}
                onChangeText={(v) => set({ contactPhone: v.replace(/[^\d+ ]/g, '') })}
                onBlur={() => setTouched(true)}
                placeholder="+44 7700 900123"
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                autoComplete="tel"
                error={phoneError}
              />
              <Button label="Next" iconRight="arrowRight" disabled={!d.country || phoneDigits.length < 8} onPress={() => (phoneError === null && d.contactPhone.trim().startsWith('+') ? next() : setTouched(true))} />
            </View>
          ) : step === 'where' ? (
            <View style={styles.body}>
              <LocationFields value={d.place} onChange={(place) => set({ place })} error={touched ? { area: d.place.city && !d.place.area ? 'Choose your area so we can show companions nearby.' : null } : undefined} />
              <Button label="Next" iconRight="arrowRight" disabled={!d.place.state || !d.place.city} onPress={() => (d.place.area ? next() : setTouched(true))} />
            </View>
          ) : step === 'categories' ? (
            <View style={styles.body}>
              <CategoryTiles selected={d.categories} onToggle={(k) => set({ categories: d.categories.includes(k) ? d.categories.filter((x) => x !== k) : [...d.categories, k] })} />
              <Button label={d.categories.length ? `Next · ${d.categories.length} chosen` : 'Pick at least one'} iconRight="arrowRight" disabled={!d.categories.length} onPress={next} />
            </View>
          ) : step === 'gender' ? (
            <Options
              items={GENDER_OPTIONS.map((g) => ({ key: g.value, title: g.label, icon: 'user' as IconName }))}
              selected={d.gender}
              onPick={(v) => {
                set({ gender: v as Gender, visibility: d.visibility ?? defaultVisibility(v as Gender) });
                next();
              }}
            />
          ) : step === 'meet' ? (
            <Options
              items={MEET.map((m) => ({ key: m.value, title: m.title, body: m.body, icon: 'users' as IconName }))}
              selected={d.see}
              onPick={(v) => {
                set({ see: v as SeeGender });
                next();
              }}
            />
          ) : step === 'photo' ? (
            <View style={styles.body}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={photo || d.photoUri ? 'Your photo. Tap to change it.' : 'Add your photo'}
                onPress={async () => {
                  const p = await pickImage({ aspect: [1, 1] });
                  if (p) {
                    setPhoto(p);
                    set({ photoUri: p.uri });
                    setError(null);
                  }
                }}
                style={styles.photoBox}
              >
                {photo || (user?.profilePhoto && user.photoStatus !== 'changes_requested') ? (
                  <Image source={{ uri: photo?.uri ?? user?.profilePhoto ?? undefined }} style={styles.photo} contentFit="cover" />
                ) : (
                  <View style={[styles.photo, styles.photoEmpty]}>
                    <Icon name="camera" size={30} color={colors.moss} />
                    <Text variant="footnote" color={colors.moss}>
                      Add photo
                    </Text>
                  </View>
                )}
                <View style={styles.cam}>
                  <Icon name="camera" size={16} color={colors.onMoss} />
                </View>
              </Pressable>
              <View style={{ gap: 8 }}>
                {['Your face clearly visible — no sunglasses or filters', 'Just you in the photo', 'Good light: daylight or a bright room', 'You choose who sees it on the next step'].map((t) => (
                  <View key={t} style={styles.tickRow}>
                    <Icon name="shieldCheck" size={16} color={colors.moss} />
                    <Text variant="footnote" style={{ flex: 1 }}>
                      {t}
                    </Text>
                  </View>
                ))}
              </View>
              {error ? (
                <Text variant="footnote" color={colors.danger} accessibilityLiveRegion="polite">
                  {error}
                </Text>
              ) : null}
              <Button
                label="Next"
                iconRight="arrowRight"
                onPress={() => (photo || (user?.photoStatus && user.photoStatus !== 'none' && user.photoStatus !== 'changes_requested') ? next() : setError('Add a clear photo of you to continue. It helps companions trust who they’re meeting.'))}
              />
            </View>
          ) : (
            <Options
              items={(['locked', 'open'] as Visibility[]).map((v) => ({
                key: v,
                title: `${VISIBILITY_COPY[v].title}${d.gender && defaultVisibility(d.gender) === v ? ' · recommended' : ''}`,
                body: VISIBILITY_COPY[v].body,
                icon: (v === 'locked' ? 'lock' : 'eye') as IconName,
              }))}
              selected={d.visibility}
              busy={busy}
              onPick={(v) => {
                set({ visibility: v as Visibility });
                void save(v as Visibility);
              }}
            />
          )}
        </Enter>

        {error && step !== 'photo' ? (
          <View style={{ paddingHorizontal: GUTTER, marginTop: space.md }}>
            <Notice tone="danger" text={`${error} Your answers are saved — tap to try again.`} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={onPress} style={[styles.chip, on && styles.chipOn]}>
      <Text variant="subhead" color={on ? colors.onMoss : colors.ink}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Big tappable answers: one tap = chosen and on to the next question. */
function Options({ items, selected, onPick, busy }: { items: { key: string; title: string; body?: string; icon: IconName }[]; selected?: string; onPick: (k: string) => void; busy?: boolean }) {
  return (
    <View style={[styles.body, { gap: space.sm }]} accessibilityRole="radiogroup">
      {items.map((it) => {
        const on = selected === it.key;
        return (
          <PressScale
            key={it.key}
            disabled={busy}
            accessibilityRole="radio"
            accessibilityState={{ checked: on, busy }}
            accessibilityLabel={it.body ? `${it.title}. ${it.body}` : it.title}
            onPress={() => onPick(it.key)}
            innerStyle={[styles.option, on && styles.optionOn]}
            pressedStyle={styles.optionPressed}
          >
            <View style={styles.optionIcon}>
              <Icon name={it.icon} size={20} color={colors.moss} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="headline">{it.title}</Text>
              {it.body ? (
                <Text variant="footnote" muted>
                  {it.body}
                </Text>
              ) : null}
            </View>
            <View style={[styles.radio, on && styles.radioOn]}>{on ? <View style={styles.radioDot} /> : null}</View>
          </PressScale>
        );
      })}
      {busy ? (
        <Text variant="footnote" muted center>
          Saving…
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.xs, minHeight: 52 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 18, height: 4, borderRadius: 2, backgroundColor: colors.mistDeep },
  dotOn: { backgroundColor: colors.moss },
  head: { paddingHorizontal: GUTTER, gap: space.xs, marginTop: space.md, marginBottom: space.xl },
  body: { paddingHorizontal: GUTTER, gap: space.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: { minHeight: 40, paddingHorizontal: 14, justifyContent: 'center', borderRadius: radius.pill, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  chipOn: { backgroundColor: colors.moss, borderColor: colors.moss },
  photoBox: { alignSelf: 'center' },
  photo: { width: 148, height: 148, borderRadius: 74 },
  photoEmpty: { backgroundColor: colors.paper, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.mossSoft, alignItems: 'center', justifyContent: 'center', gap: 4 },
  cam: { position: 'absolute', right: 6, bottom: 6, width: 36, height: 36, borderRadius: 18, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.mist },
  tickRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  option: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 64, padding: space.lg, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: colors.line },
  optionOn: { borderColor: colors.moss, backgroundColor: colors.green50 },
  optionPressed: { backgroundColor: colors.green50, borderColor: colors.moss },
  optionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.mossSoft, alignItems: 'center', justifyContent: 'center' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.gray300, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.moss },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.moss },
});
