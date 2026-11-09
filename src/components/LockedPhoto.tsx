import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/theme/tokens';
import { Icon } from './ui/Icon';

const PLACEHOLDER = require('../../assets/images/locked.jpg');

/**
 * Static blurred placeholder with a lock, shown instead of a locked person's
 * photo. It is NOT a blurred copy of their real photo: nothing of the real
 * face ever reaches the device until they unlock it.
 */
export function LockedPhoto({ style, size = 'md', rounded }: { style?: StyleProp<ViewStyle>; size?: 'sm' | 'md' | 'lg'; rounded?: boolean }) {
  const badge = size === 'sm' ? 18 : size === 'lg' ? 52 : 34;
  return (
    <View style={[style, rounded && { borderRadius: 999 }, { overflow: 'hidden' }]} accessibilityLabel="Photo locked by this person" accessibilityRole="image">
      <Image source={PLACEHOLDER} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View style={styles.center}>
        <View style={[styles.badge, { width: badge, height: badge, borderRadius: badge / 2 }]}>
          <Icon name="lock" size={Math.round(badge * 0.5)} color={colors.moss} strokeWidth={2} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  badge: { backgroundColor: 'rgba(250,249,246,0.92)', alignItems: 'center', justifyContent: 'center' },
});
