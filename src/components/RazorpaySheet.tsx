import { useMemo } from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/tokens';
import { Header } from './ui/layout';

export interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface CheckoutOptions {
  keyId: string;
  orderId: string;
  amount: number; // paise
  name?: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string; method?: string };
}

type Props = {
  visible: boolean;
  options: CheckoutOptions | null;
  onSuccess: (r: RazorpaySuccess) => void;
  onDismiss: (reason?: string) => void;
};

/**
 * Razorpay Standard Checkout inside a WebView.
 *
 * Why not react-native-razorpay: it is a native module, so it would not run in
 * Expo Go or the web preview. checkout.js in a WebView works everywhere, keeps
 * card/UPI details inside Razorpay's own page, and the backend still verifies
 * the signature and the captured amount (payment.controller.js verifyPayment).
 */
export function RazorpaySheet({ visible, options, onSuccess, onDismiss }: Props) {
  const html = useMemo(() => (options ? checkoutHtml(options) : ''), [options]);

  if (!options) return null;

  const onMessage = (e: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data) as { type: string; data?: RazorpaySuccess; reason?: string };
      if (msg.type === 'success' && msg.data) onSuccess(msg.data);
      else if (msg.type === 'dismiss') onDismiss();
      else if (msg.type === 'failed') onDismiss(msg.reason || 'Payment failed. No money was taken.');
    } catch {
      // ignore stray messages
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => onDismiss()}>
      <SafeAreaView style={styles.fill} edges={['top', 'bottom']}>
        <Header title="Secure payment" onBack={() => onDismiss()} />
        <View style={styles.fill}>
          {Platform.OS === 'web' ? null : (
            <WebView
              originWhitelist={['*']}
              source={{ html, baseUrl: 'https://api.razorpay.com' }}
              onMessage={onMessage}
              javaScriptEnabled
              domStorageEnabled
              setSupportMultipleWindows={false}
              style={styles.fill}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

/** Web preview: load checkout.js into the page directly. */
export function openWebCheckout(options: CheckoutOptions, onSuccess: (r: RazorpaySuccess) => void, onDismiss: (reason?: string) => void) {
  const w = globalThis as unknown as { Razorpay?: new (o: unknown) => { open: () => void; on: (e: string, cb: (r: { error?: { description?: string } }) => void) => void }; document?: Document };
  const run = () => {
    if (!w.Razorpay) return onDismiss('Could not load the payment page.');
    const rzp = new w.Razorpay({ ...baseOptions(options), handler: onSuccess, modal: { ondismiss: () => onDismiss() } });
    rzp.on('payment.failed', (r) => onDismiss(r?.error?.description || 'Payment failed. No money was taken.'));
    rzp.open();
  };
  if (w.Razorpay) return run();
  const s = w.document?.createElement('script');
  if (!s || !w.document) return onDismiss('Payments are not available here.');
  s.src = 'https://checkout.razorpay.com/v1/checkout.js';
  s.onload = run;
  s.onerror = () => onDismiss('Could not load the payment page.');
  w.document.body.appendChild(s);
}

function baseOptions(o: CheckoutOptions) {
  return {
    key: o.keyId,
    order_id: o.orderId,
    amount: o.amount,
    currency: 'INR',
    name: o.name ?? 'prsnn.',
    description: o.description ?? 'Companion booking',
    prefill: o.prefill ?? {},
    theme: { color: colors.moss },
  };
}

function checkoutHtml(o: CheckoutOptions): string {
  const opts = JSON.stringify(baseOptions(o)).replace(/</g, '\\u003c');
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>html,body{margin:0;height:100%;background:${colors.mist};font-family:-apple-system,Roboto,sans-serif;color:${colors.ink}}
.c{display:flex;height:100%;align-items:center;justify-content:center;text-align:center;padding:24px}</style></head>
<body><div class="c"><p>Opening secure checkout…</p></div>
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
(function(){
  function post(m){ window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(m)); }
  if(!window.Razorpay){ post({type:'failed',reason:'Could not load the payment page. Check your connection.'}); return; }
  var o = ${opts};
  o.handler = function(r){ post({type:'success',data:r}); };
  o.modal = { ondismiss: function(){ post({type:'dismiss'}); }, escape: false };
  var rzp = new Razorpay(o);
  rzp.on('payment.failed', function(r){ post({type:'failed',reason:(r && r.error && r.error.description) || 'Payment failed.'}); });
  rzp.open();
})();
</script></body></html>`;
}

const styles = StyleSheet.create({ fill: { flex: 1, backgroundColor: colors.mist } });
