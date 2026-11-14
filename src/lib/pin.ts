import * as Crypto from 'expo-crypto';
import { secure } from './storage';
import { loginKey } from '@/domain/login';

/**
 * The 4-digit PIN is a device unlock: after one OTP login the session stays on
 * this device, and the PIN opens it again. The PIN never leaves the device; only
 * a salted SHA-256 is stored (Keychain / Keystore). Five wrong tries wipe it, and
 * the person logs in with OTP again.
 */
/** A PIN belongs to a mobile number (last 10 digits) or, for email sign-ups, an email. */
const norm = loginKey;
const key = (phone: string) => `prsnn.pin.${norm(phone)}`;
const triesKey = (phone: string) => `${key(phone)}.tries`;
export const MAX_PIN_TRIES = 5;

const hash = (phone: string, pin: string) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `prsnn:${norm(phone)}:${pin}`);

export async function hasLocalPin(phone?: string | null) {
  return !!phone && !!(await secure.get(key(phone)));
}

export async function setLocalPin(phone: string, pin: string) {
  await secure.set(key(phone), await hash(phone, pin));
  await secure.remove(triesKey(phone));
}

export async function clearLocalPin(phone: string) {
  await secure.remove(key(phone));
  await secure.remove(triesKey(phone));
}

/** true = correct. Throws a readable message after too many wrong tries. */
export async function checkLocalPin(phone: string, pin: string): Promise<boolean> {
  const stored = await secure.get(key(phone));
  if (!stored) throw new Error('PIN login isn’t set up on this phone. Log in with OTP.');
  if (stored === (await hash(phone, pin))) {
    await secure.remove(triesKey(phone));
    return true;
  }
  const tries = Number((await secure.get(triesKey(phone))) ?? '0') + 1;
  if (tries >= MAX_PIN_TRIES) {
    await clearLocalPin(phone);
    await forgetSavedSession(phone);
    throw new Error('Too many wrong PINs. Log in with OTP and choose a new PIN.');
  }
  await secure.set(triesKey(phone), String(tries));
  return false;
}

/**
 * The saved session: the Supabase refresh token for each person who has logged in
 * on this phone, in the Keychain / Keystore. Refresh tokens don't expire on their
 * own, so the PIN keeps working for good: "Log out" only locks the app, and the
 * code (OTP) is needed again only after Forgot PIN, five wrong PINs, or deleting
 * the account.
 */
const rtKey = (id: string) => `prsnn.rt.${norm(id)}`;

export async function saveSession(id: string, refreshToken: string) {
  if (norm(id)) await secure.set(rtKey(id), refreshToken);
}
export const savedSession = (id: string) => secure.get(rtKey(id));
export const forgetSavedSession = (id: string) => secure.remove(rtKey(id));
