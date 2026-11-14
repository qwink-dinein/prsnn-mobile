import { StyleSheet, View } from 'react-native';
import Animated, { LinearTransition, useReducedMotion } from 'react-native-reanimated';
import { colors, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { PressScale } from './ui/motion';
import { Wordmark } from './ui/Brand';
import { MaterialCard, MATERIALS, type Material } from './ui/wallet';
import { formatINR } from '@/domain/booking';
import { companionShareOf, durationLine, hourlyFor, hoursLabel, POPULAR_HOURS, priceFor, savingFor } from '@/domain/pricing';

type Props =
  | { mode: 'book'; hours: number[]; selected: number | null; onSelect: (h: number) => void }
  | { mode: 'offer'; hours: number[]; selected: number[]; onSelect: (h: number) => void };

/** Card material per length (design.md · Wallet price cards). */
const MAT: Record<number, Material> = { 1: 'pearl', 2: 'mist', 3: 'pearl', 4: 'midnight', 5: 'mist', 6: 'steel', 7: 'pearl', 8: 'mist', 9: 'pearl', 10: 'mist', 11: 'pearl', 12: 'champagne' };
const matFor = (h: number): Material => MAT[h] ?? 'pearl';

/** "Suggested" on 4 hours (not "most popular" until real data says so); "Best value" on the lowest hourly rate. */
function tagFor(h: number, hours: number[]): string | null {
  if (h === POPULAR_HOURS) return 'Suggested';
  const best = hours.reduce((b, x) => (hourlyFor(x) < hourlyFor(b) ? x : b), hours[0]);
  return h === best && hours.length > 1 && savingFor(h) > 0 ? 'Best value' : null;
}

/**
 * Price cards in the approved Wallet style ("P1 · Lift to choose"). Members: the chosen length
 * is a lifted membership card with the total, the hourly rate and the saving; the other lengths
 * are slim tabs stacked under it; tap one to lift it. Companions: every length as a tab with a
 * tick and what they get.
 */
export function PackageGrid(props: Props) {
  const { hours, mode } = props;
  const reduced = useReducedMotion();
  const layout = reduced ? undefined : LinearTransition.duration(220);

  if (mode === 'offer') {
    return (
      <View style={{ gap: space.sm }} accessibilityRole="list">
        {hours.map((h) => (
          <Tab key={h} h={h} hours={hours} mode="offer" on={props.selected.includes(h)} onPress={() => props.onSelect(h)} />
        ))}
      </View>
    );
  }

  const chosen = props.selected != null && hours.includes(props.selected) ? props.selected : null;
  const rest = hours.filter((h) => h !== chosen);
  return (
    <View accessibilityRole="radiogroup">
      {chosen != null ? (
        <Animated.View layout={layout} key={`big-${chosen}`}>
          <BigCard h={chosen} hours={hours} />
        </Animated.View>
      ) : null}
      {rest.map((h, k) => (
        // Tabs overlap like cards in a wallet; each one still shows its whole first line.
        <Animated.View layout={layout} key={h} style={{ marginTop: k === 0 ? (chosen != null ? space.md : 0) : chosen != null ? -18 : space.sm, zIndex: k + 1 }}>
          <Tab h={h} hours={hours} mode="book" on={false} onPress={() => props.onSelect(h)} />
        </Animated.View>
      ))}
      {chosen != null ? (
        <Text variant="footnote" muted style={{ marginTop: space.md }}>
          {durationLine(chosen)}
        </Text>
      ) : null}
    </View>
  );
}

const a11y = (h: number, mode: 'book' | 'offer') => {
  const price = priceFor(h) ?? 0;
  const save = savingFor(h);
  return `${hoursLabel(h)}, ${formatINR(price)}, ${formatINR(hourlyFor(h))} an hour${save ? `, you save ${formatINR(save)}` : ''}${mode === 'offer' ? `, you get ${formatINR(companionShareOf(price))}` : ''}${h === POPULAR_HOURS && mode === 'book' ? ', suggested' : ''}.`;
};

function BigCard({ h, hours }: { h: number; hours: number[] }) {
  const mat = matFor(h);
  const m = MATERIALS[mat];
  const price = priceFor(h) ?? 0;
  const save = savingFor(h);
  const tag = tagFor(h, hours);
  return (
    <View accessible accessibilityRole="radio" accessibilityState={{ checked: true }} accessibilityLabel={a11y(h, 'book')}>
      <MaterialCard material={mat} lifted style={styles.big}>
        <View style={styles.bigTop}>
          <Wordmark size={13} color={m.fg} dotColor={m.accent} />
          {tag ? (
            <View style={[styles.tag, { backgroundColor: mat === 'champagne' ? colors.midnight : colors.champagne }]}>
              <Text variant="caption" color={mat === 'champagne' ? colors.porcelain : colors.midnight} style={{ fontFamily: fonts.semibold }}>
                {tag}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={{ marginTop: 'auto' }}>
          <Text variant="subhead" color={m.fg} style={{ opacity: 0.8 }}>
            {hoursLabel(h)}
          </Text>
          <Text style={[styles.bigPrice, { color: m.dark ? colors.champagne : m.fg }]} numberOfLines={1} adjustsFontSizeToFit>
            {formatINR(price)}
          </Text>
          <Text variant="footnote" color={m.fg} style={{ opacity: 0.85, marginTop: 6 }}>
            {formatINR(hourlyFor(h))} an hour{save ? `  ·  Save ${formatINR(save)}` : ''}
          </Text>
        </View>
      </MaterialCard>
    </View>
  );
}

function Tab({ h, hours, mode, on, onPress }: { h: number; hours: number[]; mode: 'book' | 'offer'; on: boolean; onPress: () => void }) {
  const mat = matFor(h);
  const m = MATERIALS[mat];
  const price = priceFor(h) ?? 0;
  const tag = mode === 'book' ? tagFor(h, hours) : null;
  const tickBg = m.dark ? colors.champagne : colors.midnight;
  return (
    <PressScale
      accessibilityRole={mode === 'book' ? 'radio' : 'checkbox'}
      accessibilityState={{ checked: on }}
      accessibilityLabel={a11y(h, mode)}
      onPress={onPress}
      scaleTo={0.98}
    >
      <MaterialCard material={mat} style={styles.tab}>
        <View style={styles.tabRow}>
          {mode === 'offer' ? (
            <View style={[styles.tick, on ? { backgroundColor: tickBg, borderColor: tickBg } : { borderColor: m.fg, opacity: 0.7 }]}>
              {on ? <Icon name="check" size={12} color={m.dark ? colors.midnight : colors.porcelain} strokeWidth={3} /> : null}
            </View>
          ) : null}
          <Text variant="headline" color={m.fg} style={{ flexShrink: 1, minWidth: 0 }} numberOfLines={1}>
            {hoursLabel(h)}
            {tag ? (
              <Text variant="caption" color={m.fg} style={{ opacity: 0.7 }}>
                {`   ${tag}`}
              </Text>
            ) : null}
          </Text>
          <Text style={[styles.tabPrice, { color: m.fg }]} numberOfLines={1}>
            {mode === 'offer' ? `You get ${formatINR(companionShareOf(price))}` : formatINR(price)}
          </Text>
        </View>
      </MaterialCard>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  big: { minHeight: 168, padding: space.lg, paddingHorizontal: space.lg + 2 },
  bigTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm, minHeight: 24 },
  bigPrice: { fontFamily: fonts.number, fontSize: 40, lineHeight: 46, letterSpacing: -1.4, marginTop: 2 },
  tag: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: radius.pill },
  tab: { minHeight: 58, paddingHorizontal: space.lg, paddingTop: 12, paddingBottom: 14, borderRadius: 18 },
  tabRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  tabPrice: { fontFamily: fonts.number, fontSize: 15, letterSpacing: -0.3, marginLeft: 'auto', flexShrink: 0 },
  tick: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginRight: 2 },
});
