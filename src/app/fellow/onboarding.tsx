import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { colors, space } from '@/theme/tokens';
import { Screen, Header, Chip } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Brand } from '@/components/ui/Brand';
import { IdentityForm, identityComplete, type IdentityValue } from '@/components/IdentityForm';
import { AreaPicker, CityPicker } from '@/components/PlacePicker';
import { stateOf } from '@/domain/places';
import { PackageGrid } from '@/components/PackageGrid';
import { ALL_HOURS, companionShareOf, pricing, priceFor } from '@/domain/pricing';
import { formatINR , CATEGORIES } from '@/domain/booking';
import { TextField } from '@/components/ui/forms';
import { AvailabilityEditor, emptyAvailability, type AvailabilityValue } from '@/components/fellow/AvailabilityEditor';
import { svc, qk } from '@/services';
import { errorMessage, type UploadFile } from '@/lib/api';
import { useSession } from '@/state/session';
import { IdLaterNotice, Upload } from '@/components/fellow/IdParts';

const STEPS: { title: string; sub: string; icon: IconName }[] = [
  { title: 'Basic information', sub: 'Name, gender, city, privacy, about you', icon: 'user' },
  { title: 'Photo', sub: 'A clear photo of your face', icon: 'camera' },
  { title: 'Packages & availability', sub: 'Durations you offer, days and hours', icon: 'clock' },
  { title: 'Go live', sub: 'Review, and one thing before your first booking', icon: 'sparkle' },
];

const EXTRA_TAGS = ['Hindi', 'Urdu', 'Telugu', 'English', 'Books', 'Movies', 'Music', 'Cricket', 'Yoga', 'Shopping'];

/**
 * Screen 18 · Companion onboarding → submit_companion_application. Companions go
 * live at the end; the photo ID is asked for when their first booking arrives
 * (fellow/verify-id), so sign-up stays short.
 */
export default function CompanionOnboarding() {
  const user = useSession((s) => s.user);
  const updateUser = useSession((s) => s.updateUser);
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [basic, setBasic] = useState({ fullName: user?.fullName ?? '', city: user?.city ?? '', state: stateOf(user?.city) ?? '', area: '', description: '' });
  const [identity, setIdentity] = useState<IdentityValue>({ gender: user?.gender, seeGender: user?.seeGender, visibility: user?.profileVisibility, consent: !!user?.profileVisibility });
  const [tags, setTags] = useState<string[]>([]);
  const [photo, setPhoto] = useState<UploadFile | null>(null);
  const [packages, setPackages] = useState<number[]>(() => pricing().headlineHours);
  const [avail, setAvail] = useState<AvailabilityValue>(emptyAvailability());
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const toggleTag = (t: string) => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const validate = (s: number): string | null => {
    if (s === 0) {
      if (basic.fullName.trim().length < 2) return 'Please enter your full name.';
      if (!identityComplete(identity, false)) return 'Choose your gender and how your photo is shown, then tick the box to agree.';
      if (!basic.city) return 'Choose your city.';
      if (!basic.area.trim()) return 'Add the area you’re based in.';
      if (basic.description.trim().length < 30) return 'Write at least a couple of sentences about yourself (30+ characters).';
      if (!tags.length) return 'Pick at least one thing you enjoy doing.';
    }
    if (s === 1 && !photo) return 'Add a profile photo.';
    if (s === 2) {
      if (!packages.length) return 'Choose at least one duration you offer.';
      if (!Object.values(avail.days).some(Boolean)) return 'Choose at least one day.';
    }
    return null;
  };

  const next = async () => {
    const err = validate(step);
    if (err) return setError(err);
    setError(null);
    if (step < STEPS.length - 1) return setStep(step + 1);
    setBusy(true);
    try {
      await svc.onboardCompanion({
        fullName: basic.fullName.trim(),
        phoneNumber: user?.phone?.replace(/^91/, '') ?? '',
        city: basic.city,
        state: basic.state,
        area: basic.area.trim(),
        gender: identity.gender,
        profileVisibility: identity.visibility,
        description: basic.description.trim(),
        packages,
        startTime: avail.startTime,
        endTime: avail.endTime,
        tags,
        days: avail.days,
        profilePhoto: photo,
      });
      await updateUser({ role: 'companion', verification_status: 'id_required', is_verified: false, fullName: basic.fullName.trim(), profilePhoto: photo?.uri, gender: identity.gender, profileVisibility: identity.visibility, city: basic.city });
      qc.invalidateQueries({ queryKey: qk.profileCheck });
      router.replace('/fellow/verification');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen
      footer={
        <View style={{ gap: space.xs }}>
          {error ? (
            <Text variant="footnote" color={colors.danger} center accessibilityLiveRegion="polite">
              {error}
            </Text>
          ) : null}
          <Button label={step === STEPS.length - 1 ? 'Got it, go live' : 'Continue'} onPress={next} loading={busy} />
        </View>
      }
    >
      <Header title="Complete your profile" onBack={() => (step ? (setError(null), setStep(step - 1)) : router.back())} />
      <Steps current={step} />

      {step === 0 ? (
        <View style={styles.form}>
          <TextField label="Full name" value={basic.fullName} onChangeText={(v) => setBasic({ ...basic, fullName: v })} autoCapitalize="words" textContentType="name" />
          <IdentityForm value={identity} onChange={setIdentity} showSee={false} role="companion" />
          <CityPicker value={basic.city ? { city: basic.city, state: basic.state } : null} onChange={(pl) => setBasic({ ...basic, city: pl.city, state: pl.state, area: '' })} hint="Members in this city can find you." />
          <AreaPicker city={basic.city} value={basic.area} onChange={(a) => setBasic({ ...basic, area: a })} />
          <TextField label="About you" value={basic.description} onChangeText={(v) => setBasic({ ...basic, description: v })} multiline maxLength={600} placeholder="What do you enjoy? What kind of company are you?" hint={`${basic.description.trim().length}/600`} />
          <Text variant="subhead">What do you enjoy?</Text>
          <View style={styles.wrap}>
            {[...CATEGORIES.map((c) => c.label), ...EXTRA_TAGS].map((t) => (
              <Chip key={t} label={t} selected={tags.includes(t)} onPress={() => toggleTag(t)} />
            ))}
          </View>
        </View>
      ) : step === 1 ? (
        <View style={styles.form}>
          <Text variant="callout" muted>
            A recent, well-lit photo of your face. This is what members see first.
          </Text>
          <Upload label="Profile photo" file={photo} onPick={setPhoto} square />
        </View>
      ) : step === 2 ? (
        <View style={styles.form}>
          <View style={{ gap: space.xs }}>
            <Text variant="headline">Durations you offer</Text>
            <Text variant="footnote" muted>
              Everyone on <Brand /> uses the same prices, so members compare people, not rates. Tick any lengths you’re happy to do. <Brand /> keeps 20%; you receive 80% of every booking.
            </Text>
          </View>
          <PackageGrid mode="offer" hours={ALL_HOURS} selected={packages} onSelect={(h) => setPackages((cur) => (cur.includes(h) ? cur.filter((x) => x !== h) : [...cur, h].sort((a, b) => a - b)))} />
          <AvailabilityEditor value={avail} onChange={setAvail} />
        </View>
      ) : (
        <View style={styles.form}>
          <Review label="Name" value={`${basic.fullName} · ${basic.area}, ${basic.city}`} />
          <Review label="Photo" value={identity.visibility === 'locked' ? 'Locked — blurred placeholder until a booking is confirmed' : 'Open — everyone can see it'} />
          <Review label="Enjoys" value={tags.join(', ')} />
          <Review label="Packages" value={packages.map((h) => `${h} h ${formatINR(priceFor(h) ?? 0)} (you get ${formatINR(companionShareOf(priceFor(h) ?? 0))})`).join(' · ')} />
          <Review
            label="Available"
            value={`${Object.entries(avail.days)
              .filter(([, on]) => on)
              .map(([d]) => d.slice(0, 3))
              .join(', ')} · ${avail.startTime}–${avail.endTime}`}
          />
          <IdLaterNotice />
          <Text variant="footnote" muted>
            By going live you agree to the <Brand /> Code of Conduct and Fellow Training Manual.
          </Text>
        </View>
      )}
    </Screen>
  );
}

function Steps({ current }: { current: number }) {
  return (
    <View style={styles.steps} accessibilityLabel={`Step ${current + 1} of ${STEPS.length}: ${STEPS[current].title}`}>
      {STEPS.map((s, i) => {
        const done = i < current;
        const on = i === current;
        return (
          <View key={s.title} style={styles.step}>
            <View style={[styles.num, (done || on) && styles.numOn]}>
              {done ? <Icon name="check" size={14} color={colors.onMoss} /> : <Text variant="caption" color={on ? colors.onMoss : colors.gray500}>{i + 1}</Text>}
            </View>
            {on ? (
              <View style={{ flex: 1 }}>
                <Text variant="headline">{s.title}</Text>
                <Text variant="caption" muted>
                  {s.sub}
                </Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function Review({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.review}>
      <Text variant="caption" muted>
        {label}
      </Text>
      <Text variant="callout">{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  steps: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginVertical: space.lg },
  step: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  num: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.mistDeep, alignItems: 'center', justifyContent: 'center' },
  numOn: { backgroundColor: colors.moss },
  form: { gap: space.lg },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  review: { gap: 2, paddingBottom: space.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
});
