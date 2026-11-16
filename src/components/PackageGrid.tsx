import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { formatINR } from '@/domain/booking';
import { companionShareOf, hourlyFor, hoursLabel, POPULAR_HOURS, priceFor, savingFor } from '@/domain/pricing';

type Props =
  | { mode: 'book'; hours: number[]; selected: number | null; onSelect: (h: number) => void }
  | { mode: 'offer'; hours: number[]; selected: number[]; onSelect: (h: number) => void };

/** "Suggested" on 4 hours (not "most popular" until real data says so); "Best value" on the lowest hourly rate. */
function tagFor(h: number, hours: number[]): string | null {
  if (h === POPULAR_HOURS) return 'Suggested';
  const best = hours.reduce((b, x) => (hourlyFor(x) < hourlyFor(b) ? x : b), hours[0]);
  return h === best && hours.length > 1 && savingFor(h) > 0 ? 'Best value' : null;
}

const a11y = (h: number, mode: 'book' | 'offer') => {
  const price = priceFor(h) ?? 0;
  const save = savingFor(h);
  return `${hoursLabel(h)}, ${formatINR(price)}, ${formatINR(hourlyFor(h))} an hour${save ? `, you save ${formatINR(save)}` : ''}${mode === 'offer' ? `, you get ${formatINR(companionShareOf(price))}` : ''}.`;
};

/**
 * Durations and prices as plain cards, three to a row: hours, total price, price per hour. One look
 * shows every option, and the chosen one is filled in (the same style as the chosen day and time).
 * Members pick one; companions tick every length they offer and see what they get.
 */
export function PackageGrid(props: Props) {
  const { hours, mode } = props;
  const isOn = (h: number) => (mode === 'offer' ? props.selected.includes(h) : props.selected === h);
  return (
    <View style={styles.grid} accessibilityRole={mode === 'book' ? 'radiogroup' : 'list'}>
      {hours.map((h) => {
        const on = isOn(h);
        const price = priceFor(h) ?? 0;
        const tag = mode === 'book' ? tagFor(h, hours) : null;
        const fg = on ? colors.onMoss : colors.ink;
        return (
          <Pressable
            key={h}
            accessibilityRole={mode === 'book' ? 'radio' : 'checkbox'}
            accessibilityState={{ checked: on }}
            accessibilityLabel={a11y(h, mode)}
            onPress={() => props.onSelect(h)}
            style={({ pressed }) => [styles.card, on && styles.cardOn, pressed && { opacity: 0.85 }]}
          >
            <View style={styles.top}>
              <Text variant="subhead" color={fg} style={{ fontFamily: fonts.semibold }}>
                {hoursLabel(h)}
              </Text>
              {mode === 'offer' ? (
                <View style={[styles.tick, on ? styles.tickOn : null]}>{on ? <Icon name="check" size={11} color={colors.moss} strokeWidth={3} /> : null}</View>
              ) : null}
            </View>
            <Text style={[styles.price, { color: fg }]} numberOfLines={1} adjustsFontSizeToFit>
              {mode === 'offer' ? formatINR(companionShareOf(price)) : formatINR(price)}
            </Text>
            <Text variant="caption" color={on ? colors.onMoss : colors.gray500} numberOfLines={1} style={on ? { opacity: 0.85 } : undefined}>
              {mode === 'offer' ? 'you get' : `${formatINR(hourlyFor(h))}/hr`}
            </Text>
            {tag ? (
              <Text variant="caption" color={on ? colors.champagne : colors.champagneDeep} numberOfLines={1} style={{ fontFamily: fonts.semibold, marginTop: 2 }}>
                {tag}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  card: {
    flexBasis: '31%',
    flexGrow: 1,
    minHeight: 84,
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 2,
  },
  cardOn: { backgroundColor: colors.moss, borderColor: colors.moss },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  price: { fontFamily: fonts.number, fontSize: 20, letterSpacing: -0.4, marginTop: 2 },
  tick: { width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: colors.gray300, alignItems: 'center', justifyContent: 'center' },
  tickOn: { backgroundColor: colors.onMoss, borderColor: colors.onMoss },
});
