import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useQueryClient } from '@tanstack/react-query';
import { colors, space } from '@/theme/tokens';
import { Screen, Header } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { Celebrate, Notice, useDraft } from '@/components/ui/states';
import { CategoryTiles } from '@/components/CategoryTiles';
import { svc } from '@/services';
import { errorMessage, type UploadFile } from '@/lib/api';
import { pickImage } from '@/lib/pickImage';
import { useSession } from '@/state/session';

/**
 * Opened from "Fix and resubmit" in the bell: shows what our team asked for,
 * lets the person change it, and sends it back for review.
 * target=photo → a new photo. target=profile (companions) → photo, bio, categories.
 */
export default function Fix() {
  const { target = 'photo' } = useLocalSearchParams<{ target?: 'photo' | 'profile' }>();
  const user = useSession((s) => s.user);
  const updateUser = useSession((s) => s.updateUser);
  const qc = useQueryClient();
  const isProfile = target === 'profile' && user?.role === 'companion';
  const note = isProfile ? user?.approvalNote ?? user?.photoNote : user?.photoNote ?? user?.approvalNote;
  const [photo, setPhoto] = useState<UploadFile | null>(null);
  const [d, setD, clearDraft] = useDraft(`fix.${user?.id}`, { description: '', categories: (user?.categories ?? []) as string[] });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const photoNeeded = !isProfile || user?.photoStatus === 'changes_requested';

  const send = async () => {
    if (photoNeeded && !photo) return setError('Add a new photo first.');
    if (isProfile && d.description && d.description.trim().length < 30) return setError('Write at least 30 characters about yourself, or leave it empty to keep your current text.');
    setBusy(true);
    setError(null);
    try {
      let fresh = await svc.saveProfile({ ...(isProfile ? { categories: d.categories, ...(d.description.trim() ? { description: d.description.trim() } : {}) } : {}) }, photo);
      if (isProfile) fresh = await svc.resubmitForReview();
      await updateUser({ ...fresh, hasPin: user?.hasPin });
      clearDraft();
      qc.invalidateQueries({ queryKey: ['me'] });
      setDone(true);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <Screen footer={<Button label={isProfile ? 'See my status' : 'Back to home'} onPress={() => router.replace(isProfile ? '/fellow/verification' : '/home')} />}>
        <Celebrate title="Sent for review" body="Thanks! Our team will look at it soon and let you know in your notifications." />
      </Screen>
    );
  }

  return (
    <Screen footer={<Button label="Send again for review" icon="send" onPress={send} loading={busy} haptic />}>
      <Header title={isProfile ? 'Update your profile' : 'Update your photo'} />
      <Notice tone="warning" text={note ? `Our team asked: “${note}”` : 'Our team asked you to update this.'} />

      {photoNeeded ? (
        <View style={{ alignItems: 'center', gap: space.md, marginVertical: space.xl }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={photo ? 'New photo added. Tap to change it.' : 'Add a new photo'}
            onPress={async () => {
              const p = await pickImage({ aspect: [1, 1] });
              if (p) {
                setPhoto(p);
                setError(null);
              }
            }}
          >
            {photo ? (
              <Image source={{ uri: photo.uri }} style={styles.photo} contentFit="cover" />
            ) : (
              <View style={[styles.photo, styles.empty]}>
                <Icon name="camera" size={30} color={colors.moss} />
                <Text variant="footnote" color={colors.moss}>
                  New photo
                </Text>
              </View>
            )}
          </Pressable>
          {['Daylight or a bright room', 'Face the camera, no sunglasses or filters', 'Just you in the photo'].map((t) => (
            <View key={t} style={styles.tick}>
              <Icon name="shieldCheck" size={16} color={colors.moss} />
              <Text variant="footnote">{t}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {isProfile ? (
        <View style={{ gap: space.lg, marginTop: space.lg }}>
          <TextField label="About you (optional — leave empty to keep it)" value={d.description} onChangeText={(v) => setD((c) => ({ ...c, description: v }))} multiline maxLength={600} placeholder="What do you enjoy? What kind of company are you?" />
          <Text variant="subhead">What you offer</Text>
          <CategoryTiles audience="companion" selected={d.categories} onToggle={(k) => setD((c) => ({ ...c, categories: c.categories.includes(k) ? c.categories.filter((x) => x !== k) : [...c.categories, k] }))} />
        </View>
      ) : null}

      {error ? (
        <Text variant="footnote" color={colors.danger} style={{ marginTop: space.md }} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: { width: 148, height: 148, borderRadius: 74 },
  empty: { backgroundColor: colors.paper, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.mossSoft, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tick: { flexDirection: 'row', alignItems: 'center', gap: space.sm, alignSelf: 'stretch' },
});
