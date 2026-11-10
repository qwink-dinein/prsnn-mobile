import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, space } from '@/theme/tokens';
import { Screen, Header, Avatar, Loading } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { svc, qk } from '@/services';
import { errorMessage, type UploadFile } from '@/lib/api';
import type { Profile } from '@/domain/types';
import { pickImage } from '@/lib/pickImage';
import { LocationFields, type LocationValue } from '@/components/LocationFields';
import { CategoryTiles } from '@/components/CategoryTiles';
import { Notice } from '@/components/ui/states';
import { stateOf } from '@/domain/places';
import { useSession } from '@/state/session';

/** Personal information. Companions also edit their bio and hourly rate here. */
export default function EditProfile() {
  const q = useQuery({ queryKey: qk.profile, queryFn: svc.profile });
  if (q.isLoading) return <Loading />;
  return <EditForm p={q.data} />;
}

function EditForm({ p }: { p?: Profile }) {
  const qc = useQueryClient();
  const updateUser = useSession((s) => s.updateUser);
  const user = useSession((s) => s.user);
  const [form, setForm] = useState({ fullName: p?.fullName ?? '', description: p?.description ?? '', categories: (user?.categories ?? []) as string[] });
  const [place, setPlace] = useState<LocationValue>({ state: p?.state ?? stateOf(p?.city) ?? '', city: p?.city ?? '', area: p?.area ?? '' });
  const [done, setDone] = useState(false);
  const [photo, setPhoto] = useState<UploadFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isCompanion = p?.role === 'companion';

  const set = (k: 'fullName' | 'description') => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const nameError = form.fullName.trim().length < 2 ? 'Please enter your name.' : null;

  const save = async () => {
    if (nameError) return setError(nameError);
    setBusy(true);
    setError(null);
    try {
      const fresh = await svc.saveProfile(
        {
          fullName: form.fullName.trim(),
          state: place.state,
          city: place.city,
          area: place.area,
          ...(form.categories.length ? { categories: form.categories } : {}),
          ...(isCompanion ? { description: form.description.trim() } : {}),
        },
        photo,
      );
      await updateUser({ ...fresh, hasPin: user?.hasPin });
      qc.invalidateQueries({ queryKey: qk.profile });
      qc.invalidateQueries({ queryKey: qk.companions });
      setDone(true);
      setTimeout(() => router.back(), 900);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen footer={<Button label="Save" onPress={save} loading={busy} />}>
      <Header title="Personal information" />
      <Pressable accessibilityRole="button" accessibilityLabel="Change profile photo" onPress={async () => setPhoto((await pickImage({ aspect: [1, 1] })) ?? photo)} style={styles.photo}>
        <Avatar uri={photo?.uri ?? p?.profilePhotoUrl} name={form.fullName} size={96} />
        <View style={styles.cam}>
          <Icon name="camera" size={16} color={colors.onMoss} />
        </View>
      </Pressable>
      <View style={{ gap: space.lg }}>
        <TextField label="Full name" value={form.fullName} onChangeText={set('fullName')} textContentType="name" autoCapitalize="words" error={nameError} />
        <LocationFields value={place} onChange={setPlace} />
        <Text variant="subhead">{isCompanion ? 'What you offer' : 'What you’re interested in'}</Text>
        <CategoryTiles audience={isCompanion ? 'companion' : 'member'} selected={form.categories} onToggle={(k) => setForm((f) => ({ ...f, categories: f.categories.includes(k) ? f.categories.filter((x) => x !== k) : [...f.categories, k] }))} />
        {isCompanion ? (
          <>
            <TextField label="About you" value={form.description} onChangeText={set('description')} multiline maxLength={600} />
            <Text variant="footnote" muted>
              Prices are the same for every companion. Choose which durations you offer in Profile → Packages & availability.
            </Text>
          </>
        ) : null}
        {p?.phoneNumber ? <TextField label="Mobile number" value={`+91 ${p.phoneNumber}`} editable={false} hint="Your number is never shown to other members." /> : null}
        {photo ? <Notice text="A new photo is reviewed by our team before others see it." /> : null}
        {error ? <Notice tone="danger" text={`${error} Nothing was lost — try again.`} /> : null}
        {done ? <Notice tone="success" text="Saved." /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: { alignSelf: 'center', marginVertical: space.lg },
  cam: { position: 'absolute', right: 0, bottom: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.mist },
});
