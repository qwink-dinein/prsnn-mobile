import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import { isSampleMode, qk, svc, type UnreadCounts } from '@/services';
import { useSession } from '@/state/session';

/** Runs `fn` whenever the app comes back to the foreground. */
function useOnForeground(fn: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const sub = AppState.addEventListener('change', (s) => s === 'active' && fn());
    return () => sub.remove();
  }, [fn, enabled]);
}

/**
 * The signed-in person's profile, kept current. Anything staff change (ID approved, profile or
 * photo approved, suspended, made a sub-admin) reaches the phone within seconds through Realtime
 * on the person's own profiles row, plus a refresh on foreground and every minute. Every fresh
 * copy is written into the session store, so no screen ever works from the login-time copy and
 * nobody has to log out and back in. Mounted once in the root layout.
 */
export function useLiveMe() {
  const qc = useQueryClient();
  const userId = useSession((s) => s.user?.id);
  const token = useSession((s) => s.token);
  const on = !!token && !!userId;
  const q = useQuery({ queryKey: qk.me, queryFn: svc.me, enabled: on, refetchInterval: 60_000, staleTime: 15_000 });

  useEffect(() => {
    if (!q.data || !on) return;
    const cur = useSession.getState().user;
    if (cur && cur.id === q.data.id) void useSession.getState().updateUser({ ...q.data, hasPin: cur.hasPin ?? q.data.hasPin });
  }, [q.data, on]);

  useOnForeground(() => void qc.invalidateQueries({ queryKey: qk.me }), on);

  useEffect(() => {
    if (!on || isSampleMode()) return;
    const ch = supabase
      .channel(`me:${userId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` }, () => {
        void qc.invalidateQueries({ queryKey: qk.me });
        void qc.invalidateQueries({ queryKey: qk.profileCheck });
        void qc.invalidateQueries({ queryKey: ['bookings'] });
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [on, userId, qc]);
}

/** Fetch "me" right now (after an action that changes it) and return it. */
export async function refreshMe(qc: ReturnType<typeof useQueryClient>) {
  const fresh = await qc.fetchQuery({ queryKey: qk.me, queryFn: svc.me, staleTime: 0 });
  const cur = useSession.getState().user;
  if (cur && fresh && cur.id === fresh.id) await useSession.getState().updateUser({ ...fresh, hasPin: cur.hasPin ?? fresh.hasPin });
  return fresh;
}

const EMPTY: UnreadCounts = { notifications: 0, messages: 0, perChat: {}, bookings: 0 };

/**
 * Live badge numbers (bell, Messages, Bookings/Requests). Realtime events on notifications,
 * messages, offers and bookings trigger a recount; foreground and a 60 s timer back it up.
 * Mount once (root layout); read anywhere with useUnread().
 */
export function useLiveUnread() {
  const qc = useQueryClient();
  const userId = useSession((s) => s.user?.id);
  const token = useSession((s) => s.token);
  const on = !!token && !!userId;
  useQuery({ queryKey: qk.unread, queryFn: svc.unreadCounts, enabled: on, refetchInterval: 60_000, staleTime: 5_000 });
  useOnForeground(() => void qc.invalidateQueries({ queryKey: qk.unread }), on);

  useEffect(() => {
    if (!on || isSampleMode()) return;
    let t: ReturnType<typeof setTimeout> | null = null;
    // Bursts of events (a booking changes several rows at once) give one recount.
    const recount = () => {
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        void qc.invalidateQueries({ queryKey: qk.unread });
        void qc.invalidateQueries({ queryKey: qk.notifications });
      }, 400);
    };
    const ch = supabase
      .channel(`badges:${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, recount)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, recount)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'booking_offers', filter: `companion_id=eq.${userId}` }, () => {
        recount();
        void qc.invalidateQueries({ queryKey: qk.incoming });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `requester_id=eq.${userId}` }, () => {
        recount();
        void qc.invalidateQueries({ queryKey: qk.myBookings });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `companion_id=eq.${userId}` }, () => {
        recount();
        void qc.invalidateQueries({ queryKey: qk.incoming });
      })
      .subscribe();
    return () => {
      if (t) clearTimeout(t);
      void supabase.removeChannel(ch);
    };
  }, [on, userId, qc]);
}

/** The current badge numbers (0s until loaded or when signed out). */
export function useUnread(): UnreadCounts {
  const token = useSession((s) => s.token);
  const q = useQuery({ queryKey: qk.unread, queryFn: svc.unreadCounts, enabled: !!token, staleTime: 5_000 });
  return q.data ?? EMPTY;
}

/** "9+" style label for a badge; null hides it. */
export const badgeLabel = (n: number) => (n <= 0 ? null : n > 9 ? '9+' : String(n));
