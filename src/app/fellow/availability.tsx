import { useState } from 'react';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, space } from '@/theme/tokens';
import { Screen, Header, Loading } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { AvailabilityEditor, emptyAvailability, WEEK_DAYS, type AvailabilityValue } from '@/components/fellow/AvailabilityEditor';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import type { Profile } from '@/domain/types';

/** Companion availability: days and hours (PUT /profile/update). */
export default function Availability() {
  const q = useQuery({ queryKey: qk.profile, queryFn: svc.profile });
  if (q.isLoading) return <Loading />;
  return <AvailabilityForm p={q.data} />;
}

function initial(p?: Profile): AvailabilityValue {
  const base = emptyAvailability();
  if (!p) return base;
  return {
    days: Object.fromEntries(WEEK_DAYS.map((d) => [d.key, !!p.availability?.[d.key]])) as AvailabilityValue['days'],
    startTime: p.startTime || base.startTime,
    endTime: p.endTime || base.endTime,
  };
}

function AvailabilityForm({ p }: { p?: Profile }) {
  const qc = useQueryClient();
  const [value, setValue] = useState<AvailabilityValue>(() => initial(p));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!Object.values(value.days).some(Boolean)) return setError('Choose at least one day.');
    setBusy(true);
    setError(null);
    try {
      await svc.updateProfile({
        startTime: value.startTime,
        endTime: value.endTime,
        ...Object.fromEntries(Object.entries(value.days).map(([d, on]) => [`${d}_availability`, on])),
      });
      qc.invalidateQueries({ queryKey: qk.profile });
      qc.invalidateQueries({ queryKey: qk.companions });
      router.back();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen footer={<Button label="Save availability" onPress={save} loading={busy} />}>
      <Header title="Availability" />
      <Text variant="callout" muted style={{ marginBottom: space.lg }}>
        Members can only request times inside these hours, between 9 AM and 9 PM.
      </Text>
      <AvailabilityEditor value={value} onChange={setValue} />
      {error ? (
        <Text variant="footnote" color={colors.danger} style={{ marginTop: space.md }}>
          {error}
        </Text>
      ) : null}
    </Screen>
  );
}
