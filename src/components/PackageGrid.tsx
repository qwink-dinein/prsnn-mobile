import { StyleSheet, View } from 'react-native';
import { colors, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { PressScale } from './ui/motion';
import { formatINR } from '@/domain/booking';
import { companionShareOf, hourlyFor, hoursLabel, POPULAR_HOURS, priceFor, savingFor } from '@/domain/pricing';

type Props =
  | { mode: 'book'; hours: number[]; selected: number | null; onSelect: (h: number) => void }
  | { mode: 'offer'; hours: number[]; selected: number[]; onSelect: (h: number) => void };

/**
 * "Choose your time" price cards (owner's design):
 * total is the most prominent line, hourly rate under it so people can
 * compare value, "Save ₹X" in prsnn green, 4 hours flagged "Popular choice",
 * the selected card gets a green border and a subtle highlight.
 * In "offer" mode (companion registration) cards toggle on/off and also show
 * what the companion receives after prsnn's 20%.
 */
export function PackageGrid(props: Props) {
  const { hours, mode } = props;
  const isOn = (h: number) => (mode === 'book' ? props.selected === h : props.selected.includes(h));
  // Two columns; an odd one out (e.g. 12 hours) gets a full-width row.
  const pairs: number[][] = [];
  for (let i = 0; i < hours.length; i += 2) pairs.push(hours.slice(i, i + 2));

  return (
    <View style={{ gap: space.sm }} accessibilityRole={mode === 'book' ? 'radiogroup' : undefined}>
      {pairs.map((row) =>
        row.length === 2 ? (
          <View key={row.join('-')} style={styles.row}>
            {row.map((h) => (
              <PackageCard key={h} h={h} on={isOn(h)} mode={mode} onPress={() => props.onSelect(h)} />
            ))}
          </View>
        ) : (
          <PackageCard key={row[0]} h={row[0]} on={isOn(row[0])} mode={mode} onPress={() => props.onSelect(row[0])} wide />
        ),
      )}
    </View>
  );
}

function PackageCard({ h, on, mode, onPress, wide }: { h: number; on: boolean; mode: 'book' | 'offer'; onPress: () => void; wide?: boolean }) {
  const price = priceFor(h) ?? 0;
  const save = savingFor(h);
  const popular = h === POPULAR_HOURS;
  const share = companionShareOf(price);
  const label = `${hoursLabel(h)}, ${formatINR(price)}, ${formatINR(hourlyFor(h))} per hour${save ? `, save ${formatINR(save)}` : ''}${mode === 'offer' ? `, you get ${formatINR(share)}` : ''}${popular ? ', popular choice' : ''}`;

  const details = (
    <>
      <Text variant="caption" color={colors.gray500} style={styles.hourly}>
        {formatINR(hourlyFor(h))}/hour{h >= 12 ? ' approx.' : ''}
      </Text>
      {save ? (
        <Text variant="caption" color={colors.moss} style={styles.save}>
          Save {formatINR(save)}
        </Text>
      ) : null}
      {mode === 'offer' ? (
        <Text variant="caption" color={colors.gray600} style={{ marginTop: 4 }}>
          You get <Text variant="caption" style={{ fontFamily: fonts.semibold }}>{formatINR(share)}</Text>
        </Text>
      ) : null}
    </>
  );

  return (
    <PressScale
      accessibilityRole={mode === 'book' ? 'radio' : 'checkbox'}
      accessibilityState={mode === 'book' ? { checked: on } : { checked: on }}
      accessibilityLabel={label}
      onPress={onPress}
      scaleTo={0.98}
      style={wide ? styles.wideOuter : styles.cell}
      innerStyle={[styles.card, wide && styles.wide, on && styles.cardOn]}
    >
      {wide ? (
        <>
          <View style={{ flex: 1, gap: 2 }}>
            <Head h={h} popular={popular} on={on} mode={mode} />
            {details}
          </View>
          <Text style={styles.price}>{formatINR(price)}</Text>
        </>
      ) : (
        <View style={{ gap: 2 }}>
          <Head h={h} popular={popular} on={on} mode={mode} />
          <Text style={styles.price}>{formatINR(price)}</Text>
          {details}
        </View>
      )}
    </PressScale>
  );
}

function Head({ h, popular, on, mode }: { h: number; popular: boolean; on: boolean; mode: 'book' | 'offer' }) {
  return (
    <View style={{ gap: 6 }}>
      {popular ? (
        <View style={styles.popular}>
          <Text variant="caption" color={colors.moss}>
            Popular choice
          </Text>
        </View>
      ) : null}
      <View style={styles.headRow}>
        <Text variant="callout" style={{ flex: 1 }}>
          {hoursLabel(h)}
        </Text>
        {mode === 'offer' ? (
          <View style={[styles.tick, on && styles.tickOn]}>{on ? <Icon name="check" size={13} color={colors.onMoss} strokeWidth={2.6} /> : null}</View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm },
  cell: { flex: 1 },
  wideOuter: { width: '100%' },
  card: {
    minHeight: 112,
    padding: space.md,
    borderRadius: radius.lg,
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.line,
    transitionProperty: ['borderColor', 'backgroundColor'],
    transitionDuration: 150,
  } as object,
  wide: { flexDirection: 'row', alignItems: 'center', minHeight: 0, gap: space.md },
  cardOn: { borderColor: colors.moss, backgroundColor: colors.green50 },
  headRow: { flexDirection: 'row', alignItems: 'center' },
  price: { fontFamily: fonts.semibold, fontSize: 22, lineHeight: 28, color: colors.ink, marginTop: 2 },
  hourly: { fontFamily: fonts.body },
  save: { fontFamily: fonts.semibold, marginTop: 2 },
  popular: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, backgroundColor: colors.mossSoft },
  tick: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.gray300, alignItems: 'center', justifyContent: 'center' },
  tickOn: { backgroundColor: colors.moss, borderColor: colors.moss },
});
