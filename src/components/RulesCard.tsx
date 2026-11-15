import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { colors, radius, space } from '@/theme/tokens';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { PressScale } from './ui/motion';

/** Home reminder of what prsnn is and isn't; opens the house rules. */
export function RulesCard({ style }: { style?: object }) {
  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel="Company, nothing more. Not dating, not errands, not therapy. Read the house rules."
      onPress={() => router.push('/rules')}
      style={style}
      innerStyle={styles.card}
    >
      <View style={styles.icon}>
        <Icon name="shieldCheck" size={20} color={colors.champagne} />
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text variant="headline" color={colors.porcelain}>
          Company. Nothing more.
        </Text>
        <Text variant="footnote" color="#C8CAD6">
          Not dating · not errands · not therapy. Respect, always.
        </Text>
      </View>
      <Text variant="footnote" color={colors.champagne} style={{ fontWeight: '700' }}>
        House rules
      </Text>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.xl, backgroundColor: colors.midnight },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(201,182,142,0.16)', alignItems: 'center', justifyContent: 'center' },
});
