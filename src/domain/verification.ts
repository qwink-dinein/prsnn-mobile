import type { IdType, VerificationStatus } from './types';

/**
 * Companion ID check happens at the first booking, not at sign-up.
 * Mirrors prsnn-backend/supabase/migrations/20261110090100_id_at_first_booking.sql.
 */

export const ID_TYPES: { type: IdType; label: string; sides: string; needsBack: boolean }[] = [
  { type: 'aadhaar', label: 'Aadhaar', sides: 'Front and back', needsBack: true },
  { type: 'pan', label: 'PAN card', sides: 'Front only', needsBack: false },
  { type: 'driving_licence', label: 'Driving licence', sides: 'Front and back', needsBack: true },
  { type: 'passport', label: 'Passport', sides: 'Photo page', needsBack: false },
  { type: 'voter_id', label: 'Voter ID', sides: 'Front and back', needsBack: true },
];

export const idTypeLabel = (t?: string | null) => ID_TYPES.find((x) => x.type === t)?.label ?? 'ID';
export const needsBack = (t: IdType) => !!ID_TYPES.find((x) => x.type === t)?.needsBack;

/** Listed and bookable (ID may still be checked at the first booking). */
export const isLiveCompanion = (s?: VerificationStatus | null) => s === 'id_required' || s === 'pending' || s === 'verified';

/** Must upload an ID before accepting an offer. */
export const needsIdToAccept = (s?: VerificationStatus | null) => s === 'id_required' || s === 'rejected' || s === 'not_submitted' || !s;

/** What's missing before an ID can be sent; null when ready. */
export function idUploadError(t: IdType | null, f: { front?: unknown; back?: unknown; selfie?: unknown }): string | null {
  if (!t) return 'Choose which ID you’re using.';
  if (!f.front) return needsBack(t) ? 'Add the front of your ID.' : 'Add a photo of your ID.';
  if (needsBack(t) && !f.back) return 'Add the back of your ID too.';
  if (!f.selfie) return 'Take a selfie so we can match it to your ID.';
  return null;
}

/** Companion dashboard line under their name. */
export function companionStatusLine(s?: VerificationStatus | null): string {
  switch (s) {
    case 'verified':
      return 'Live · ID verified';
    case 'id_required':
      return 'Live · ID needed at your first booking';
    case 'pending':
      return 'Live · ID check in progress';
    case 'rejected':
      return 'Hidden · ID needs another look';
    default:
      return 'Not live yet';
  }
}

/** Short value for the profile row. */
export const idCheckValue = (s?: VerificationStatus | null) =>
  s === 'verified' ? 'Verified' : s === 'pending' ? 'In review' : s === 'rejected' ? 'Send a new ID' : s === 'id_required' ? 'At first booking' : 'Finish profile';
