import { useEffect, useSyncExternalStore } from 'react';
import { useQuery } from '@tanstack/react-query';
import { applyPricing, pricing, subscribePricing, type PricingSettings } from '@/domain/pricing';
import { qk, svc } from '@/services';

/**
 * Loads the live price list (GET /settings/pricing, cached 60 s on the server)
 * and applies it app-wide. Mounted once in the root layout. On error the
 * bundled defaults in src/domain/pricing.ts stay in force.
 */
export function usePricingSync() {
  const q = useQuery({ queryKey: qk.pricing, queryFn: svc.pricing, staleTime: 60_000, refetchInterval: 5 * 60_000, retry: 2 });
  useEffect(() => {
    if (q.data) applyPricing(q.data);
  }, [q.data]);
  return q;
}

/** Re-renders when prices change (after load, or after a superadmin saves new ones). */
export function usePricing(): PricingSettings {
  return useSyncExternalStore(subscribePricing, pricing, pricing);
}
