import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { secure } from '@/lib/storage';
import { setApiToken } from '@/lib/api';
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
  token: string | null;
  user: SessionUser | null;
  prefs: Prefs;
  hydrate: () => Promise<void>;
  signIn: (token: string, user: SessionUser) => Promise<void>;
  updateUser: (patch: Partial<SessionUser>) => Promise<void>;
  signOut: () => Promise<void>;
  setPrefs: (patch: Partial<Prefs>) => Promise<void>;
  toggleSaved: (companionId: string) => Promise<void>;
}

const writePrefs = (p: Prefs) => AsyncStorage.setItem(PREFS_KEY, JSON.stringify(p)).catch(() => {});

export const useSession = create<SessionState>((set, get) => ({
  hydrated: false,
  token: null,
  user: null,
  prefs: { saved: [] },

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
    setApiToken(token && user ? token : null);
    set({ hydrated: true, token: token && user ? token : null, user: token ? user : null, prefs });
  },

  async signIn(token, user) {
    setApiToken(token);
    set({ token, user });
    await Promise.all([secure.set(TOKEN_KEY, token), secure.set(USER_KEY, JSON.stringify(user))]);
    if (user.phone) await get().setPrefs({ lastPhone: user.phone });
  },

  async updateUser(patch) {
    const user = get().user;
    if (!user) return;
    const next = { ...user, ...patch };
    set({ user: next });
    await secure.set(USER_KEY, JSON.stringify(next));
  },

  async signOut() {
    setApiToken(null);
    set({ token: null, user: null });
    await Promise.all([secure.remove(TOKEN_KEY), secure.remove(USER_KEY)]);
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
