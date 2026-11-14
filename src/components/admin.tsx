import { useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View, type KeyboardTypeOptions } from 'react-native';
import { Redirect, router } from 'expo-router';
import { colors, radius, space } from '@/theme/tokens';
import { Text } from './ui/Text';
import { Icon, type IconName } from './ui/Icon';
import { Avatar, Card, Pill } from './ui/layout';
import { Button } from './ui/Button';
import { TextField } from './ui/forms';
import { formatDate } from './bookings';
import { durationLabel, endTimeOf, formatINR, formatTime } from '@/domain/booking';
import { adminBookingState, isStaff, isSuperadmin, personName, roleLabel } from '@/domain/admin';
import type { AdminBooking, AdminUser } from '@/domain/types';
import { useSession } from '@/state/session';
import { displayPhone } from '@/domain/phone';

/** Only staff (or only superadmins) see admin screens. The server checks again on every call. */
export function AdminGate({ superOnly, children }: { superOnly?: boolean; children: ReactNode }) {
  const role = useSession((s) => s.user?.role);
  if (!isStaff(role)) return <Redirect href="/" />;
  if (superOnly && !isSuperadmin(role)) return <Redirect href="/admin" />;
  return <>{children}</>;
}

export const adminWhen = (b: Pick<AdminBooking, 'scheduledDate' | 'startTime' | 'duration'>) =>
  `${formatDate(b.scheduledDate)} · ${formatTime(b.startTime)} – ${formatTime(endTimeOf(b.startTime, b.duration))}`;

/** Big number + label, tappable. */
export function StatTile({ label, value, icon, onPress, tone = 'neutral' }: { label: string; value: string | number; icon: IconName; onPress?: () => void; tone?: 'neutral' | 'warning' | 'danger' }) {
  const fg = tone === 'danger' ? colors.danger : tone === 'warning' ? colors.clay : colors.moss;
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${label}: ${value}`}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && onPress ? { opacity: 0.85 } : null]}
    >
      <Icon name={icon} size={18} color={fg} />
      <Text variant="title2" color={fg}>
        {value}
      </Text>
      <Text variant="footnote" muted numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

export function AdminBookingRow({ b, onPress }: { b: AdminBooking; onPress?: () => void }) {
  const s = adminBookingState(b);
  const companion = b.companionId ?? b.preferredCompanionId;
  return (
    <Card onPress={onPress ?? (() => router.push(`/admin/booking/${b._id}`))} accessibilityLabel={`Booking ${b.ref}, ${s.label}`} style={{ gap: space.sm, padding: space.md }}>
      <View style={styles.rowTop}>
        <Text variant="headline">#{b.ref}</Text>
        <Pill label={s.label} tone={s.tone} />
        <View style={{ flex: 1 }} />
        <Text variant="subhead">{formatINR(b.amountPaid || b.packagePrice || 0)}</Text>
      </View>
      <Text variant="footnote" muted numberOfLines={1}>
        {personName(b.requesterId, typeof b.requesterId === 'string' ? 'Deleted account' : 'Member')} →{' '}
        {personName(companion, companion ? 'Deleted account' : 'Finding companion')}
      </Text>
      <Text variant="footnote" muted>
        {adminWhen(b)} · {durationLabel(b.duration)}
      </Text>
    </Card>
  );
}

export function UserRow({ u, onPress }: { u: AdminUser; onPress?: () => void }) {
  return (
    <Card onPress={onPress ?? (() => router.push(`/admin/user/${u.id}`))} accessibilityLabel={`${u.fullName || 'No name'}, ${roleLabel(u.role)}${u.suspended ? ', suspended' : ''}`} style={styles.userRow}>
      <Avatar uri={u.profilePhotoUrl} name={u.fullName} size={44} />
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text variant="headline" numberOfLines={1}>
          {u.fullName || 'No name yet'}
        </Text>
        <Text variant="footnote" muted numberOfLines={1}>
          {[roleLabel(u.role), u.phone ? displayPhone(u.phone) : null, u.city].filter(Boolean).join(' · ')}
        </Text>
      </View>
      {u.suspended ? <Pill label="Suspended" tone="danger" /> : u.role === 'companion' && u.verificationStatus !== 'verified' ? <Pill label={u.verificationStatus === 'pending' ? 'To verify' : u.verificationStatus === 'id_required' ? 'Live · no ID yet' : u.verificationStatus === 'rejected' ? 'ID rejected' : u.verificationStatus} tone={u.verificationStatus === 'rejected' ? 'danger' : 'warning'} /> : null}
    </Card>
  );
}

/** Label / value line for detail screens. */
export function KV({ k, v }: { k: string; v?: ReactNode }) {
  if (v === undefined || v === null || v === '') return null;
  return (
    <View style={styles.kv}>
      <Text variant="footnote" muted style={{ width: 96 }}>
        {k}
      </Text>
      {typeof v === 'string' || typeof v === 'number' ? (
        <Text variant="callout" style={{ flex: 1 }}>
          {v}
        </Text>
      ) : (
        <View style={{ flex: 1, minWidth: 0 }}>{v}</View>
      )}
    </View>
  );
}

export interface InputField {
  key: string;
  label: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  initial?: string;
  /** Return an error message, or null when valid. */
  validate?: (v: string) => string | null;
}

/**
 * A small form in a sheet (reason, amount, new time…). Used where the plain
 * confirm sheet isn't enough. Calls onSubmit with the values by key.
 */
export function InputSheet(props: {
  visible: boolean;
  title: string;
  message?: string;
  fields: InputField[];
  confirmLabel: string;
  destructive?: boolean;
  busy?: boolean;
  onSubmit: (values: Record<string, string>) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={props.visible} transparent animationType="fade" onRequestClose={props.onClose}>
      <Pressable style={styles.backdrop} onPress={props.onClose} accessibilityLabel="Dismiss" />
      <View style={styles.sheetWrap} pointerEvents="box-none">
        {/* Mounted only while open, so every opening starts from the fields' initial values. */}
        {props.visible ? <SheetBody {...props} /> : null}
      </View>
    </Modal>
  );
}

function SheetBody({ title, message, fields, confirmLabel, destructive, busy, onSubmit, onClose }: Parameters<typeof InputSheet>[0]) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.key, f.initial ?? ''])));
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const submit = () => {
    const errs = Object.fromEntries(fields.map((f) => [f.key, f.validate ? f.validate((values[f.key] ?? '').trim()) : (values[f.key] ?? '').trim() ? null : `Enter ${f.label.toLowerCase()}.`]));
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    onSubmit(Object.fromEntries(fields.map((f) => [f.key, (values[f.key] ?? '').trim()])));
  };

  return (
    <View style={styles.sheet} accessibilityViewIsModal>
      <Text variant="title3">{title}</Text>
      {message ? (
        <Text variant="callout" muted>
          {message}
        </Text>
      ) : null}
      {fields.map((f) => (
        <TextField
          key={f.key}
          label={f.label}
          placeholder={f.placeholder}
          keyboardType={f.keyboardType}
          multiline={f.multiline}
          value={values[f.key] ?? ''}
          onChangeText={(t) => setValues((v) => ({ ...v, [f.key]: t }))}
          error={errors[f.key]}
        />
      ))}
      <View style={{ gap: space.sm, marginTop: space.sm }}>
        <Button label={confirmLabel} variant={destructive ? 'danger' : 'primary'} loading={busy} onPress={submit} />
        <Button label="Cancel" variant="ghost" onPress={onClose} />
      </View>
    </View>
  );
}

export const rupeeField = (max: number, label = 'Amount (₹)', initial?: number): InputField => ({
  key: 'amount',
  label,
  keyboardType: 'number-pad',
  initial: initial !== undefined ? String(initial) : undefined,
  validate: (v) => {
    const n = Number(v);
    if (!v || !Number.isFinite(n)) return 'Enter an amount in rupees.';
    if (n < 0 || n > max) return `Between ₹0 and ₹${max}.`;
    return null;
  },
});

const styles = StyleSheet.create({
  tile: { flexBasis: '47%', flexGrow: 1, gap: 2, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, minHeight: 96 },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md },
  kv: { flexDirection: 'row', gap: space.md, paddingVertical: 6 },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(24,27,52,0.4)' },
  sheetWrap: { flex: 1, justifyContent: 'center', padding: space.xl },
  sheet: { backgroundColor: colors.paper, borderRadius: radius.xl, padding: space.xl, gap: space.md, maxWidth: 460, width: '100%', alignSelf: 'center' },
});
