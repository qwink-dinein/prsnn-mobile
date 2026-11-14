import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useQueryClient } from '@tanstack/react-query';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { Chip, IconButton } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Enter, PressScale } from '@/components/ui/motion';
import { TextField } from '@/components/ui/forms';
import { Notice, useDraft } from '@/components/ui/states';
import { Brand } from '@/components/ui/Brand';
import { LocationFields, type LocationValue } from '@/components/LocationFields';
import { CategoryTiles } from '@/components/CategoryTiles';
import { PackageGrid } from '@/components/PackageGrid';
import { AvailabilityEditor, emptyAvailability, type AvailabilityValue } from '@/components/fellow/AvailabilityEditor';
import { IdLaterNotice } from '@/components/fellow/IdParts';
import { ALL_HOURS, companionShareOf, priceFor } from '@/domain/pricing';
import { formatINR } from '@/domain/booking';
import { categoryTitle } from '@/domain/categories';
import { defaultVisibility, GENDER_OPTIONS, VISIBILITY_COPY } from '@/domain/privacy';
import { stateOf } from '@/domain/places';
import type { Gender, Visibility } from '@/domain/types';
import { svc, qk } from '@/services';
import { errorMessage, type UploadFile } from '@/lib/api';
import { pickImage } from '@/lib/pickImage';
import { useSession } from '@/state/session';
import { useStepFlow } from '@/lib/stepFlow';
import { useConfirm } from '@/components/ui/confirm';
import { goToLogin } from '@/lib/flow';

type Step = 'gender' | 'photo' | 'visibility' | 'where' | 'about' | 'offer' | 'durations' | 'availability' | 'finish';
const STEPS: Step[] = ['gender', 'photo', 'visibility', 'where', 'about', 'offer', 'durations', 'availability', 'finish'];
const INTERESTS = ['Coffee', 'Walks', 'Food', 'Movies', 'Music', 'Books', 'Sports', 'Art', 'Shopping', 'Travel', 'Hindi', 'English', 'Telugu', 'Tamil', 'Kannada', 'Marathi', 'Bengali', 'Urdu'];

/**
 * Companion sign-up, one question per screen, mostly taps. No ID upload: the
 * last step only tells them an ID is asked for at the first booking. The
 * profile then goes to our team for approval before it's live. Answers are
 * kept as a draft on the phone.
 */
export default function CompanionOnboarding() {
  const user = useSession((s) => s.user);
  const updateUser = useSession((s) => s.updateUser);
  const qc = useQueryClient();
  const [d, setD, clearDraft, restored] = useDraft(`companion.${user?.id ?? 'new'}`, {
    gender: user?.gender as Gender | undefined,
    visibility: user?.profileVisibility as Visibility | undefined,
    place: {
      state: user?.state ?? stateOf(user?.city) ?? '',
      city: user?.city ?? '',
      area: user?.area ?? '',
    } as LocationValue,
    description: '',
    tags: [] as string[],
    categories: (user?.categories ?? []) as string[],
    packages: [1, 2, 4] as number[],
    avail: emptyAvailability() as AvailabilityValue,
  });
  const set = (p: Partial<typeof d>) => setD((cur) => ({ ...cur, ...p }));
  const confirm = useConfirm();
  // Back always means "previous step"; on the first step it asks before leaving setup.
  const onLeave = async () => {
    if (
      await confirm({
        title: 'Finish setting up?',
        message: 'Your answers are saved. You can carry on now, or log out and finish later.',
        confirmLabel: 'Log out',
        cancelLabel: 'Keep going',
        destructive: true,
      })
    ) {
      await useSession.getState().signOut();
      await goToLogin('/welcome');
    }
  };
  const { i, setI, clearStep } = useStepFlow({
    key: `companion.${user?.id ?? 'new'}`,
    count: STEPS.length,
    initial: 0,
    onLeave,
  });
  const step = STEPS[i];
  const [photo, setPhoto] = useState<UploadFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);

  const next = () => {
    setError(null);
    setTouched(false);
    setI((x) => Math.min(x + 1, STEPS.length - 1));
  };
  const back = () => {
    setError(null);
    if (i > 0) setI(i - 1);
    else if (router.canGoBack()) {
      // Companions who came from Profile → Become a companion can simply go back to it.
      clearStep();
      router.back();
    } else void onLeave();
  };
  const hasPhoto = !!photo || (!!user?.profilePhoto && user.photoStatus !== 'changes_requested');

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await svc.onboardCompanion({
        fullName: user?.fullName ?? '',
        phoneNumber: user?.phone?.replace(/^91/, '') ?? '',
        city: d.place.city,
        state: d.place.state,
        area: d.place.area,
        gender: d.gender,
        profileVisibility: d.visibility,
        description: d.description.trim(),
        packages: d.packages,
        startTime: d.avail.startTime,
        endTime: d.avail.endTime,
        tags: d.tags,
        days: d.avail.days,
        categories: d.categories,
        profilePhoto: photo,
      });
      await updateUser({ ...r.user, hasPin: user?.hasPin });
      clearDraft();
      clearStep();
      qc.invalidateQueries({ queryKey: qk.profileCheck });
      router.replace({
        pathname: '/fellow/verification',
        params: { sent: '1' },
      });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  // Approved copy (design.md "simple onboarding copy"): one short title, at most one short line.
  const titles: Record<Step, string> = {
    gender: 'I am',
    photo: 'Add your photo',
    visibility: 'Who can see your photo?',
    where: 'Where are you based?',
    about: 'About you',
    offer: 'What would you like to do?',
    durations: 'How long can you meet?',
    availability: 'When are you free?',
    finish: 'Almost done',
  };
  const subs: Partial<Record<Step, string>> = {
    photo: 'Members see this first.',
    visibility: 'You can change this later.',
    where: 'You’ll get bookings near you.',
    about: 'A few lines for members.',
    offer: 'Pick one or more.',
    durations: 'You get 80% of each booking.',
  };
  const descError = touched && d.description.trim().length < 30 ? `Write a little more — at least 30 characters (${d.description.trim().length} so far).` : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <IconButton name="chevronLeft" label="Back" onPress={back} />
        <View style={styles.dots} accessibilityLabel={`Step ${i + 1} of ${STEPS.length}`}>
          {STEPS.map((s, k) => (
            <View key={s} style={[styles.dot, k <= i && styles.dotOn]} />
          ))}
        </View>
        <View style={{ width: 48 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: space.huge }} keyboardShouldPersistTaps="handled">
        <Enter key={`h-${step}`} style={styles.head}>
          <Text variant="caption" color={colors.moss} style={{ fontWeight: '700', letterSpacing: 0.6 }}>
            STEP {i + 1} OF {STEPS.length} · COMPANION
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
        {restored && i === 0 ? (
          <View style={{ paddingHorizontal: GUTTER, marginBottom: space.md }}>
            <Notice tone="success" text="We kept your answers from last time." />
          </View>
        ) : null}

        <Enter key={`b-${step}`} index={1} style={styles.body}>
          {step === 'gender' ? (
            <>
              <Notice tone="success" text="Your answers are saved." />
              <Options
                items={GENDER_OPTIONS.map((g) => ({
                  key: g.value,
                  title: g.label,
                  icon: 'user' as IconName,
                }))}
                selected={d.gender}
                onPick={(v) => {
                  set({
                    gender: v as Gender,
                    visibility: d.visibility ?? defaultVisibility(v as Gender),
                  });
                  next();
                }}
              />
            </>
          ) : step === 'photo' ? (
            <>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={hasPhoto ? 'Your photo. Tap to change it.' : 'Add your photo'}
                onPress={async () => {
                  const p = await pickImage({ aspect: [1, 1] });
                  if (p) {
                    setPhoto(p);
                    setError(null);
                  }
                }}
                style={{ alignSelf: 'center' }}
              >
                {hasPhoto ? (
                  <Image
                    source={{
                      uri: photo?.uri ?? user?.profilePhoto ?? undefined,
                    }}
                    style={styles.photo}
                    contentFit="cover"
                  />
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
              {['Face clearly visible', 'Just you', 'A smile helps'].map((t) => (
                <View key={t} style={styles.tickRow}>
                  <Icon name="shieldCheck" size={16} color={colors.moss} />
                  <Text variant="footnote" style={{ flex: 1 }}>
                    {t}
                  </Text>
                </View>
              ))}
              {error ? (
                <Text variant="footnote" color={colors.danger} accessibilityLiveRegion="polite">
                  {error}
                </Text>
              ) : null}
              <Button label="Next" iconRight="arrowRight" onPress={() => (hasPhoto ? next() : setError('Add a clear photo of you to continue.'))} />
            </>
          ) : step === 'visibility' ? (
            <Options
              items={(['locked', 'open'] as Visibility[]).map((v) => ({
                key: v,
                title: `${VISIBILITY_COPY[v].title}${d.gender && defaultVisibility(d.gender) === v ? ' · recommended' : ''}`,
                body: v === 'locked' ? 'Only people who’ve booked you' : VISIBILITY_COPY[v].body,
                icon: (v === 'locked' ? 'lock' : 'eye') as IconName,
              }))}
              selected={d.visibility}
              onPick={(v) => {
                set({ visibility: v as Visibility });
                next();
              }}
            />
          ) : step === 'where' ? (
            <>
              <LocationFields
                value={d.place}
                onChange={(place) => set({ place })}
                error={
                  touched
                    ? {
                        area: d.place.city && !d.place.area ? 'Choose the area you’re based in.' : null,
                      }
                    : undefined
                }
              />
              <Button label="Next" iconRight="arrowRight" disabled={!d.place.state || !d.place.city} onPress={() => (d.place.area ? next() : setTouched(true))} />
            </>
          ) : step === 'about' ? (
            <>
              <TextField
                label="About you"
                value={d.description}
                onChangeText={(v) => set({ description: v })}
                onBlur={() => setTouched(true)}
                multiline
                maxLength={600}
                placeholder="What do you enjoy? What kind of company are you?"
                hint={`${d.description.trim().length}/600`}
                error={descError}
              />
              <Text variant="subhead">Interests and languages</Text>
              <View style={styles.wrap}>
                {INTERESTS.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    selected={d.tags.includes(t)}
                    onPress={() =>
                      set({
                        tags: d.tags.includes(t) ? d.tags.filter((x) => x !== t) : [...d.tags, t],
                      })
                    }
                  />
                ))}
              </View>
              <Button label="Next" iconRight="arrowRight" onPress={() => (d.description.trim().length >= 30 ? next() : setTouched(true))} />
            </>
          ) : step === 'offer' ? (
            <>
              <CategoryTiles
                audience="companion"
                selected={d.categories}
                onToggle={(k) =>
                  set({
                    categories: d.categories.includes(k) ? d.categories.filter((x) => x !== k) : [...d.categories, k],
                  })
                }
              />
              <Button label={d.categories.length ? `Next · ${d.categories.length} chosen` : 'Pick at least one'} iconRight="arrowRight" disabled={!d.categories.length} onPress={next} />
            </>
          ) : step === 'durations' ? (
            <>
              <PackageGrid
                mode="offer"
                hours={ALL_HOURS}
                selected={d.packages}
                onSelect={(h) =>
                  set({
                    packages: d.packages.includes(h) ? d.packages.filter((x) => x !== h) : [...d.packages, h].sort((a, b) => a - b),
                  })
                }
              />
              <Button label="Next" iconRight="arrowRight" disabled={!d.packages.length} onPress={next} />
            </>
          ) : step === 'availability' ? (
            <>
              <AvailabilityEditor value={d.avail} onChange={(avail) => set({ avail })} />
              <Button label="Next" iconRight="arrowRight" disabled={!Object.values(d.avail.days).some(Boolean)} onPress={next} />
            </>
          ) : (
            <>
              <IdLaterNotice />
              <View style={styles.summary}>
                <Line label="Based in" value={[d.place.area, d.place.city, d.place.state].filter(Boolean).join(', ')} />
                <Line label="You’d like to do" value={d.categories.map(categoryTitle).join(', ')} />
                <Line label="Lengths" value={d.packages.map((h) => `${h} h (you get ${formatINR(companionShareOf(priceFor(h) ?? 0))})`).join(' · ')} />
              </View>
              <Text variant="footnote" muted>
                By sending, you agree to the <Brand /> Code of Conduct.
              </Text>
              {error ? <Notice tone="danger" text={`${error} Your answers are saved — try again.`} /> : null}
              <Button label="Send for approval" iconRight="arrowRight" loading={busy} onPress={submit} haptic />
            </>
          )}
        </Enter>
      </ScrollView>
    </SafeAreaView>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        gap: 2,
        paddingVertical: space.sm,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.line,
      }}
    >
      <Text variant="caption" muted>
        {label}
      </Text>
      <Text variant="callout">{value || '—'}</Text>
    </View>
  );
}

function Options({ items, selected, onPick }: { items: { key: string; title: string; body?: string; icon: IconName }[]; selected?: string; onPick: (k: string) => void }) {
  return (
    <View style={{ gap: space.sm }} accessibilityRole="radiogroup">
      {items.map((it) => {
        const on = selected === it.key;
        return (
          <PressScale
            key={it.key}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            accessibilityLabel={it.body ? `${it.title}. ${it.body}` : it.title}
            onPress={() => onPick(it.key)}
            innerStyle={[styles.option, on && styles.optionOn]}
            pressedStyle={styles.optionOn}
          >
            <View style={styles.optionIcon}>
              <Icon name={it.icon} size={20} color={colors.moss} />
            </View>
            <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
              <Text variant="headline">{it.title}</Text>
              {it.body ? (
                <Text variant="footnote" muted>
                  {it.body}
                </Text>
              ) : null}
            </View>
            <Icon name="chevronRight" size={18} color={on ? colors.moss : colors.gray400} />
          </PressScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.xs,
    minHeight: 52,
  },
  dots: { flexDirection: 'row', gap: 5 },
  dot: {
    width: 14,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.mistDeep,
  },
  dotOn: { backgroundColor: colors.moss },
  head: {
    paddingHorizontal: GUTTER,
    gap: space.xs,
    marginTop: space.md,
    marginBottom: space.xl,
  },
  body: { paddingHorizontal: GUTTER, gap: space.lg },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  photo: { width: 148, height: 148, borderRadius: 74 },
  photoEmpty: {
    backgroundColor: colors.paper,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.mossSoft,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  cam: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.moss,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.mist,
  },
  tickRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  summary: {
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    paddingHorizontal: space.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 64,
    padding: space.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  optionOn: { borderColor: colors.moss, backgroundColor: colors.green50 },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mossSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
