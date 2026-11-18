import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, space } from '@/theme/tokens';
import { REPORT_REASONS, REPORT_DETAILS_MAX, reportError, type ReportReason } from '@/domain/safety';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { Button } from './ui/Button';
import { IconButton } from './ui/layout';
import { TextField } from './ui/forms';
import { Notice } from './ui/states';
import { useConfirm } from './ui/confirm';

type Person = { id: string; name: string };

/**
 * "⋯" next to a person (companion profile, chat): Report or Block them. Apple requires both in apps with
 * chat (Guideline 1.2). A block works both ways: hidden from each other, never matched, no messages.
 */
export function SafetyMenu({ person, bookingId, onBlocked, color = colors.ink, style }: { person: Person; bookingId?: string; onBlocked?: () => void; color?: string; style?: object }) {
  const [menu, setMenu] = useState(false);
  const [reporting, setReporting] = useState(false);
  const insets = useSafeAreaInsets();
  const confirm = useConfirm();
  const qc = useQueryClient();
  const block = useMutation({
    mutationFn: () => svc.blockUser(person.id),
    onSuccess: async (r) => {
      await qc.invalidateQueries({ queryKey: qk.blocks });
      await qc.invalidateQueries({ queryKey: qk.companions });
      await confirm({ title: 'Blocked', message: r.message });
      onBlocked?.();
    },
    onError: (e) => void confirm({ title: 'Couldn’t block', message: errorMessage(e) }),
  });

  const askBlock = async () => {
    setMenu(false);
    const ok = await confirm({
      title: `Block ${person.name}?`,
      message: `You won’t see each other, you won’t be matched, and neither of you can message the other. ${person.name} isn’t told. A booking you’ve already paid for isn’t cancelled; cancel it from the booking if you need to. You can unblock any time in Profile → Blocked people.`,
      confirmLabel: 'Block',
      destructive: true,
    });
    if (ok) block.mutate();
  };

  return (
    <>
      <IconButton name="dots" label={`More options for ${person.name}: report or block`} onPress={() => setMenu(true)} color={color} style={style} />
      <Modal visible={menu} transparent animationType="fade" onRequestClose={() => setMenu(false)}>
        <Pressable style={styles.backdrop} onPress={() => setMenu(false)} accessibilityLabel="Close" />
        <View style={[styles.menu, { paddingBottom: space.lg + insets.bottom }]} accessibilityViewIsModal>
          <MenuRow icon="flag" label={`Report ${person.name}`} hint="Tell our team what happened" onPress={() => { setMenu(false); setReporting(true); }} />
          <MenuRow icon="close" label={`Block ${person.name}`} hint="Hide each other and stop messages" danger onPress={() => void askBlock()} />
          <Button label="Cancel" variant="ghost" onPress={() => setMenu(false)} />
        </View>
      </Modal>
      <ReportSheet visible={reporting} person={person} bookingId={bookingId} onClose={() => setReporting(false)} onBlocked={onBlocked} />
    </>
  );
}

function MenuRow({ icon, label, hint, onPress, danger }: { icon: 'flag' | 'close'; label: string; hint: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${label}. ${hint}`} onPress={onPress} style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.mistDeep }]}>
      <Icon name={icon} size={20} color={danger ? colors.danger : colors.ink} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="headline" color={danger ? colors.danger : colors.ink}>
          {label}
        </Text>
        <Text variant="footnote" muted>
          {hint}
        </Text>
      </View>
    </Pressable>
  );
}

/** Reason, optional details, "also block". Goes to Admin → Reports and alerts staff. */
export function ReportSheet({ visible, person, bookingId, onClose, onBlocked }: { visible: boolean; person: Person; bookingId?: string; onClose: () => void; onBlocked?: () => void }) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(false);
  const [tried, setTried] = useState(false);
  const insets = useSafeAreaInsets();
  const confirm = useConfirm();
  const qc = useQueryClient();
  const send = useMutation({
    mutationFn: () => svc.reportUser(person.id, reason!, details.trim() || undefined, bookingId, alsoBlock),
    onSuccess: async (r) => {
      const blocked = alsoBlock;
      setReason(null);
      setDetails('');
      setAlsoBlock(false);
      setTried(false);
      onClose();
      if (blocked) {
        await qc.invalidateQueries({ queryKey: qk.blocks });
        await qc.invalidateQueries({ queryKey: qk.companions });
      }
      await confirm({ title: 'Report sent', message: `${r.message} If you’re in danger, call 112.` });
      if (blocked) onBlocked?.();
    },
  });
  const problem = reportError(reason, details);
  const submit = () => {
    setTried(true);
    if (!problem) send.mutate();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <View style={[styles.sheet, { paddingBottom: space.xl + insets.bottom }]} accessibilityViewIsModal>
        <View style={styles.handle} />
        <ScrollView contentContainerStyle={{ gap: space.md }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text variant="title2" accessibilityRole="header">
            Report {person.name}
          </Text>
          <Text variant="footnote" muted>
            Only our team sees this. {person.name} isn’t told who reported them.
          </Text>
          <View accessibilityRole="radiogroup" style={{ gap: space.xs }}>
            {REPORT_REASONS.map((r) => {
              const on = reason === r.key;
              return (
                <Pressable key={r.key} accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={() => setReason(r.key)} style={[styles.reason, on && styles.reasonOn]}>
                  <View style={[styles.radio, on && styles.radioOn]}>{on ? <View style={styles.radioDot} /> : null}</View>
                  <Text variant="callout" style={{ flex: 1 }}>
                    {r.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <TextField
            label={reason === 'other' ? 'What happened?' : 'Anything else? (optional)'}
            value={details}
            onChangeText={setDetails}
            multiline
            maxLength={REPORT_DETAILS_MAX}
            placeholder="What happened, and when"
          />
          <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: alsoBlock }} onPress={() => setAlsoBlock(!alsoBlock)} style={styles.check}>
            <View style={[styles.box, alsoBlock && styles.boxOn]}>{alsoBlock ? <Icon name="check" size={13} color={colors.white} strokeWidth={3} /> : null}</View>
            <Text variant="callout" style={{ flex: 1 }}>
              Also block {person.name}
            </Text>
          </Pressable>
          {tried && problem ? <Notice tone="warning" text={problem} /> : null}
          {send.isError ? <Notice tone="danger" text={errorMessage(send.error)} /> : null}
          <Button label="Send report" onPress={submit} loading={send.isPending} haptic />
          <Button label="Cancel" variant="ghost" onPress={onClose} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(24,27,52,0.55)' },
  menu: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.paper, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: space.lg, paddingTop: space.lg, gap: space.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 56, paddingHorizontal: space.sm, borderRadius: radius.lg },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '92%', backgroundColor: colors.paper, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: space.xl, paddingTop: space.md, gap: space.md },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.gray200 },
  reason: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 48, paddingHorizontal: space.md, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.line },
  reasonOn: { borderColor: colors.moss, backgroundColor: colors.green50 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.gray300, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.moss },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.moss },
  check: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 44 },
  box: { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: colors.gray400, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.moss, borderColor: colors.moss },
});
