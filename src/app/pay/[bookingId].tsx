import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, space } from '@/theme/tokens';
import { Screen, Header, Card, Loading, ErrorState } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { RazorpaySheet, openWebCheckout, type CheckoutOptions, type RazorpaySuccess } from '@/components/RazorpaySheet';
import { totalOf, whenOf } from '@/components/bookings';
import { formatINR, personOf } from '@/domain/booking';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import { DEMO } from '@/lib/config';
import { useSession } from '@/state/session';

const METHODS: { key: string; label: string; icon: IconName; hint: string }[] = [
  { key: 'upi', label: 'UPI', icon: 'upi', hint: 'GPay, PhonePe, Paytm' },
  { key: 'card', label: 'Credit / debit card', icon: 'card', hint: 'Visa, Mastercard, RuPay' },
  { key: 'netbanking', label: 'Net banking', icon: 'bank', hint: 'All major banks' },
  { key: 'wallet', label: 'Wallets', icon: 'wallet', hint: 'Paytm, Amazon Pay' },
];

/** Screen 11 · Secure payment through Razorpay. The backend verifies the signature and amount. */
export default function Pay() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const user = useSession((s) => s.user);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: qk.booking(bookingId), queryFn: () => svc.booking(bookingId) });
  const [method, setMethod] = useState('upi');
  const [checkout, setCheckout] = useState<CheckoutOptions | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (q.isLoading) return <Loading />;
  if (q.isError || !q.data) return <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />;
  const b = q.data;
  const person = personOf(b.companionId);

  const done = async (r: RazorpaySuccess) => {
    setCheckout(null);
    setBusy(true);
    try {
      await svc.verifyPayment({ bookingId, razorpayOrderId: r.razorpay_order_id, razorpayPaymentId: r.razorpay_payment_id, razorpaySignature: r.razorpay_signature });
      qc.invalidateQueries({ queryKey: qk.myBookings });
      qc.invalidateQueries({ queryKey: qk.booking(bookingId) });
      router.replace({ pathname: '/confirmed', params: { kind: 'paid', bookingId } });
    } catch (e) {
      // Money may have moved even if verification failed — never tell people it didn't.
      setError(`${errorMessage(e)} If money left your account, it will be matched or refunded. Contact support with booking #${bookingId.slice(-6).toUpperCase()}.`);
    } finally {
      setBusy(false);
    }
  };

  const pay = async () => {
    setError(null);
    setBusy(true);
    try {
      const intent = await svc.createPaymentIntent(bookingId);
      const opts: CheckoutOptions = {
        keyId: intent.keyId,
        orderId: intent.orderId,
        amount: intent.amount,
        description: `Booking with ${person?.fullName ?? 'your companion'}`,
        prefill: { name: user?.fullName, email: user?.email, contact: user?.phone ? `+${user.phone}` : undefined, method },
      };
      if (DEMO) {
        await done({ razorpay_order_id: intent.orderId, razorpay_payment_id: 'pay_demo', razorpay_signature: 'demo' });
      } else if (Platform.OS === 'web') {
        openWebCheckout(opts, done, (reason) => reason && setError(reason));
      } else setCheckout(opts);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen
      footer={
        <View style={{ gap: space.xs }}>
          <Button label={`Pay ${formatINR(totalOf(b))}`} icon="lock" onPress={pay} loading={busy} haptic disabled={b.paymentStatus === 'paid'} />
          <View style={styles.secure}>
            <Icon name="shieldCheck" size={14} color={colors.gray500} />
            <Text variant="caption" muted>
              Secure payment powered by Razorpay
            </Text>
          </View>
        </View>
      }
    >
      <Header title="Payment" />
      <View style={styles.hero}>
        <View style={styles.shield}>
          <Icon name="shieldCheck" size={26} color={colors.moss} />
        </View>
        <Text variant="subhead" muted>
          Secure payment
        </Text>
        <Text variant="largeTitle">{formatINR(totalOf(b))}</Text>
        <Text variant="footnote" muted center>
          Booking with {person?.fullName ?? 'your companion'}
          {'\n'}
          {whenOf(b)}
        </Text>
      </View>

      <Text variant="title3" style={{ marginBottom: space.md }}>
        Pay with
      </Text>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {METHODS.map((m, i) => {
          const on = method === m.key;
          return (
            <Pressable
              key={m.key}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              accessibilityLabel={`${m.label}, ${m.hint}`}
              onPress={() => setMethod(m.key)}
              style={[styles.method, i > 0 && styles.line]}
            >
              <Icon name={m.icon} size={22} color={colors.moss} />
              <View style={{ flex: 1 }}>
                <Text variant="callout">{m.label}</Text>
                <Text variant="caption" muted>
                  {m.hint}
                </Text>
              </View>
              <View style={[styles.radio, on && styles.radioOn]}>{on ? <View style={styles.radioDot} /> : null}</View>
            </Pressable>
          );
        })}
      </Card>

      {error ? (
        <Text variant="footnote" color={colors.danger} style={{ marginTop: space.lg }} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}

      <RazorpaySheet
        visible={!!checkout}
        options={checkout}
        onSuccess={done}
        onDismiss={(reason) => {
          setCheckout(null);
          if (reason) setError(reason);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: space.xs, marginVertical: space.xl },
  shield: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.mossSoft, alignItems: 'center', justifyContent: 'center', marginBottom: space.xs },
  method: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 64, paddingHorizontal: space.lg },
  line: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.gray300, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.moss },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.moss },
  secure: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
});
