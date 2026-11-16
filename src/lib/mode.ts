import { useMemo } from 'react';
import { router } from 'expo-router';
import { canUseCompanionMode, effectiveMode, modeOfSide, type AppMode } from '@/domain/mode';
import { sideOf, isMineAsCompanion, awaitingAnswer, canChat } from '@/domain/booking';
import type { Booking } from '@/domain/types';
import { useSession } from '@/state/session';
import { useAllMyBookings } from './myBookings';
import { useUnread } from './live';

/** The current mode, whether this person can switch, and a switch that remembers the choice. */
export function useMode() {
  const role = useSession((s) => s.user?.role);
  const saved = useSession((s) => s.prefs.mode);
  const mode = effectiveMode(role, saved);
  return { mode, canSwitch: canUseCompanionMode(role), setMode };
}

/** Switch mode (remembered) and land on that mode's home tab. */
export function setMode(next: AppMode, go: boolean = true) {
  void useSession.getState().setPrefs({ mode: next });
  if (go) router.navigate('/home');
}

/** Switch only if this person can use companion mode (e.g. a notification for the other side). */
export function enterModeFor(next: AppMode | null) {
  if (!next) return;
  const role = useSession.getState().user?.role;
  if (!canUseCompanionMode(role)) return;
  if (useSession.getState().prefs.mode !== next) void useSession.getState().setPrefs({ mode: next });
}

/**
 * My bookings split by mode, plus what's waiting in each: unread chats, and (companion mode) offers
 * still waiting for an answer. Used by the tabs, their badges and the "waiting in the other mode" dot.
 */
export function useModeBookings() {
  const meId = useSession((s) => s.user?.id);
  const q = useAllMyBookings();
  const { perChat, bookings: needYou } = useUnread();
  const split = useMemo(() => {
    const now = new Date();
    const by: Record<AppMode, Booking[]> = { booking: [], companion: [] };
    for (const b of q.data ?? []) by[modeOfSide(sideOf(b, meId))].push(b);
    const chats = (m: AppMode) =>
      by[m].filter((b) => canChat(b) && (m === 'booking' || isMineAsCompanion(b)));
    const unreadIn = (m: AppMode) => chats(m).reduce((n, b) => n + (perChat[b._id] ?? 0), 0);
    const offers = by.companion.filter((b) => awaitingAnswer(b, now)).length;
    return {
      by,
      chats,
      waiting: {
        booking: unreadIn('booking'),
        companion: unreadIn('companion') + offers,
      } as Record<AppMode, number>,
      unreadChats: { booking: unreadIn('booking'), companion: unreadIn('companion') } as Record<AppMode, number>,
      offers,
    };
  }, [q.data, meId, perChat]);
  return { ...q, ...split, needYou };
}
