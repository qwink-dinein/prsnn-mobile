import { useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, GUTTER, space } from '@/theme/tokens';
import { Header, Loading, ErrorState, Card, Pill, Screen, Avatar, Chip, Segmented } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { useConfirm } from '@/components/ui/confirm';
import { AdminBookingRow, InputSheet, KV } from '@/components/admin';
import { can, canActOn, peopleLabel, staffLevel } from '@/domain/admin';
import { ALL_HOURS, hoursLabel } from '@/domain/pricing';
import { displayPhone } from '@/domain/phone';
import type { AdminUser, DayKey, Visibility } from '@/domain/types';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import { useSession } from '@/state/session';

const DAYS: { key: DayKey; label: string }[] = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
];

type Form = Pick<AdminUser, 'fullName' | 'city' | 'area' | 'description' | 'startTime' | 'endTime' | 'profileVisibility'> & { packages: number[]; availability: Partial<Record<DayKey, boolean>> };
const formOf = (u: AdminUser): Form => ({
  fullName: u.fullName ?? '',
  city: u.city ?? '',
  area: u.area ?? '',
  description: u.description ?? '',
  startTime: u.startTime ?? '',
  endTime: u.endTime ?? '',
  profileVisibility: u.profileVisibility ?? 'open',
  packages: u.packages ?? [],
  availability: { ...(u.availability ?? {}) },
});

/** Admin · One user: profile edit, suspend, delete, sub-admin. */
export default function AdminUserDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const me = useSession((s) => s.user);
  const qc = useQueryClient();
  const confirm = useConfirm();
  // Local edits; until the first edit the form shows the server's values.
  const [edit, setForm] = useState<Form | null>(null);
  const [suspending, setSuspending] = useState(false);
  const q = useQuery({ queryKey: qk.admin.user(id), queryFn: () => svc.admin.user(id) });
  const form = edit ?? (q.data ? formOf(q.data.user) : null);

  const act = useMutation({
    mutationFn: async (fn: () => Promise<{ message: string; user?: AdminUser }>) => fn(),
    onSuccess: (r) => {
      setSuspending(false);
      setForm(null);
      if (r.user) qc.setQueryData(qk.admin.user(id), (old: { user: AdminUser } | undefined) => (old ? { ...old, user: r.user! } : old));
      void qc.invalidateQueries({ queryKey: qk.admin.all });
      void confirm({ title: 'Done', message: r.message });
    },
    onError: (e) => confirm({ title: 'Could not do that', message: errorMessage(e) }),
  });

  if (q.isLoading)
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Header title="User" />
        <Loading />
      </SafeAreaView>
    );
  if (q.isError || !q.data || !form)
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Header title="User" />
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      </SafeAreaView>
    );

  const { user: u, bookings } = q.data;
  const self = u.id === me?.id;
  const myStaff = staffLevel(me);
  const theirStaff = staffLevel(u);
  const editable = self || canActOn(myStaff, theirStaff ?? u.role);
  const manageable = canActOn(myStaff, theirStaff ?? u.role, self);
  const isCompanion = u.role === 'companion';
  const set = (p: Partial<Form>) => setForm({ ...form, ...p });

  const changes = (() => {
    const base = formOf(u);
    const out: Partial<Form> = {};
    for (const k of Object.keys(form) as (keyof Form)[]) if (JSON.stringify(form[k]) !== JSON.stringify(base[k])) (out as Record<string, unknown>)[k] = form[k];
    if (!isCompanion) {
      delete out.packages;
      delete out.availability;
      delete out.startTime;
      delete out.endTime;
    }
    return out;
  })();
  const dirty = Object.keys(changes).length > 0;

  return (
    <Screen padded={false} refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}>
      <Header title={u.fullName || 'User'} />
      <View style={{ paddingHorizontal: GUTTER, gap: space.lg, paddingBottom: space.huge }}>
        <View style={styles.head}>
          <Avatar uri={u.profilePhotoUrl} name={u.fullName} size={64} />
          <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
            <View style={styles.row}>
              <Pill label={peopleLabel(u)} tone={theirStaff ? 'success' : 'neutral'} />
              {u.suspended ? <Pill label="Suspended" tone="danger" /> : null}
              {isCompanion ? <Pill label={u.verificationStatus} tone={u.verificationStatus === 'verified' ? 'success' : 'warning'} /> : null}
            </View>
            {u.phone ? (
              <Text variant="footnote" muted>
                {displayPhone(u.phone)}
              </Text>
            ) : null}
            <Text variant="caption" muted>
              Joined {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · push {u.hasPushToken ? 'on' : 'off'}
            </Text>
          </View>
        </View>
        {u.suspended && u.suspendedReason ? <KV k="Suspended for" v={u.suspendedReason} /> : null}
        <Agreements id={u.id} />

        {editable ? (
          <Card style={{ gap: space.md }}>
            <Text variant="headline">Profile</Text>
            <TextField label="Full name" value={form.fullName} onChangeText={(t) => set({ fullName: t })} />
            <View style={styles.row2}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <TextField label="City" value={form.city} onChangeText={(t) => set({ city: t })} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <TextField label="Area" value={form.area} onChangeText={(t) => set({ area: t })} />
              </View>
            </View>
            {isCompanion ? <TextField label="About" value={form.description} onChangeText={(t) => set({ description: t })} multiline /> : null}
            <View style={{ gap: 6 }}>
              <Text variant="subhead" color={colors.gray600}>
                Photo visibility
              </Text>
              <Segmented<Visibility>
                options={[
                  { value: 'open', label: 'Open' },
                  { value: 'locked', label: 'Locked' },
                ]}
                value={form.profileVisibility}
                onChange={(v) => set({ profileVisibility: v })}
              />
            </View>
            {isCompanion ? (
              <>
                <View style={{ gap: 6 }}>
                  <Text variant="subhead" color={colors.gray600}>
                    Packages offered
                  </Text>
                  <View style={styles.chips}>
                    {ALL_HOURS.map((h) => (
                      <Chip key={h} label={hoursLabel(h)} selected={form.packages.includes(h)} onPress={() => set({ packages: form.packages.includes(h) ? form.packages.filter((x) => x !== h) : [...form.packages, h].sort((a, b) => a - b) })} />
                    ))}
                  </View>
                </View>
                <View style={{ gap: 6 }}>
                  <Text variant="subhead" color={colors.gray600}>
                    Available days
                  </Text>
                  <View style={styles.chips}>
                    {DAYS.map((d) => (
                      <Chip key={d.key} label={d.label} selected={!!form.availability[d.key]} onPress={() => set({ availability: { ...form.availability, [d.key]: !form.availability[d.key] } })} />
                    ))}
                  </View>
                </View>
                <View style={styles.row2}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <TextField label="From (HH:MM)" value={form.startTime} onChangeText={(t) => set({ startTime: t })} keyboardType="numbers-and-punctuation" />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <TextField label="Until (HH:MM)" value={form.endTime} onChangeText={(t) => set({ endTime: t })} keyboardType="numbers-and-punctuation" />
                  </View>
                </View>
              </>
            ) : null}
            <Button label="Save changes" disabled={!dirty || (isCompanion && form.packages.length === 0)} loading={act.isPending} onPress={() => act.mutate(() => svc.admin.updateUser(u.id, changes as Partial<AdminUser>))} />
          </Card>
        ) : (
          <Text variant="footnote" muted>
            Only a superadmin can change staff accounts.
          </Text>
        )}

        {manageable ? (
          <View style={{ gap: space.sm }}>
            <Text variant="subhead" color={colors.gray600}>
              Account
            </Text>
            {u.suspended ? (
              <Button label="Restore account" variant="secondary" onPress={async () => (await confirm({ title: 'Restore this account?', message: 'They can log in and be booked again.', confirmLabel: 'Restore' })) && act.mutate(() => svc.admin.suspendUser(u.id, false))} />
            ) : (
              <Button label="Suspend account" variant="danger" onPress={() => setSuspending(true)} />
            )}
            {can(myStaff, 'manageAdmins') && !theirStaff && u.phone ? (
              <Button
                label="Make sub-admin"
                variant="secondary"
                onPress={async () => (await confirm({ title: `Make ${u.fullName || 'this person'} a sub-admin?`, message: 'They can verify companions, edit users and bookings, and answer disputes. They can’t move money, change prices or send broadcasts. Their member or companion account stays as it is.', confirmLabel: 'Make sub-admin' })) && act.mutate(() => svc.admin.addAdmin(u.phone!))}
              />
            ) : null}
            {can(myStaff, 'manageAdmins') && (theirStaff === 'subadmin' || theirStaff === 'admin') ? (
              <Button label="Remove sub-admin" variant="danger" onPress={async () => (await confirm({ title: 'Remove admin access?', message: 'They lose Admin at once. Their member or companion account stays as it is.', confirmLabel: 'Remove', destructive: true })) && act.mutate(() => svc.admin.removeAdmin(u.id))} />
            ) : null}
            <Button
              label="Delete account"
              variant="ghost"
              onPress={async () => {
                if (!(await confirm({ title: `Delete ${u.fullName || 'this account'}?`, message: 'Their profile is removed for good. Bookings and payments stay for accounting. Open paid bookings must be cancelled first.', confirmLabel: 'Delete', destructive: true }))) return;
                act.mutate(async () => {
                  const r = await svc.admin.deleteUser(u.id);
                  router.back();
                  return r;
                });
              }}
            />
          </View>
        ) : null}

        <View style={{ gap: space.sm }}>
          <Text variant="subhead" color={colors.gray600}>
            Recent bookings
          </Text>
          {bookings.length ? (
            bookings.map((b) => <AdminBookingRow key={b._id} b={b} />)
          ) : (
            <Text variant="footnote" muted>
              No bookings yet.
            </Text>
          )}
        </View>
      </View>
      <InputSheet
        visible={suspending}
        title="Suspend account?"
        message="They can’t log in, and companions disappear from search and offers. Existing bookings are not cancelled."
        fields={[{ key: 'reason', label: 'Reason', multiline: true }]}
        confirmLabel="Suspend"
        destructive
        busy={act.isPending}
        onClose={() => setSuspending(false)}
        onSubmit={(v) => act.mutate(() => svc.admin.suspendUser(u.id, true, v.reason))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  consent: { flexDirection: 'row', paddingVertical: 6, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  safe: { flex: 1, backgroundColor: colors.mist },
  head: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  row2: { flexDirection: 'row', gap: space.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
});

const CONSENT_LABEL: Record<string, string> = {
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  age_18: '18 or older',
  whatsapp_updates: 'WhatsApp updates',
  house_rules: 'House rules',
  companion_terms: 'Companion Terms',
  booking_terms: 'Booking terms',
  photo_visibility: 'Photo open to everyone',
  enquiry_contact: 'Website: contact me',
};

/** Every agreement this person gave, with the date, time and policy version (proof of consent). */
function Agreements({ id }: { id: string }) {
  const q = useQuery({ queryKey: qk.admin.userConsents(id), queryFn: () => svc.admin.userConsents(id) });
  return (
    <Card style={{ gap: space.sm }}>
      <Text variant="headline">Agreements</Text>
      {q.isLoading ? (
        <Text variant="footnote" muted>
          Loading…
        </Text>
      ) : q.isError ? (
        <Text variant="footnote" color={colors.danger} onPress={() => void q.refetch()}>
          Couldn’t load agreements. {errorMessage(q.error)} Tap to retry.
        </Text>
      ) : !q.data?.length ? (
        <Text variant="footnote" muted>
          No agreements recorded yet. People who signed up before the consent log are asked again at their next sign-in, booking or application.
        </Text>
      ) : (
        q.data.map((c, i) => (
          <View key={`${c.kind}-${c.acceptedAt}-${i}`} style={styles.consent}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text variant="callout">
                {CONSENT_LABEL[c.kind] ?? c.kind}
                {c.bookingId ? ` · #${c.bookingId.slice(-6).toUpperCase()}` : ''}
              </Text>
              <Text variant="caption" muted>
                {new Date(c.acceptedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })} · v{c.version} · {c.source}
                {c.withdrawnAt ? ' · withdrawn' : ''}
              </Text>
            </View>
          </View>
        ))
      )}
    </Card>
  );
}
