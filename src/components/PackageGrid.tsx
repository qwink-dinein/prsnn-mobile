import { StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { colors, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { PressScale } from './ui/motion';
import { formatINR } from '@/domain/booking';
import { BASE_RATE, companionShareOf, durationLine, hourlyFor, hoursLabel, POPULAR_HOURS, priceFor, savingFor, savingPercent } from '@/domain/pricing';

type Props =
  | { mode: 'book'; hours: number[]; selected: number | null; onSelect: (h: number) => void }
  | { mode: 'offer'; hours: number[]; selected: number[]; onSelect: (h: number) => void };

/**
 * Price cards. Each one answers "how long, how much, is it good value?":
 * duration, the total, the hourly rate next to the ₹399 one-hour rate,
 * the saving (₹ and %), a value bar, and a short generic line about the time
 * (never an activity). 4 hours carries a "Suggested" ribbon — not "most
 * popular", until real data says so. Up to 6 hours sit in a 2-column grid;
 * longer ones are wide rows. In "offer" mode (companions) cards toggle and
 * show what they receive.
 */
export function PackageGrid(props: Props) {
  const { hours, mode } = props;
  const isOn = (h: number) => (mode === 'book' ? props.selected === h : props.selected.includes(h));
  const grid = hours.filter((h) => h <= 6);
  const long = hours.filter((h) => h > 6);
  const pairs: number[][] = [];
  for (let i = 0; i < grid.length; i += 2) pairs.push(grid.slice(i, i + 2));
  return (
    <View style={{ gap: space.sm }} accessibilityRole={mode === 'book' ? 'radiogroup' : 'list'}>
      {pairs.map((row) => (
        <View key={row.join('-')} style={styles.row}>
          {row.map((h) => (
            <PackageCard key={h} h={h} on={isOn(h)} mode={mode} onPress={() => props.onSelect(h)} />
          ))}
          {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      ))}
      {long.map((h) => (
        <PackageRow key={h} h={h} on={isOn(h)} mode={mode} onPress={() => props.onSelect(h)} />
      ))}
    </View>
  );
}

const a11y = (h: number, mode: 'book' | 'offer') => {
  const price = priceFor(h) ?? 0;
  const save = savingFor(h);
  return `${hoursLabel(h)}, ${formatINR(price)}, ${formatINR(hourlyFor(h))} an hour${save ? `, you save ${formatINR(save)}` : ''}${mode === 'offer' ? `, you get ${formatINR(companionShareOf(price))}` : ''}${h === POPULAR_HOURS && mode === 'book' ? ', suggested' : ''}. ${durationLine(h)}`;
};

function Tick({ on }: { on: boolean }) {
  return <View style={[styles.tick, on && styles.tickOn]}>{on ? <Icon name="check" size={12} color={colors.onMoss} strokeWidth={3} /> : null}</View>;
}

function Ribbon() {
  const reduced = useReducedMotion();
  return (
    <Animated.View style={[styles.ribbon, reduced ? null : { animationName: GLOW, animationDuration: 2400, animationIterationCount: 'infinite', animationDirection: 'alternate' }]}>
      <Text variant="caption" color={colors.onMoss} style={styles.ribbonText}>
        SUGGESTED
      </Text>
    </Animated.View>
  );
}
const GLOW = { from: { opacity: 1 }, to: { opacity: 0.82 } };

function PackageCard({ h, on, mode, onPress }: { h: number; on: boolean; mode: 'book' | 'offer'; onPress: () => void }) {
  const price = priceFor(h) ?? 0;
  const save = savingFor(h);
  const pct = savingPercent(h);
  return (
    <PressScale
      accessibilityRole={mode === 'book' ? 'radio' : 'checkbox'}
      accessibilityState={{ checked: on }}
      accessibilityLabel={a11y(h, mode)}
      onPress={onPress}
      scaleTo={0.97}
      style={styles.cell}
      innerStyle={[styles.card, on && styles.cardOn]}
    >
      {h === POPULAR_HOURS && mode === 'book' ? <Ribbon /> : null}
      <View style={styles.head}>
        <Text style={styles.dur}>
          {h}
          <Text style={styles.unit}>{h === 1 ? ' hr' : ' hrs'}</Text>
        </Text>
        <Tick on={on} />
      </View>
      <Text style={styles.price}>{formatINR(price)}</Text>
      {mode === 'offer' ? (
        <View style={styles.get}>
          <Text variant="caption" color={colors.moss}>
            You get <Text variant="caption" color={colors.moss} style={{ fontFamily: fonts.semibold }}>{formatINR(companionShareOf(price))}</Text>
          </Text>
        </View>
      ) : (
        <>
          <Text variant="caption" color={colors.gray500}>
            {formatINR(hourlyFor(h))}/hr{h > 1 ? <Text variant="caption" color={colors.gray400} style={{ textDecorationLine: 'line-through' }}>{`  ${formatINR(BASE_RATE)}`}</Text> : null}
          </Text>
          <View style={[styles.save, !save && styles.saveNeutral]}>
            <Text variant="caption" color={save ? colors.moss : colors.gray600} style={{ fontFamily: fonts.semibold }}>
              {save ? `Save ${formatINR(save)} (${pct}%)` : 'Try it out'}
            </Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.max(12, Math.min(100, pct * 4))}%` }]} />
          </View>
        </>
      )}
      <Text variant="caption" color={colors.gray600} style={{ marginTop: 6 }} numberOfLines={2}>
        {durationLine(h)}
      </Text>
    </PressScale>
  );
}

function PackageRow({ h, on, mode, onPress }: { h: number; on: boolean; mode: 'book' | 'offer'; onPress: () => void }) {
  const price = priceFor(h) ?? 0;
  const pct = savingPercent(h);
  return (
    <PressScale
      accessibilityRole={mode === 'book' ? 'radio' : 'checkbox'}
      accessibilityState={{ checked: on }}
      accessibilityLabel={a11y(h, mode)}
      onPress={onPress}
      scaleTo={0.98}
      innerStyle={[styles.card, styles.wide, on && styles.cardOn]}
    >
      <Text style={[styles.dur, { minWidth: 56 }]}>
        {h}
        <Text style={styles.unit}> hrs</Text>
      </Text>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.price, { fontSize: 18, lineHeight: 24, marginTop: 0 }]}>
          {formatINR(price)} <Text variant="caption" color={colors.gray500}>{mode === 'offer' ? `you get ${formatINR(companionShareOf(price))}` : `${formatINR(hourlyFor(h))}/hr`}</Text>
        </Text>
        <Text variant="caption" color={colors.gray600}>
          {durationLine(h)}
        </Text>
      </View>
      {mode === 'book' && pct ? (
        <View style={styles.save}>
          <Text variant="caption" color={colors.moss} style={{ fontFamily: fonts.semibold }}>
            −{pct}%
          </Text>
        </View>
      ) : null}
      <Tick on={on} />
    </PressScale>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm },
  cell: { flex: 1 },
  card: {
    padding: space.md,
    paddingTop: space.md + 2,
    borderRadius: radius.lg,
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.line,
    transitionProperty: ['borderColor', 'backgroundColor', 'transform'],
    transitionDuration: 160,
  } as object,
  cardOn: { borderWidth: 2, borderColor: colors.moss, backgroundColor: colors.green50 },
  wide: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dur: { fontFamily: fonts.display, fontSize: 26, lineHeight: 30, color: colors.ink },
  unit: { fontFamily: fonts.body, fontSize: 12, color: colors.gray500 },
  price: { fontFamily: fonts.semibold, fontSize: 21, lineHeight: 27, color: colors.ink, marginTop: 6 },
  save: { alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill, backgroundColor: colors.mossSoft },
  saveNeutral: { backgroundColor: colors.mistDeep },
  track: { height: 4, borderRadius: 2, backgroundColor: colors.mistDeep, marginTop: 8, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2, backgroundColor: colors.moss },
  get: { alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.sm, backgroundColor: colors.green50, borderWidth: 1, borderColor: colors.mossSoft },
  tick: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.gray300, alignItems: 'center', justifyContent: 'center' },
  tickOn: { backgroundColor: colors.moss, borderColor: colors.moss },
  ribbon: { position: 'absolute', top: -10, right: 10, zIndex: 2, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, backgroundColor: colors.clay },
  ribbonText: { fontFamily: fonts.semibold, fontSize: 10, letterSpacing: 0.6 },
});
