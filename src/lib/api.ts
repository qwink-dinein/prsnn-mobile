/**
 * Shared client helpers. The old Express REST client was removed when prsnn
 * moved to Supabase (see src/services/backend.ts and src/lib/supabase.ts).
 */
let onUnauthorized: (() => void) | null = null;
let token: string | null = null;

export const setApiToken = (t: string | null) => {
  token = t;
};
export const getApiToken = () => token;
export const setUnauthorizedHandler = (fn: (() => void) | null) => {
  onUnauthorized = fn;
};
/** Called when the server says the session is no longer valid. */
export const signalUnauthorized = () => onUnauthorized?.();

/** A file picked with expo-image-picker, ready for multipart upload. */
export interface UploadFile {
  uri: string;
  name: string;
  type: string;
}

export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong. Please try again.');
