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
  const [form, setForm] = useState({ fullName: p?.fullName ?? '', city: p?.city ?? '', area: p?.area ?? '', description: p?.description ?? '', pricePerHour: p?.pricePerHour ? String(p.pricePerHour) : '' });
  const [photo, setPhoto] = useState<UploadFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isCompanion = p?.role === 'companion';

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    const price = Number(form.pricePerHour);
    if (isCompanion && (!price || price < 1 || price > 1000)) return setError('Hourly rate must be between ₹1 and ₹1,000.');
    setBusy(true);
    setError(null);
    try {
      await svc.updateProfile(
        {
          fullName: form.fullName.trim(),
          city: form.city.trim(),
          area: form.area.trim(),
          ...(isCompanion ? { description: form.description.trim(), pricePerHour: price } : {}),
        },
        photo,
      );
      await updateUser({ fullName: form.fullName.trim(), ...(photo ? { profilePhoto: photo.uri } : {}) });
      qc.invalidateQueries({ queryKey: qk.profile });
      router.back();
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
        <TextField label="Full name" value={form.fullName} onChangeText={set('fullName')} textContentType="name" autoCapitalize="words" />
        <TextField label="City" value={form.city} onChangeText={set('city')} />
        <TextField label="Area" value={form.area} onChangeText={set('area')} />
        {isCompanion ? (
          <>
            <TextField label="About you" value={form.description} onChangeText={set('description')} multiline maxLength={600} />
            <TextField label="Hourly rate" prefix="₹" value={form.pricePerHour} onChangeText={(t) => set('pricePerHour')(t.replace(/\D/g, ''))} keyboardType="number-pad" hint="Between ₹1 and ₹1,000 per hour." />
          </>
        ) : null}
        {p?.phoneNumber ? <TextField label="Mobile number" value={`+91 ${p.phoneNumber}`} editable={false} hint="Your number is never shown to other members." /> : null}
        {error ? (
          <Text variant="footnote" color={colors.danger}>
            {error}
          </Text>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: { alignSelf: 'center', marginVertical: space.lg },
  cam: { position: 'absolute', right: 0, bottom: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.mist },
});
