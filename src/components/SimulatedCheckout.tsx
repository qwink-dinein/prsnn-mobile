import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, space } from '@/theme/tokens';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { Button } from './ui/Button';
import { formatINR } from '@/domain/booking';

type Props = {
  visible: boolean;
  amount: number; // rupees
  methodLabel: string;
  description: string;
  onPay: (outcome: 'success' | 'failure') => Promise<void>;
  onClose: () => void;
};

/**
 * Test checkout used while the backend runs PAYMENT_MODE=simulated.
 * Looks like a payment sheet, but says plainly that no money moves.
 * When Razorpay is switched on, /payments/create-intent returns mode
 * 'razorpay' and the app opens the real checkout instead — no app update needed.
 */
export function SimulatedCheckout({ visible, amount, methodLabel, description, onPay, onClose }: Props) {
  const [busy, setBusy] = useState<null | 'success' | 'failure'>(null);

  const run = async (outcome: 'success' | 'failure') => {
    setBusy(outcome);
    // A short pause so the flow feels like a real gateway round-trip.
    await new Promise((r) => setTimeout(r, 900));
    try {
      await onPay(outcome);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => { if (!busy) onClose(); }}>
      <Pressable style={styles.backdrop} onPress={() => { if (!busy) onClose(); }} accessibilityLabel="Close payment" />
      <View style={styles.sheet} accessibilityViewIsModal>
        <View style={styles.grabber} />
        <View style={styles.badge}>
          <Icon name="info" size={14} color={colors.clay} />
          <Text variant="caption" color={colors.clay}>
            TEST MODE · no money will be taken
          </Text>
        </View>
        <Text variant="subhead" muted center>
          {description}
        </Text>
        <Text variant="largeTitle" center style={{ marginVertical: space.sm }}>
          {formatINR(amount)}
        </Text>
        <View style={styles.method}>
          <Icon name="shieldCheck" size={18} color={colors.moss} />
          <Text variant="callout" style={{ flex: 1 }}>
            Paying with {methodLabel}
          </Text>
        </View>
        {busy ? (
          <View style={styles.processing} accessibilityLiveRegion="polite">
            <ActivityIndicator color={colors.moss} />
            <Text variant="callout" muted>
              Processing payment…
            </Text>
          </View>
        ) : (
          <View style={{ gap: space.sm }}>
            <Button label={`Pay ${formatINR(amount)}`} icon="lock" haptic onPress={() => run('success')} />
            <Button label="Simulate a failed payment" variant="ghost" compact onPress={() => run('failure')} />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(14,17,13,0.35)' },
  sheet: { backgroundColor: colors.paper, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, padding: space.xl, paddingBottom: space.huge, gap: space.md },
  grabber: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.gray200, marginBottom: space.sm },
  badge: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: space.md, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.warningSoft },
  method: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md, borderRadius: radius.md, backgroundColor: colors.mist },
  processing: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.md, minHeight: 100 },
});
