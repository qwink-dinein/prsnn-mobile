import { useCallback, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '@/theme/tokens';
import type { Visibility } from '@/domain/types';
import { Text } from './ui/Text';
import { Icon, type IconName } from './ui/Icon';
import { Button } from './ui/Button';

const POINTS: { icon: IconName; text: string }[] = [
  { icon: 'star', text: 'Shown higher in search and on Home' },
  { icon: 'shieldCheck', text: 'Still safe: your number and home are never shown, and everyone is ID-checked' },
  { icon: 'settings', text: 'Change it any time in Profile → Privacy' },
];

/**
 * Picking "Locked" first shows why an open photo is better, with "Keep my photo
 * visible" as the main button and "Lock it anyway" always there. Use:
 *   const nudge = usePhotoNudge();
 *   onPick={(v) => nudge.pick(v, apply)}   …   {nudge.sheet}
 * `apply` runs with the final choice (only once, and only if the person picks).
 */
export function usePhotoNudge() {
  const [open, setOpen] = useState(false);
  const pending = useRef<((v: Visibility) => void) | null>(null);

  const pick = useCallback((v: Visibility, apply: (v: Visibility) => void) => {
    if (v !== 'locked') return apply(v);
    pending.current = apply;
    setOpen(true);
  }, []);

  const finish = (v: Visibility | null) => {
    const apply = pending.current;
    pending.current = null;
    setOpen(false);
    if (v && apply) apply(v);
  };

  const sheet = <PhotoNudgeSheet visible={open} onKeepOpen={() => finish('open')} onLock={() => finish('locked')} onClose={() => finish(null)} />;
  return { pick, sheet };
}

export function PhotoNudgeSheet({ visible, onKeepOpen, onLock, onClose }: { visible: boolean; onKeepOpen: () => void; onLock: () => void; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <View style={[styles.sheet, { paddingBottom: space.xl + insets.bottom }]} accessibilityViewIsModal>
        <View style={styles.handle} />
        <View style={styles.hero} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={styles.lockWell}>
            <Icon name="lock" size={22} color={colors.gray500} />
          </View>
          <Icon name="arrowRight" size={22} color={colors.champagne} />
          <View style={styles.eyeWell}>
            <Icon name="eye" size={26} color={colors.midnight} />
          </View>
        </View>
        <View style={{ gap: space.sm }}>
          <Text variant="title2" style={styles.center} accessibilityRole="header">
            Public photos get more bookings
          </Text>
          <Text variant="callout" muted style={styles.center}>
            A visible photo builds trust before the first hello. Open profiles get more views and more bookings.
          </Text>
        </View>
        <View style={styles.points}>
          {POINTS.map((p) => (
            <View key={p.text} style={styles.point}>
              <Icon name={p.icon} size={18} color={colors.champagneDeep} />
              <Text variant="subhead" style={{ flex: 1 }}>
                {p.text}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ gap: space.xs }}>
          <Button label="Keep my photo visible" onPress={onKeepOpen} haptic />
          <Button label="Lock it anyway" variant="ghost" onPress={onLock} accessibilityHint="Only people you’ve booked with will see your photo" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(24,27,52,0.55)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '92%', backgroundColor: colors.paper, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: space.xl, paddingTop: space.md, gap: space.lg },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.gray200 },
  hero: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.md },
  lockWell: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.mistCard, alignItems: 'center', justifyContent: 'center' },
  eyeWell: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.champagneMist, borderWidth: 2.5, borderColor: colors.champagne, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
  points: { gap: space.md, backgroundColor: colors.champagneMist, borderRadius: 16, padding: space.lg },
  point: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md },
});
