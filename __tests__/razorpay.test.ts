import { externalTarget } from '../src/domain/payments';

test('web pages stay inside checkout; UPI apps open outside', () => {
  expect(externalTarget('https://api.razorpay.com/v1/checkout')).toBeNull();
  expect(externalTarget('about:blank')).toBeNull();
  expect(externalTarget('upi://pay?pa=x@ybl&am=699')).toBe('upi://pay?pa=x@ybl&am=699');
  expect(externalTarget('phonepe://pay?pa=x@ybl')).toBe('phonepe://pay?pa=x@ybl');
});

test('Android intent links become the UPI link they wrap', () => {
  expect(externalTarget('intent://pay?pa=x@okicici&am=699#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end')).toBe('upi://pay?pa=x@okicici&am=699');
});
