import { useQuery } from '@tanstack/react-query';
import { mergeBookings } from '@/domain/booking';
import type { Booking } from '@/domain/types';
import { svc, qk } from '@/services';
import { useSession } from '@/state/session';

/**
 * Everything on my plate, as one list. Members: the bookings they made. Companions: the requests they
 * received AND the bookings they made as a member (a companion can book companions too), so neither
 * side's bookings or chats go missing when someone becomes a companion.
 */
export function useAllMyBookings() {
  const isCompanion = useSession((s) => s.user?.role === 'companion');
  const made = useQuery({ queryKey: qk.myBookings, queryFn: svc.myBookings });
  const received = useQuery({ queryKey: qk.incoming, queryFn: svc.incomingBookings, enabled: isCompanion });
  const parts = isCompanion ? [received, made] : [made];
  const data: Booking[] | undefined = parts.some((p) => p.data === undefined && !p.isError) ? undefined : isCompanion ? mergeBookings(received.data, made.data) : made.data;
  const failed = parts.find((p) => p.isError);
  return {
    data,
    isCompanion,
    isLoading: parts.some((p) => p.isLoading),
    isError: !!failed,
    error: failed?.error ?? null,
    isRefetching: parts.some((p) => p.isRefetching),
    refetch: () => Promise.all(parts.map((p) => p.refetch())),
  };
}
