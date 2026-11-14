import { useState } from 'react';
import { FlatList, Modal, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { Header, Loading, ErrorState, EmptyState, Card, Pill, Screen, Avatar } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { useConfirm } from '@/components/ui/confirm';
import { InputSheet, KV, adminWhen, rupeeField, type InputField } from '@/components/admin';
import { adminBookingState, can, personId, personName, refundableAmount, roleLabel } from '@/domain/admin';
import { durationLabel, formatINR } from '@/domain/booking';
import type { AdminBooking, AdminUser } from '@/domain/types';
import { ago } from '@/domain/time';
import { displayPhone } from '@/domain/phone';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import { useSession } from '@/state/session';

type Sheet = null | 'reschedule' | 'cancel' | 'refund' | 'fee' | 'reply' | 'close';

/** Admin · Booking detail: everything about one booking, and the actions this role may take. */
export default function AdminBookingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const role = useSession((s) => s.user?.role);
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [picking, setPicking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const q = useQuery({ queryKey: qk.admin.booking(id), queryFn: () => svc.admin.booking(id) });
  const chat = useQuery({ queryKey: qk.admin.messages(id), queryFn: () => svc.admin.bookingMessages(id), enabled: showChat });

  const act = useMutation({
    mutationFn: async (fn: () => Promise<{ message: string; booking?: AdminBooking }>) => fn(),
    onSuccess: (r) => {
      setSheet(null);
      setPicking(false);
      if (r.booking) qc.setQueryData(qk.admin.booking(id), r.booking);
      void qc.invalidateQueries({ queryKey: qk.admin.all });
      void confirm({ title: 'Done', message: r.message });
    },
    onError: (e) => confirm({ title: 'Could not do that', message: errorMessage(e) }),
  });

  if (q.isLoading) return <Wrap><Loading /></Wrap>;
  if (q.isError || !q.data) return <Wrap><ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} /></Wrap>;
  const b = q.data;
  const s = adminBookingState(b);
  const open = ['pending', 'accepted'].includes(b.status);
  const paid = b.paymentStatus === 'paid';
  const refundable = refundableAmount(b);
  const hasDispute = !!b.dispute && b.dispute.status !== 'none';

  const ask = async (title: string, message: string, label: string, fn: () => Promise<{ message: string; booking?: AdminBooking }>, destructive = false) => {
    if (await confirm({ title, message, confirmLabel: label, destructive })) act.mutate(fn);
  };

  const sheets: Record<Exclude<Sheet, null>, { title: string; message?: string; fields: InputField[]; label: string; destructive?: boolean; run: (v: Record<string, string>) => Promise<{ message: string; booking?: AdminBooking }> }> = {
    reschedule: {
      title: 'Change date or time',
      message: 'Both people get a notification. Price and payment don’t change.',
      fields: [
        { key: 'date', label: 'Date (YYYY-MM-DD)', initial: b.scheduledDate.slice(0, 10), validate: (v) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? null : 'Use YYYY-MM-DD.') },
        { key: 'time', label: 'Start time (HH:MM)', initial: b.startTime, validate: (v) => (/^([01]\d|2[0-3]):[0-5]\d$/.test(v) ? null : 'Use HH:MM, 24-hour.') },
      ],
      label: 'Save',
      run: (v) => svc.admin.updateBooking(b._id, { scheduledDate: v.date, startTime: v.time }),
    },
    cancel: {
      title: `Cancel #${b.ref}?`,
      message: paid
        ? can(role, 'refund')
          ? `Paid ${formatINR(b.amountPaid ?? 0)}. Enter how much to refund now (0 for none).`
          : 'This booking is paid. No money moves now: a superadmin will decide the refund.'
        : 'Nothing has been paid.',
      fields: [{ key: 'reason', label: 'Reason', placeholder: 'Shown in the activity log', multiline: true }, ...(paid && can(role, 'refund') ? [rupeeField(b.amountPaid ?? 0, 'Refund now (₹)', b.amountPaid ?? 0)] : [])],
      label: 'Cancel booking',
      destructive: true,
      run: (v) => svc.admin.cancelBooking(b._id, v.reason, paid && can(role, 'refund') ? Number(v.amount) : undefined),
    },
    refund: {
      title: 'Refund',
      message: `Paid ${formatINR(b.amountPaid ?? 0)}. One refund per booking; it goes to the original payment method.`,
      fields: [rupeeField(refundable, 'Amount (₹)', refundable), { key: 'reason', label: 'Reason', multiline: true }],
      label: 'Refund',
      destructive: true,
      run: (v) => svc.admin.refund(b._id, Number(v.amount), v.reason),
    },
    fee: {
      title: 'Cancellation fee',
      message: `prsnn keeps this amount; the rest (of ${formatINR(b.amountPaid ?? 0)}) is refunded now.`,
      fields: [rupeeField(b.amountPaid ?? 0, 'Fee kept (₹)', b.refund?.retained ?? 0)],
      label: 'Set fee and refund',
      destructive: true,
      run: (v) => svc.admin.overrideFee(b._id, Number(v.amount)),
    },
    reply: {
      title: 'Reply to both people',
      message: 'Sent as an in-app notification from prsnn support.',
      fields: [{ key: 'message', label: 'Message', multiline: true }],
      label: 'Send',
      run: (v) => svc.admin.replyDispute(b._id, v.message),
    },
    close: {
      title: 'Close dispute',
      message: 'Both people see how it was resolved. Refund separately if needed.',
      fields: [{ key: 'resolution', label: 'Resolution', multiline: true }],
      label: 'Close dispute',
      run: (v) => svc.admin.closeDispute(b._id, v.resolution),
    },
  };
  const cur = sheet ? sheets[sheet] : null;

  return (
    <Screen padded={false} refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}>
      <Header title={`Booking #${b.ref}`} />
      <View style={{ paddingHorizontal: GUTTER, gap: space.lg, paddingBottom: space.huge }}>
        <Card style={{ gap: space.xs }}>
          <View style={styles.row}>
            <Pill label={s.label} tone={s.tone} />
            <Pill label={b.flow === 'prepaid' ? 'App (prepaid)' : 'Website'} />
          </View>
          <KV k="When" v={adminWhen(b)} />
          <KV k="Length" v={durationLabel(b.duration)} />
          <KV k="Member" v={<PersonLink p={b.requesterId} />} />
          <KV k="Companion" v={b.companionId ? <PersonLink p={b.companionId} /> : `Not assigned${b.preferredCompanionId ? ` (asked for ${personName(b.preferredCompanionId)})` : ''}`} />
          <KV k="Place" v={[b.area, b.city].filter(Boolean).join(', ')} />
          <KV k="Note" v={b.message} />
          <KV k="Price" v={formatINR(b.packagePrice ?? 0)} />
          <KV k="Payment" v={`${b.paymentStatus}${b.paymentMode ? ` (${b.paymentMode})` : ''}${paid || b.paymentStatus === 'refunded' ? ` · ${formatINR(b.amountPaid ?? 0)}` : ''}`} />
          {b.companionShare != null ? <KV k="Payout" v={`${formatINR(b.companionShare)} companion · ${formatINR(b.platformShare ?? 0)} prsnn`} /> : null}
          {b.refund && b.refund.status !== 'none' ? <KV k="Refund" v={`${b.refund.status} · ${formatINR(b.refund.amount)}${b.refund.retained ? ` (fee ${formatINR(b.refund.retained)})` : ''}${b.refund.reason ? ` · ${b.refund.reason}` : ''}`} /> : null}
          {b.refundReview?.needed ? <KV k="Refund review" v={`Needed: ${b.refundReview.note ?? ''}`} /> : null}
          {b.status === 'cancelled' ? <KV k="Cancelled" v={`by ${b.cancelledBy ?? '—'}${b.cancelReason ? ` · ${b.cancelReason}` : ''}`} /> : null}
          {b.offers?.length ? <KV k="Offers" v={b.offers.map((o) => `${personName(o.companionId)}: ${o.status}`).join('\n')} /> : null}
        </Card>

        {hasDispute ? (
          <Card style={{ gap: space.sm }}>
            <View style={styles.row}>
              <Text variant="headline">Dispute</Text>
              <Pill label={b.dispute!.status === 'open' ? 'Open' : 'Resolved'} tone={b.dispute!.status === 'open' ? 'danger' : 'success'} />
            </View>
            <Text variant="callout">{b.dispute!.reason}</Text>
            <Text variant="caption" muted>
              Reported by {personName(b.dispute!.openedBy as never, 'a party')}{b.dispute!.openedAt ? ` · ${ago(b.dispute!.openedAt)}` : ''}
            </Text>
            {(b.dispute!.notes ?? []).map((n, i) => (
              <View key={i} style={styles.note}>
                <Text variant="caption" muted>
                  {roleLabel(n.role)} · {ago(n.at)}
                </Text>
                <Text variant="callout">{n.message}</Text>
              </View>
            ))}
            {b.dispute!.resolution ? <KV k="Resolution" v={b.dispute!.resolution} /> : null}
            <View style={styles.actions}>
              <Button label={showChat ? 'Hide chat' : 'View chat'} variant="secondary" compact style={{ flex: 1 }} onPress={() => setShowChat((v) => !v)} />
              {b.dispute!.status === 'open' ? <Button label="Reply" compact style={{ flex: 1 }} onPress={() => setSheet('reply')} /> : null}
            </View>
            {b.dispute!.status === 'open' ? <Button label="Close dispute" variant="ghost" compact onPress={() => setSheet('close')} /> : null}
            {showChat ? (
              chat.isLoading ? (
                <Loading />
              ) : chat.isError ? (
                <ErrorState message={errorMessage(chat.error)} onRetry={() => chat.refetch()} />
              ) : chat.data?.length ? (
                <View style={{ gap: space.xs }}>
                  {chat.data.map((m) => (
                    <View key={m._id} style={styles.note}>
                      <Text variant="caption" muted>
                        {m.senderName || 'Someone'} · {ago(m.createdAt)}
                      </Text>
                      <Text variant="callout">{m.content}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text variant="footnote" muted>
                  No messages in this booking’s chat.
                </Text>
              )
            ) : null}
          </Card>
        ) : null}

        <View style={{ gap: space.sm }}>
          <Text variant="subhead" color={colors.gray600}>
            Actions
          </Text>
          {open ? <Button label="Change date or time" variant="secondary" onPress={() => setSheet('reschedule')} /> : null}
          {open && (b.flow !== 'prepaid' || paid) ? <Button label="Reassign companion" variant="secondary" onPress={() => setPicking(true)} /> : null}
          {b.status === 'accepted' ? (
            <Button label="Mark completed" variant="secondary" onPress={() => ask('Mark completed?', 'Use this when the session took place.', 'Mark completed', () => svc.admin.updateBooking(b._id, { status: 'completed' }))} />
          ) : null}
          {open ? <Button label="Cancel booking" variant="danger" onPress={() => setSheet('cancel')} /> : null}

          {can(role, 'refund') ? (
            <>
              {refundable > 0 ? <Button label={`Refund (up to ${formatINR(refundable)})`} variant="danger" onPress={() => setSheet('refund')} /> : null}
              {b.refund?.status === 'failed' && can(role, 'retryRefund') ? <Button label="Retry failed refund" onPress={() => ask('Retry refund?', `${formatINR(b.refund!.amount)} to the original payment method.`, 'Retry', () => svc.admin.retryRefund(b._id))} /> : null}
              {b.status === 'cancelled' && paid && refundable > 0 && can(role, 'overrideFee') ? <Button label="Set cancellation fee" variant="secondary" onPress={() => setSheet('fee')} /> : null}
              {b.paymentStatus !== 'paid' && b.paymentStatus !== 'refunded' && open && can(role, 'markPaid') ? (
                <Button label="Mark paid (simulated)" variant="secondary" onPress={() => ask('Mark paid?', `Records ${formatINR(b.packagePrice ?? 0)} as paid without Razorpay. A prepaid booking starts offering companions.`, 'Mark paid', () => svc.admin.markPaid(b._id))} />
              ) : null}
              {can(role, 'deleteBooking') && !open ? (
                <Button
                  label="Delete booking"
                  variant="ghost"
                  onPress={async () => {
                    if (await confirm({ title: `Delete #${b.ref}?`, message: 'The booking and its chat are removed for good. The activity log keeps a record.', confirmLabel: 'Delete', destructive: true })) {
                      act.mutate(async () => {
                        const r = await svc.admin.deleteBooking(b._id);
                        router.back();
                        return r;
                      });
                    }
                  }}
                />
              ) : null}
            </>
          ) : paid ? (
            <Text variant="footnote" muted>
              Refunds and fees are handled by a superadmin.
            </Text>
          ) : null}
        </View>
      </View>

      {cur ? (
        <InputSheet visible title={cur.title} message={cur.message} fields={cur.fields} confirmLabel={cur.label} destructive={cur.destructive} busy={act.isPending} onClose={() => setSheet(null)} onSubmit={(v) => act.mutate(() => cur.run(v))} />
      ) : null}
      <CompanionPicker
        visible={picking}
        exclude={personId(b.companionId)}
        onClose={() => setPicking(false)}
        onPick={(c) => ask(`Give #${b.ref} to ${c.fullName}?`, 'The amount paid and the 80/20 split stay the same. Everyone is notified.', 'Reassign', () => svc.admin.reassignBooking(b._id, c.id))}
      />
    </Screen>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.mist }} edges={['top']}>
      <Header title="Booking" />
      {children}
    </SafeAreaView>
  );
}

function PersonLink({ p }: { p: AdminBooking['requesterId'] | null | undefined }) {
  const id = personId(p);
  return (
    <Text variant="callout" color={colors.moss} accessibilityRole="link" onPress={id ? () => router.push(`/admin/user/${id}`) : undefined}>
      {personName(p)}
      {p && typeof p === 'object' && p.phone ? `  ·  ${displayPhone(p.phone)}` : ''}
    </Text>
  );
}

/** Search verified companions to reassign a booking to. */
function CompanionPicker({ visible, exclude, onClose, onPick }: { visible: boolean; exclude?: string; onClose: () => void; onPick: (c: AdminUser) => void }) {
  const [text, setText] = useState('');
  const q = useQuery({ queryKey: qk.admin.users(text, 'companion'), queryFn: () => svc.admin.users({ q: text, role: 'companion' }), enabled: visible });
  const list = (q.data ?? []).filter((c) => c.verificationStatus === 'verified' && !c.suspended && c.id !== exclude);
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.mist }}>
        <Header title="Choose companion" onBack={onClose} />
        <View style={{ paddingHorizontal: GUTTER }}>
          <TextField icon="search" placeholder="Name, phone or city" value={text} onChangeText={setText} autoCorrect={false} />
        </View>
        {q.isLoading ? (
          <Loading />
        ) : q.isError ? (
          <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
        ) : (
          <FlatList
            data={list}
            keyExtractor={(c) => c.id}
            contentContainerStyle={{ padding: GUTTER, gap: space.sm }}
            ListEmptyComponent={<EmptyState icon="users" title="No match" body="Only active, verified companions can take a booking." />}
            renderItem={({ item: c }) => (
              <Pressable accessibilityRole="button" accessibilityLabel={`Choose ${c.fullName}`} onPress={() => onPick(c)} style={({ pressed }) => [styles.pick, pressed && { opacity: 0.8 }]}>
                <Avatar uri={c.profilePhotoUrl} name={c.fullName} size={40} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text variant="headline">{c.fullName}</Text>
                  <Text variant="footnote" muted>
                    {[c.area, c.city].filter(Boolean).join(', ')}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  actions: { flexDirection: 'row', gap: space.sm },
  note: { padding: space.md, borderRadius: radius.md, backgroundColor: colors.green50, gap: 2, borderWidth: 1, borderColor: colors.line },
  pick: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
});
