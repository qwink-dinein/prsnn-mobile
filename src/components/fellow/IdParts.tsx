import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { colors, radius, space } from '@/theme/tokens';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import type { UploadFile } from '@/lib/api';
import { pickImage } from '@/lib/pickImage';

/** Photo picker row used by companion sign-up and the ID check. */
export function Upload({ label, file, onPick, square, camera }: { label: string; file: UploadFile | null; onPick: (f: UploadFile | null) => void; square?: boolean; camera?: boolean }) {
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

/** Tells new companions an ID will be needed, without asking for it now. */
export function IdLaterNotice() {
  return (
    <View style={styles.notice} accessible accessibilityLabel="Before your first booking: we will ask for a photo ID and a selfie. It is encrypted, stored privately and seen only by our safety team.">
      <View style={styles.noticeHead}>
        <Icon name="shieldCheck" size={22} color={colors.moss} />
        <Text variant="headline" style={{ flex: 1 }}>
          One thing before your first booking
        </Text>
      </View>
      <Text variant="callout">When your first booking arrives, we’ll ask for a photo ID and a selfie. Nothing to upload now.</Text>
      <Text variant="footnote" muted>
        It keeps everyone safe: members know you’re a real person, and every member is verified too.
      </Text>
      {['Encrypted and stored privately', 'Seen only by our safety team, never by members', 'Aadhaar, PAN, driving licence, passport or voter ID', 'Takes about 2 minutes'].map((t) => (
        <View key={t} style={styles.noticeRow}>
          <Icon name="check" size={16} color={colors.moss} />
          <Text variant="footnote">{t}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  upload: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 72, padding: space.md, borderRadius: radius.lg, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.gray300, backgroundColor: colors.paper },
  uploadDone: { borderStyle: 'solid', borderColor: colors.mossSoft },
  thumb: { width: 48, height: 48, borderRadius: radius.sm },
  notice: { gap: space.sm, padding: space.lg, borderRadius: radius.lg, backgroundColor: colors.green50, borderWidth: 1, borderColor: colors.mossSoft },
  noticeHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  noticeRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
});
