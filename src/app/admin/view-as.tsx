import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Screen, Header, Chip, Segmented, Loading, ErrorState, EmptyState } from '@/components/ui/layout';
import { TextField } from '@/components/ui/forms';
import { UserRow } from '@/components/admin';
import { svc, qk } from '@/services';
import type { AdminUser } from '@/domain/types';
import { Text } from '@/components/ui/Text';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/states';
import { startLivePreview, startPreview, type PreviewAs, type PreviewStart } from '@/lib/preview';
import { errorMessage } from '@/lib/api';

const WHO: { key: PreviewAs; title: string; body: string; icon: IconName }[] = [
  { key: 'member', title: 'A member', body: 'Home, booking, paying, chat, panic.', icon: 'user' },
  { key: 'companion', title: 'A companion', body: 'Sign-up, requests, ID check, earnings.', icon: 'users' },
];
const STARTS: { key: PreviewStart; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'signup', label: 'Sign-up' },
  { key: 'booking', label: 'A booking' },
  { key: 'chat', label: 'Chat' },
];

type Data = 'live' | 'sample';
const DATA: { value: Data; label: string }[] = [
  { value: 'live', label: 'Live data' },
  { value: 'sample', label: 'Sample data' },
];

/**
 * Admin · View the app as a member or companion. Live data: pick a real person and see exactly what
 * they see, read-only (chats stay private). Sample data: try every flow without touching anyone.
 */
export default function ViewAs() {
  const qc = useQueryClient();
  const [data, setData] = useState<Data>('live');
  const [as, setAs] = useState<PreviewAs>('member');
  const [start, setStart] = useState<PreviewStart>('home');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setSearch(text.trim()), 300);
    return () => clearTimeout(t);
  }, [text]);
  const role = as === 'companion' ? 'companion' : 'user';
  const people = useQuery({ queryKey: qk.admin.users(search, role), queryFn: () => svc.admin.users({ q: search, role }), enabled: data === 'live' });

  const open = async () => {
    setBusy(true);
    setError(null);
    try {
      await startPreview(qc, as, start);
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  };
  const openAs = async (u: AdminUser) => {
    setBusy(true);
    setError(null);
    try {
      await startLivePreview(qc, u);
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <Screen footer={data === 'sample' ? <Button label="Open preview" iconRight="arrowRight" loading={busy} onPress={open} /> : undefined}>
      <Header title="View the app as…" />
      <View style={{ marginBottom: space.md }}>
        <Segmented options={DATA} value={data} onChange={(v) => { setData(v); setError(null); }} />
      </View>
      <Text variant="callout" muted style={{ marginBottom: space.lg }}>
        {data === 'live'
          ? 'Pick a real person to see the app exactly as they do, with live data. Read-only: nothing can be changed, and chats stay private.'
          : 'The real screens with sample data. Nothing reaches real people: no payments, notifications or WhatsApp.'}
      </Text>
      <View style={{ gap: space.md }} accessibilityRole="radiogroup">
        {WHO.map((w) => {
          const on = as === w.key;
          return (
            <Pressable key={w.key} accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={() => setAs(w.key)} style={[styles.option, on && styles.optionOn]}>
              <View style={styles.icon}>
                <Icon name={w.icon} size={20} color={colors.champagneDeep} />
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <Text variant="headline">{w.title}</Text>
                <Text variant="footnote" muted>
                  {w.body}
                </Text>
              </View>
              <View style={[styles.radio, on && styles.radioOn]}>{on ? <View style={styles.radioDot} /> : null}</View>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <View style={{ marginTop: space.md }}>
          <Notice tone="danger" text={error} />
        </View>
      ) : null}
      {data === 'live' ? (
        <>
          <Text variant="headline" style={{ marginTop: space.xl, marginBottom: space.sm }}>
            {as === 'companion' ? 'Which companion?' : 'Which member?'}
          </Text>
          <TextField icon="search" placeholder="Name, phone or city" value={text} onChangeText={setText} autoCorrect={false} autoCapitalize="none" returnKeyType="search" />
          <View style={{ marginTop: space.md, gap: space.sm }}>
            {busy ? (
              <Loading />
            ) : people.isLoading ? (
              <Loading />
            ) : people.isError ? (
              <ErrorState message={errorMessage(people.error)} onRetry={() => people.refetch()} />
            ) : (people.data ?? []).length === 0 ? (
              <EmptyState icon="users" title={search ? 'No one matches' : as === 'companion' ? 'No companions yet' : 'No members yet'} body={search ? 'Try part of the name or the last 4 digits of the phone.' : undefined} />
            ) : (
              (people.data ?? []).slice(0, 30).map((u) => <UserRow key={u.id} u={u} onPress={() => void openAs(u)} />)
            )}
          </View>
          <View style={{ marginTop: space.xl }}>
            <Notice tone="info" text="Each live preview is written to the activity log with the person’s name." />
          </View>
        </>
      ) : (
        <>
          <Text variant="headline" style={{ marginTop: space.xl, marginBottom: space.sm }}>
            Start at
          </Text>
          <View style={styles.chips}>
            {STARTS.map((s) => (
              <Chip key={s.key} label={s.label} selected={start === s.key} onPress={() => setStart(s.key)} />
            ))}
          </View>
          <View style={{ marginTop: space.xl }}>
            <Notice tone="info" text="Each preview is written to the activity log. Switch member ↔ companion from the preview’s Profile tab." />
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  option: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.xl, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  optionOn: { borderColor: colors.champagne, borderWidth: 2, backgroundColor: colors.champagneMist },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.champagneMist, alignItems: 'center', justifyContent: 'center' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.gray300, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.midnight },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.midnight },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
});
