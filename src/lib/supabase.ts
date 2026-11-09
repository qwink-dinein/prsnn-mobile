import 'react-native-url-polyfill/auto';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL } from './config';

/**
 * The one Supabase client. The session (access + refresh token) is kept in
 * AsyncStorage — SecureStore's 2 KB value limit is too small for it — and
 * refreshed automatically while the app is in the foreground.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}

/** Public URL of a file in the avatars bucket (or a full URL as is). */
export const avatarUrl = (path?: string | null) =>
  !path ? null : /^https?:\/\//.test(path) ? path : supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
