/**
 * What prsnn is (and isn't), and the house rules everyone agrees to. The website shows the same
 * words (prsnn-frontend `_lib/content.js` NOT_FOR / HOUSE_RULES); keep them in step.
 */

/** Date of the policy text people agree to; the server records it with each consent. */
export const LEGAL_VERSION = '2026-11-16';

export type ConsentKind = 'terms' | 'privacy' | 'age_18' | 'whatsapp_updates' | 'house_rules' | 'companion_terms';
export interface Consent {
  kind: ConsentKind | 'photo_visibility' | 'enquiry_contact';
  version: string;
  acceptedAt: string;
}

export const NOT_FOR: [string, string][] = [
  ['Not a dating app', 'No romance, flirting or hook-ups. Companions are company, not a date.'],
  ['Not an escort or adult service', 'Nothing sexual, ever. Asking leads to a permanent ban and may be reported to the police.'],
  ['Not for errands or chores', 'No shopping runs, deliveries, queues, cleaning, moving or driving you around.'],
  ['Not therapy or counselling', 'Companions are good company, not mental-health professionals. In crisis, call Tele-MANAS on 14416.'],
  ['Not medical or nursing care', 'No medicines, personal care or caregiving, even on a visit to a loved one.'],
  ['Not childcare', 'No babysitting. Everyone on prsnn is 18 or older.'],
  ['Not a professional service', 'Not a tour guide, tutor, interpreter, driver or bodyguard.'],
  ['Not a pretend partner', 'No posing as a boyfriend, girlfriend or spouse for family, events or anyone else.'],
  ['Not for business', 'No sales pitches, recruiting, network marketing, loans or fundraising.'],
  ['Not an emergency service', 'In danger? Call 112 first. The panic button alerts the prsnn team.'],
];

export const HOUSE_RULES: [string, string][] = [
  ['Respect, always', 'Be kind, polite and on time. Treat everyone as an equal, whatever their gender, religion, caste, background, body or orientation.'],
  ['No means no', 'Respect every boundary, the first time. Keep physical contact to a handshake or a wave.'],
  ['Public places only', 'Meet at the place in the booking. The one exception: a visit a family books for a loved one, at that person’s home. Never a hotel room, a private home or a private vehicle.'],
  ['Stick to the plan', 'Keep to the booked time, place and kind of company. Changing the plan means changing the booking.'],
  ['Keep it on prsnn', 'Pay only in the app. Don’t share or ask for numbers, addresses or social media, and don’t arrange paid time off the app.'],
  ['No photos without a yes', 'Ask before taking a photo or video, and never post anyone online without their permission.'],
  ['Sober and safe', 'No drugs, and no pressure to drink. Stop if anyone feels unsafe.'],
  ['No gifts, loans or favours', 'Don’t ask for or offer money, gifts or favours beyond the booking.'],
  ['Anyone can leave', 'Either of you can end a meeting at any time if you feel uncomfortable. Hold the panic button if you need us.'],
  ['Speak up', 'Report anything that breaks these rules from the booking. Breaking them means removal, and serious cases go to the police.'],
];

/** What the sign-in screen's agreement line covers (email sign-ups get no WhatsApp line). */
export function signInConsents(byEmail: boolean): ConsentKind[] {
  return byEmail ? ['terms', 'privacy', 'age_18'] : ['terms', 'privacy', 'age_18', 'whatsapp_updates'];
}

/** When the person agreed to `kind` (any version), or null. */
export function agreedAt(consents: Consent[] | undefined, kind: Consent['kind']): string | null {
  const hits = (consents ?? []).filter((c) => c.kind === kind).map((c) => c.acceptedAt).sort();
  return hits.length ? hits[hits.length - 1] : null;
}

/** Kinds from `wanted` the person hasn't agreed to yet. */
export function missingConsents(consents: Consent[] | undefined, wanted: ConsentKind[]): ConsentKind[] {
  return wanted.filter((k) => !agreedAt(consents, k));
}
