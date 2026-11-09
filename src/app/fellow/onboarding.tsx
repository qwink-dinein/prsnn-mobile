import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useQueryClient } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header, Chip } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { AvailabilityEditor, emptyAvailability, type AvailabilityValue } from '@/components/fellow/AvailabilityEditor';
import { CATEGORIES } from '@/domain/booking';
import { svc, qk } from '@/services';
import { errorMessage, type UploadFile } from '@/lib/api';
import { pickImage } from '@/lib/pickImage';
import { useSession } from '@/state/session';

const STEPS: { title: string; sub: string; icon: IconName }[] = [
  { title: 'Basic information', sub: 'Name, area, about you', icon: 'user' },
  { title: 'Identity verification', sub: 'Government ID, front and back', icon: 'idCard' },
  { title: 'Photos', sub: 'A clear photo of your face', icon: 'camera' },
  { title: 'Rates & availability', sub: 'Your price, days and hours', icon: 'clock' },
  { title: 'Go live', sub: 'Review and submit', icon: 'sparkle' },
];

const EXTRA_TAGS = ['Hindi', 'Urdu', 'Telugu', 'English', 'Books', 'Movies', 'Music', 'Cricket', 'Yoga', 'Shopping'];

/** Screen 18 · Companion onboarding (multi-step) → POST /profile/onboard-companion. */
export default function CompanionOnboarding() {
  const user = useSession((s) => s.user);
  const updateUser = useSession((s) => s.updateUser);
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [basic, setBasic] = useState({ fullName: user?.fullName ?? '', city: 'Hyderabad', area: '', description: '' });
  const [tags, setTags] = useState<string[]>([]);
  const [idFront, setIdFront] = useState<UploadFile | null>(null);
  const [idBack, setIdBack] = useState<UploadFile | null>(null);
  const [photo, setPhoto] = useState<UploadFile | null>(null);
  const [selfie, setSelfie] = useState<UploadFile | null>(null);
  const [price, setPrice] = useState('500');
  const [avail, setAvail] = useState<AvailabilityValue>(emptyAvailability());
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const toggleTag = (t: string) => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const validate = (s: number): string | null => {
    if (s === 0) {
      if (basic.fullName.trim().length < 2) return 'Please enter your full name.';
      if (!basic.area.trim()) return 'Add the area you’re based in.';
      if (basic.description.trim().length < 30) return 'Write at least a couple of sentences about yourself (30+ characters).';
      if (!tags.length) return 'Pick at least one thing you enjoy doing.';
    }
    if (s === 1 && (!idFront || !idBack)) return 'Add both sides of your ID.';
    if (s === 2 && !photo) return 'Add a profile photo.';
    if (s === 3) {
      const p = Number(price);
      if (!p || p < 1 || p > 1000) return 'Hourly rate must be between ₹1 and ₹1,000.';
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
        city: basic.city.trim(),
        area: basic.area.trim(),
        description: basic.description.trim(),
        pricePerHour: Number(price),
        startTime: avail.startTime,
        endTime: avail.endTime,
        tags,
        days: avail.days,
        profilePhoto: photo,
        idProofFront: idFront,
        idProofBack: idBack,
        backupPhoto: selfie,
      });
      await updateUser({ role: 'companion', verification_status: 'pending', is_verified: false, fullName: basic.fullName.trim(), profilePhoto: photo?.uri });
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
          <Button label={step === STEPS.length - 1 ? 'Submit for verification' : 'Continue'} onPress={next} loading={busy} />
        </View>
      }
    >
      <Header title="Complete your profile" onBack={() => (step ? (setError(null), setStep(step - 1)) : router.back())} />
      <Steps current={step} />

      {step === 0 ? (
        <View style={styles.form}>
          <TextField label="Full name" value={basic.fullName} onChangeText={(v) => setBasic({ ...basic, fullName: v })} autoCapitalize="words" textContentType="name" />
          <TextField label="City" value={basic.city} onChangeText={(v) => setBasic({ ...basic, city: v })} />
          <TextField label="Area" value={basic.area} onChangeText={(v) => setBasic({ ...basic, area: v })} placeholder="e.g. Jubilee Hills" />
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
            Aadhaar, PAN, driving licence or passport. Only the prsnn verification team sees these, never other members.
          </Text>
          <Upload label="Front of ID" file={idFront} onPick={setIdFront} />
          <Upload label="Back of ID" file={idBack} onPick={setIdBack} />
        </View>
      ) : step === 2 ? (
        <View style={styles.form}>
          <Text variant="callout" muted>
            A recent, well-lit photo of your face. This is what members see first.
          </Text>
          <Upload label="Profile photo" file={photo} onPick={setPhoto} square />
          <Upload label="Selfie for verification (optional)" file={selfie} onPick={setSelfie} camera square />
        </View>
      ) : step === 3 ? (
        <View style={styles.form}>
          <TextField label="Hourly rate" prefix="₹" value={price} onChangeText={(t) => setPrice(t.replace(/\D/g, ''))} keyboardType="number-pad" hint="Between ₹1 and ₹1,000 per hour. You can change it later." />
          <AvailabilityEditor value={avail} onChange={setAvail} />
        </View>
      ) : (
        <View style={styles.form}>
          <Review label="Name" value={`${basic.fullName} · ${basic.area}, ${basic.city}`} />
          <Review label="Enjoys" value={tags.join(', ')} />
          <Review label="Rate" value={`₹${price} per hour`} />
          <Review
            label="Available"
            value={`${Object.entries(avail.days)
              .filter(([, on]) => on)
              .map(([d]) => d.slice(0, 3))
              .join(', ')} · ${avail.startTime}–${avail.endTime}`}
          />
          <Review label="Documents" value={`ID front ✓  ID back ✓  Photo ✓${selfie ? '  Selfie ✓' : ''}`} />
          <Text variant="footnote" muted>
            By submitting you agree to the prsnn Code of Conduct and Fellow Training Manual. We review applications within 24–48 hours.
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

function Upload({ label, file, onPick, square, camera }: { label: string; file: UploadFile | null; onPick: (f: UploadFile | null) => void; square?: boolean; camera?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={file ? `${label}, added. Tap to replace.` : `Add ${label}`}
      onPress={async () => {
        const f = await pickImage({ camera, aspect: square ? [1, 1] : undefined });
        if (f) onPick(f);
      }}
      style={[styles.upload, file && styles.uploadDone]}
    >
      {file ? <Image source={{ uri: file.uri }} style={styles.thumb} contentFit="cover" /> : <Icon name={camera ? 'camera' : 'image'} size={24} color={colors.moss} />}
      <View style={{ flex: 1 }}>
        <Text variant="callout">{label}</Text>
        <Text variant="caption" muted>
          {file ? 'Added · tap to replace' : camera ? 'Take a photo' : 'Choose from your photos'}
        </Text>
      </View>
      <Icon name={file ? 'check' : 'plus'} size={20} color={colors.moss} />
    </Pressable>
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
  upload: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 72, padding: space.md, borderRadius: radius.lg, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.gray300, backgroundColor: colors.paper },
  uploadDone: { borderStyle: 'solid', borderColor: colors.mossSoft },
  thumb: { width: 48, height: 48, borderRadius: radius.sm },
  review: { gap: 2, paddingBottom: space.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
});
