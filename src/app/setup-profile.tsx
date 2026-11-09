import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { colors, space } from '@/theme/tokens';
import { Screen, Header, Avatar } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { IdentityForm, identityComplete, type IdentityValue } from '@/components/IdentityForm';
import { AreaPicker, CityPicker } from '@/components/PlacePicker';
import { svc } from '@/services';
import { errorMessage, type UploadFile } from '@/lib/api';
import { goHome } from '@/lib/flow';
import { pickImage } from '@/lib/pickImage';
import { stateOf, type Place } from '@/domain/places';
import { useSession } from '@/state/session';

/**
 * First run (and once for older accounts): name, gender, who to see, photo
 * visibility with explicit consent, city and area.
 */
export default function SetupProfile() {
  const user = useSession((s) => s.user);
  const updateUser = useSession((s) => s.updateUser);
  const isCompanion = user?.role === 'companion';
  const [name, setName] = useState(user?.fullName ?? '');
  const [place, setPlace] = useState<Place | null>(user?.city ? { city: user.city, state: stateOf(user.city) ?? '' } : null);
  const [area, setArea] = useState('');
  const [photo, setPhoto] = useState<UploadFile | null>(null);
  const [identity, setIdentity] = useState<IdentityValue>({ gender: user?.gender, seeGender: user?.seeGender, visibility: user?.profileVisibility, consent: !!user?.profileVisibility });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (name.trim().length < 2) return setError('Please enter your name.');
    if (!identityComplete(identity)) return setError('Choose your gender, who you want to see, and how your photo is shown — then tick the box to agree.');
    if (!place) return setError('Choose your city.');
    setBusy(true);
    setError(null);
    try {
      // /profile/update never changes verification status, so it is safe for both roles.
      await svc.updateProfile({ fullName: name.trim(), city: place.city, state: place.state, area: area.trim(), phoneNumber: user?.phone?.replace(/^91/, '') }, photo);
      await svc.updateIdentity({ gender: identity.gender, seeGender: identity.seeGender, profileVisibility: identity.visibility, visibilityConsent: identity.consent });
      await updateUser({ fullName: name.trim(), profilePhoto: photo?.uri ?? user?.profilePhoto, gender: identity.gender, seeGender: identity.seeGender, profileVisibility: identity.visibility, city: place.city });
      if (user?.phone && !user.hasPin) router.replace({ pathname: '/pin', params: { mode: 'set' } });
      else goHome();
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
          <Button label="Continue" onPress={save} loading={busy} />
        </View>
      }
    >
      <Header back={false} />
      <Text variant="title1">About you</Text>
      <Text variant="callout" muted style={{ marginTop: space.xs, marginBottom: space.xl }}>
        {isCompanion ? 'Members see your first name and, if you allow it, your photo.' : 'Companions see your first name and, if you allow it, your photo when you book.'}
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Add a profile photo" onPress={async () => setPhoto((await pickImage({ aspect: [1, 1] })) ?? photo)} style={styles.photo}>
        <Avatar uri={photo?.uri} name={name || '?'} size={96} />
        <View style={styles.cam}>
          <Icon name="camera" size={16} color={colors.onMoss} />
        </View>
      </Pressable>
      <View style={{ gap: space.xl }}>
        <TextField label="Full name" value={name} onChangeText={setName} textContentType="name" autoComplete="name" autoCapitalize="words" returnKeyType="next" />
        <IdentityForm value={identity} onChange={setIdentity} showSee={!isCompanion} role={isCompanion ? 'companion' : 'member'} />
        <View style={{ gap: space.lg }}>
          <CityPicker
            value={place}
            onChange={(p) => {
              setPlace(p);
              setArea('');
            }}
          />
          <AreaPicker city={place?.city} value={area} onChange={setArea} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: { alignSelf: 'center', marginBottom: space.xl },
  cam: { position: 'absolute', right: 0, bottom: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.mist },
});
