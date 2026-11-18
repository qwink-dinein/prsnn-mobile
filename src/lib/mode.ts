import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { effectiveMode, modeOfSide, modesFor, sideMode, type AppMode, type SideMode } from '@/domain/mode';
import { needsSetup } from '@/domain/setup';
import { staffLevel } from '@/domain/admin';
import { svc, qk } from '@/services';
import { sideOf, isMineAsCompanion, awaitingAnswer, canChat } from '@/domain/booking';
import type { Booking } from '@/domain/types';
import { useSession } from '@/state/session';
import { useAllMyBookings } from './myBookings';
import { useUnread } from './live';

/**
 * The current mode. `mode` is what the tabs show (Booking or Companion; Admin reads as Booking there),
 * `current` is the real choice including Admin, `modes` every mode this person can use.
 */
export function useMode() {
  const role = useSession((s) => s.user?.role);
  const staffRole = useSession((s) => s.user?.staffRole);
  const saved = useSession((s) => s.prefs.mode);
  const who = { role, staffRole };
  const current = effectiveMode(who, saved);
  const modes = modesFor(who);
  return { mode: sideMode(current), current, modes, canSwitch: modes.length > 1, setMode };
}

/**
 * Switch mode (remembered) and land on that mode's home: Admin's overview, or the Home tab.
 * Staff stepping into Booking for the first time answer the member questions first.
 */
export function setMode(next: AppMode, go: boolean = true) {
  void useSession.getState().setPrefs({ mode: next });
  if (!go) return;
  if (next === 'admin') {
    router.navigate('/admin');
    return;
  }
  const user = useSession.getState().user;
  if (staffLevel(user) && needsSetup(user, next)) {
    router.navigate('/setup-profile');
    return;
  }
  router.navigate('/home');
}

/** Switch only if this person can use that mode (e.g. a notification for the other side). */
export function enterModeFor(next: SideMode | null) {
  if (!next) return;
  const user = useSession.getState().user;
  if (!modesFor(user).includes(next)) return;
  if (useSession.getState().prefs.mode !== next) void useSession.getState().setPrefs({ mode: next });
}

/** Staff: how many things wait in Admin (approvals, refunds to decide or failed, open disputes). */
export function useAdminWaiting(): number {
  const staff = useSession((s) => !!staffLevel(s.user));
  const q = useQuery({ queryKey: qk.admin.overview, queryFn: svc.admin.overview, enabled: staff, refetchInterval: 60_000 });
  const o = q.data;
  return o ? o.pendingVerifications + o.refundsToReview + o.failedRefunds + o.openDisputes : 0;
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
    const by: Record<SideMode, Booking[]> = { booking: [], companion: [] };
    for (const b of q.data ?? []) by[modeOfSide(sideOf(b, meId))].push(b);
    const chats = (m: SideMode) =>
      by[m].filter((b) => canChat(b) && (m === 'booking' || isMineAsCompanion(b)));
    const unreadIn = (m: SideMode) => chats(m).reduce((n, b) => n + (perChat[b._id] ?? 0), 0);
    const offers = by.companion.filter((b) => awaitingAnswer(b, now)).length;
    return {
      by,
      chats,
      waiting: {
        booking: unreadIn('booking'),
        companion: unreadIn('companion') + offers,
      } as Record<SideMode, number>,
      unreadChats: { booking: unreadIn('booking'), companion: unreadIn('companion') } as Record<SideMode, number>,
      offers,
    };
  }, [q.data, meId, perChat]);
  return { ...q, ...split, needYou };
}
