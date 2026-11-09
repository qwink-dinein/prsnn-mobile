import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { colors, space } from '@/theme/tokens';
import { Screen, Header, Avatar } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { svc } from '@/services';
import { errorMessage, type UploadFile } from '@/lib/api';
import { goHome } from '@/lib/flow';
import { pickImage } from '@/lib/pickImage';
import { useSession } from '@/state/session';

/** First-run profile basics so companions know who is booking them. */
export default function SetupProfile() {
  const user = useSession((s) => s.user);
  const updateUser = useSession((s) => s.updateUser);
  const [name, setName] = useState(user?.fullName ?? '');
  const [city, setCity] = useState('Hyderabad');
  const [area, setArea] = useState('');
  const [photo, setPhoto] = useState<UploadFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (name.trim().length < 2) return setError('Please enter your name.');
    setBusy(true);
    setError(null);
    try {
      // /profile/update never changes verification status, so it is safe for both roles.
      await svc.updateProfile({ fullName: name.trim(), city: city.trim(), area: area.trim(), phoneNumber: user?.phone?.replace(/^91/, '') }, photo);
      await updateUser({ fullName: name.trim(), profilePhoto: photo?.uri ?? user?.profilePhoto });
      if (user?.phone && !user.hasPin) router.replace({ pathname: '/pin', params: { mode: 'set' } });
      else goHome();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen footer={<Button label="Continue" onPress={save} loading={busy} />}>
      <Header back={false} />
      <Text variant="title1">About you</Text>
      <Text variant="callout" muted style={{ marginTop: space.xs, marginBottom: space.xl }}>
        Companions see your first name and photo when you send a request.
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Add a profile photo" onPress={async () => setPhoto((await pickImage({ aspect: [1, 1] })) ?? photo)} style={styles.photo}>
        <Avatar uri={photo?.uri} name={name || '?'} size={96} />
        <View style={styles.cam}>
          <Icon name="camera" size={16} color={colors.onMoss} />
        </View>
      </Pressable>
      <View style={{ gap: space.lg }}>
        <TextField label="Full name" value={name} onChangeText={setName} textContentType="name" autoComplete="name" autoCapitalize="words" returnKeyType="next" />
        <TextField label="City" value={city} onChangeText={setCity} textContentType="addressCity" />
        <TextField label="Area" value={area} onChangeText={setArea} placeholder="e.g. Banjara Hills" error={error} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: { alignSelf: 'center', marginBottom: space.xl },
  cam: { position: 'absolute', right: 0, bottom: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.mist },
});
