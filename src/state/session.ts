import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { secure } from '@/lib/storage';
import { setApiToken } from '@/lib/api';
import { DEMO } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { clearLocalPin, forgetSavedSession, saveSession, savedSession } from '@/lib/pin';
import { loginIdOfAuthUser, sameLogin, sessionIsGone } from '@/domain/login';
import type { Role, SessionUser } from '@/domain/types';

const TOKEN_KEY = 'prsnn.token';
const USER_KEY = 'prsnn.user';
const PREFS_KEY = 'prsnn.prefs';

interface Prefs {
  /** Last phone that signed in on this device, to offer "Log in with PIN". */
  lastPhone?: string;
  /** Role picked on "I'm here as a…" before sign-up. */
  intendedRole?: Extract<Role, 'user' | 'companion'>;
  /** Companions saved with the heart (kept on device; the backend has no favourites yet). */
  saved: string[];
  seenOnboarding?: boolean;
}

interface SessionState {
  hydrated: boolean;
  /** Set when the session ended on its own (not "Log out"): the app sends them to log in, drafts kept. */
  expired: boolean;
  token: string | null;
  user: SessionUser | null;
  prefs: Prefs;
  /**
   * Staff "View the app as…": the screens run as a sample member or companion on sample data.
   * `real` is the staff member's own profile, restored on exit. Nothing about it is saved.
   */
  preview: { as: 'member' | 'companion'; real: SessionUser } | null;
  hydrate: () => Promise<void>;
  signIn: (token: string, user: SessionUser) => Promise<void>;
  updateUser: (patch: Partial<SessionUser>) => Promise<void>;
  /** "Log out": locks the app. The session stays saved on this phone, so the PIN opens it again. */
  signOut: () => Promise<void>;
  /** Ends the session for good (account deleted): the next login needs a code. */
  endSession: () => Promise<void>;
  setPrefs: (patch: Partial<Prefs>) => Promise<void>;
  toggleSaved: (companionId: string) => Promise<void>;
}

const writePrefs = (p: Prefs) => AsyncStorage.setItem(PREFS_KEY, JSON.stringify(p)).catch(() => {});

let manualSignOut = false;

export const useSession = create<SessionState>((set, get) => ({
  hydrated: false,
  expired: false,
  token: null,
  user: null,
  prefs: { saved: [] },
  preview: null,

  async hydrate() {
    const [token, userRaw, prefsRaw] = await Promise.all([
      secure.get(TOKEN_KEY),
      secure.get(USER_KEY),
      AsyncStorage.getItem(PREFS_KEY).catch(() => null),
    ]);
    let user: SessionUser | null = null;
    let prefs: Prefs = { saved: [] };
    try {
      user = userRaw ? JSON.parse(userRaw) : null;
    } catch {}
    try {
      prefs = { saved: [], ...(prefsRaw ? JSON.parse(prefsRaw) : {}) };
    } catch {}
    // Supabase keeps the real session (and refreshes it); the stored user is the profile we showed last.
    let live = token;
    if (!DEMO) {
      const { data } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
      let session = data.session;
      // The library dropped the session but this phone still has it saved: bring it back.
      if (!session && user) session = (await restoreSession(user.phone || user.email || '')).session;
      live = session && sameLogin(user?.phone || user?.email, session.user) ? session.access_token : null;
      if (!live) user = null;
    }
    setApiToken(live && user ? live : null);
    set({ hydrated: true, token: live && user ? live : null, user: live ? user : null, prefs });
  },

  async signIn(token, user) {
    setApiToken(token);
    set({ token, user, expired: false });
    await Promise.all([secure.set(TOKEN_KEY, token), secure.set(USER_KEY, JSON.stringify(user))]);
    // The PIN login button remembers the number (or email, for email sign-ups).
    const id = user.phone || user.email;
    if (id) await get().setPrefs({ lastPhone: id });
  },

  async updateUser(patch) {
    const user = get().user;
    if (!user) return;
    const next = { ...user, ...patch };
    set({ user: next });
    if (get().preview) return; // sample profile: never saved over the staff member's own
    await secure.set(USER_KEY, JSON.stringify(next));
  },

  async signOut() {
    const pv = get().preview;
    if (pv) {
      // "Log out" inside a preview only leaves the preview.
      set({ preview: null, user: pv.real });
      return;
    }
    // Not supabase.auth.signOut(): that revokes the session on the server and the
    // next login would need a paid WhatsApp code. The PIN screen reopens it instead.
    setApiToken(null);
    set({ token: null, user: null });
    await Promise.all([secure.remove(TOKEN_KEY), secure.remove(USER_KEY)]);
  },

  async endSession() {
    const id = get().user?.phone || get().user?.email;
    setApiToken(null);
    manualSignOut = true;
    if (!DEMO) await supabase.auth.signOut().catch(() => {});
    manualSignOut = false;
    set({ token: null, user: null });
    await Promise.all([secure.remove(TOKEN_KEY), secure.remove(USER_KEY), ...(id ? [forgetSavedSession(id), clearLocalPin(id)] : [])]);
  },

  async setPrefs(patch) {
    const prefs = { ...get().prefs, ...patch };
    set({ prefs });
    await writePrefs(prefs);
  },

  async toggleSaved(id) {
    const saved = get().prefs.saved;
    await get().setPrefs({ saved: saved.includes(id) ? saved.filter((s) => s !== id) : [...saved, id] });
  },
}));

export const isCompanionUser = (u: SessionUser | null) => u?.role === 'companion';

/**
 * Bring back a saved session for `id` (number or email) from this phone.
 * `gone` is true only when the server says it no longer exists; a network
 * problem leaves it saved for the next try.
 */
export async function restoreSession(id: string): Promise<{ session: import('@supabase/supabase-js').Session | null; gone: boolean }> {
  if (!id) return { session: null, gone: false };
  const rt = await savedSession(id);
  if (!rt) return { session: null, gone: true };
  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: rt });
    if (data.session && sameLogin(id, data.session.user)) return { session: data.session, gone: false };
    const gone = !data.session && sessionIsGone(error?.message);
    if (gone) await forgetSavedSession(id);
    return { session: null, gone };
  } catch (e) {
    return { session: null, gone: sessionIsGone(e instanceof Error ? e.message : null) };
  }
}

/** Keep the saved session and the stored token in step with Supabase (refreshes, new logins). */
if (!DEMO) {
  let restoring = false;
  supabase.auth.onAuthStateChange((event, session) => {
    const st = useSession.getState();
    const id = loginIdOfAuthUser(session?.user);
    if (session?.refresh_token && id && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
      void saveSession(id, session.refresh_token);
    }
    const own = st.preview?.real ?? st.user;
    if (event === 'TOKEN_REFRESHED' && session && own && sameLogin(own.phone || own.email, session.user)) useSession.setState({ token: session.access_token });
    if (event === 'SIGNED_OUT' && st.token && !manualSignOut && !restoring) {
      // The library gave up on the session. Try the copy saved on this phone before asking for a code.
      const who = own?.phone || own?.email || '';
      restoring = true;
      void restoreSession(who).then(({ session: back, gone }) => {
        restoring = false;
        if (back) {
          setApiToken(back.access_token);
          useSession.setState({ token: back.access_token });
          return;
        }
        // Offline: stay in the app; calls fail with "no internet" and work again once back online.
        if (!gone) return;
        setApiToken(null);
        useSession.setState({ token: null, user: null, preview: null, expired: true });
      });
    }
  });
}
