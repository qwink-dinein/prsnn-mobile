import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, space } from '@/theme/tokens';
import { Screen, Header, Loading } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { IdentityForm, identityComplete, type IdentityValue } from '@/components/IdentityForm';
import { AreaPicker, CityPicker } from '@/components/PlacePicker';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import { stateOf, type Place } from '@/domain/places';
import type { Profile } from '@/domain/types';
import { useSession } from '@/state/session';

/** Profile → Privacy & preferences: gender, who to see, photo lock (re-consent on change), city/area. */
export default function Privacy() {
  const q = useQuery({ queryKey: qk.profile, queryFn: svc.profile });
  if (q.isLoading) return <Loading />;
  return <PrivacyForm p={q.data} />;
}

function PrivacyForm({ p }: { p?: Profile }) {
  const qc = useQueryClient();
  const user = useSession((s) => s.user);
  const updateUser = useSession((s) => s.updateUser);
  const isCompanion = (p?.role ?? user?.role) === 'companion';
  const initialVis = p?.profileVisibility ?? user?.profileVisibility;
  const [identity, setIdentity] = useState<IdentityValue>({ gender: p?.gender ?? user?.gender, seeGender: p?.seeGender ?? user?.seeGender, visibility: initialVis, consent: !!initialVis });
  const city = p?.city ?? user?.city;
  const [place, setPlace] = useState<Place | null>(city ? { city, state: p?.state ?? stateOf(city) ?? '' } : null);
  const [area, setArea] = useState(p?.area ?? '');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!identityComplete(identity, !isCompanion)) return setError('Choose each option and tick the box to agree to how your profile is shown.');
    setBusy(true);
    setError(null);
    try {
      await svc.updateIdentity({
        gender: identity.gender,
        seeGender: isCompanion ? undefined : identity.seeGender,
        // Only send visibility when it changed: a change needs fresh consent.
        ...(identity.visibility !== initialVis ? { profileVisibility: identity.visibility, visibilityConsent: identity.consent } : {}),
        city: place?.city,
        state: place?.state,
        area: area.trim() || undefined,
      });
      await updateUser({ gender: identity.gender, seeGender: identity.seeGender, profileVisibility: identity.visibility, city: place?.city });
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
    <Screen
      footer={
        <View style={{ gap: space.xs }}>
          {error ? (
            <Text variant="footnote" color={colors.danger} center accessibilityLiveRegion="polite">
              {error}
            </Text>
          ) : null}
          <Button label="Save" onPress={save} loading={busy} />
        </View>
      }
    >
      <Header title="Privacy & preferences" />
      <View style={{ gap: space.xl, marginTop: space.sm }}>
        <IdentityForm value={identity} onChange={setIdentity} showSee={!isCompanion} role={isCompanion ? 'companion' : 'member'} />
        <View style={{ gap: space.lg }}>
          <CityPicker
            value={place}
            onChange={(pl) => {
              setPlace(pl);
              setArea('');
            }}
            hint="Companions are shown from your city first."
          />
          <AreaPicker city={place?.city} value={area} onChange={setArea} />
        </View>
      </View>
    </Screen>
  );
}
