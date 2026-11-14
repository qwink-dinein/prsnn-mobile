import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { colors, space } from '@/theme/tokens';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { Button } from './ui/Button';
import { TextField } from './ui/forms';
import { Notice } from './ui/states';
import type { AdminUser } from '@/domain/types';
import { svc } from '@/services';
import { errorMessage } from '@/lib/api';

const REASONS: { key: string; label: string; text: string }[] = [
  { key: 'photo', label: 'Photo isn’t clear', text: 'Please upload a clear photo in good light, facing the camera, without sunglasses or filters.' },
  { key: 'bio', label: 'Bio is too short', text: 'Please tell members a bit more about yourself and what you enjoy.' },
  { key: 'area', label: 'Wrong area or city', text: 'Please check your city and area.' },
  { key: 'other', label: 'Something else', text: '' },
];

/**
 * Staff: ask someone to change their photo (or a companion their profile).
 * The note lands in their bell with "Fix and resubmit"; it comes back to the queue.
 */
export function RequestChangesSheet({ user, target, onClose, onDone }: { user: AdminUser | null; target: 'photo' | 'profile'; onClose: () => void; onDone: () => void }) {
  const [picked, setPicked] = useState<string[]>(target === 'photo' ? ['photo'] : []);
  const [note, setNote] = useState(target === 'photo' ? REASONS[0].text : '');
  const [touched, setTouched] = useState(false);
  const send = useMutation({
    mutationFn: () => svc.admin.requestChanges(user!.id, target, picked, note.trim()),
    onSuccess: () => {
      onDone();
      onClose();
      setPicked(target === 'photo' ? ['photo'] : []);
      setNote(target === 'photo' ? REASONS[0].text : '');
    },
  });
  const toggle = (k: string) => {
    const on = picked.includes(k);
    const next = on ? picked.filter((x) => x !== k) : [...picked, k];
    setPicked(next);
    // Build the message from the ticked reasons unless staff have written their own.
    const auto = REASONS.filter((r) => next.includes(r.key) && r.text).map((r) => r.text).join(' ');
    if (!touched) setNote(auto);
  };
  const reasons = target === 'photo' ? REASONS.filter((r) => r.key === 'photo' || r.key === 'other') : REASONS;
  const noteError = send.isError ? errorMessage(send.error) : null;

  return (
    <Modal visible={!!user} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <View style={styles.sheet} accessibilityViewIsModal>
        <ScrollView contentContainerStyle={{ gap: space.md }} keyboardShouldPersistTaps="handled">
          <Text variant="title3">Ask {user?.fullName?.split(' ')[0] ?? 'them'} for changes</Text>
          {reasons.map((r) => {
            const on = picked.includes(r.key);
            return (
              <Pressable key={r.key} accessibilityRole="checkbox" accessibilityState={{ checked: on }} onPress={() => toggle(r.key)} style={styles.reason}>
                <View style={[styles.box, on && styles.boxOn]}>{on ? <Icon name="check" size={13} color={colors.onMoss} strokeWidth={3} /> : null}</View>
                <Text variant="callout">{r.label}</Text>
              </Pressable>
            );
          })}
          <TextField
            label="Message (they’ll see this)"
            value={note}
            onChangeText={(v) => {
              setTouched(true);
              setNote(v);
            }}
            multiline
            maxLength={500}
            error={noteError ?? (note.trim() ? null : 'Write a short message so they know what to change.')}
          />
          <Notice tone="success" text="It shows in their notifications with “Fix and resubmit”, and is logged in the activity log." />
          <Button label="Send request" icon="send" disabled={!note.trim() || !user} loading={send.isPending} onPress={() => send.mutate()} />
          <Button label="Cancel" variant="ghost" onPress={onClose} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(24,27,52,0.45)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '88%', backgroundColor: colors.mist, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: space.xl },
  reason: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 44 },
  box: { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: colors.gray400, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.moss, borderColor: colors.moss },
});
