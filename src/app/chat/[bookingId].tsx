import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Avatar, IconButton } from '@/components/ui/layout';
import { SafetyMenu } from '@/components/SafetyActions';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { whenOf } from '@/components/bookings';
import { canChat, idOf, personOf } from '@/domain/booking';
import { threadOf } from '@/domain/chat';
import { useAllMyBookings } from '@/lib/myBookings';
import type { Booking, ChatMessage } from '@/domain/types';
import { MAX_MESSAGE_LENGTH, useChat } from '@/lib/chat';
import { HoldButton } from '@/components/PanicButton';
import { panicWindow } from '@/domain/safety';

import { svc, qk } from '@/services';
import { useSession } from '@/state/session';
import { RiseIn, TypingDots } from '@/components/ui/motion';

const time = (iso: string) => new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

type Row = ChatMessage | { divider: Booking };
const isDivider = (r: Row): r is { divider: Booking } => 'divider' in r;

/**
 * Screen 13 · Chat with one person (live over Supabase Realtime). Every booking with them is one
 * thread, with a divider per booking. Sending is open from confirmation until the session ends
 * (database rule `chat_open`); a new booking with them opens it again.
 */
export default function Chat() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const me = useSession((s) => s.user);
  const booking = useQuery({ queryKey: qk.booking(bookingId), queryFn: () => svc.booking(bookingId) });
  const all = useAllMyBookings();
  // Re-checked every 30 s, so the box locks by itself when the session ends.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  const thread = useMemo(() => {
    const list = (all.data ?? []).filter((x) => canChat(x));
    if (booking.data && !list.some((x) => x._id === booking.data!._id)) list.push(booking.data);
    return threadOf(bookingId, list, now);
  }, [all.data, booking.data, bookingId, now]);
  const ids = useMemo(() => thread?.bookings.map((x) => x._id) ?? [bookingId], [thread, bookingId]);
  const sendTo = thread ? (thread.sendTo?._id ?? null) : null;
  const pair = thread ? [idOf(thread.main.requesterId), idOf(thread.main.companionId)].join('-') : bookingId;
  const { messages, status, error, send, otherTyping, typing } = useChat({ ids, sendTo, channel: pair }, me?.id ?? '');
  // Messages already there when the chat opened stay still; only new ones rise in.
  const [known, setKnown] = useState<Set<string> | null>(null);
  useEffect(() => {
    if (known || status !== 'open') return;
    const t = setTimeout(() => setKnown(new Set(messages.map((m) => m._id))), 800);
    return () => clearTimeout(t);
  }, [known, status, messages]);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<Row>>(null);

  const b = thread?.main ?? booking.data;
  const isCompanion = b ? idOf(b.companionId) === me?.id : false;
  const other = b ? personOf(isCompanion ? b.requesterId : b.companionId) : null;
  const firstName = other?.fullName?.split(' ')[0];
  const closed = !!thread && !sendTo;
  // A divider before the first message of each booking (only when the thread has more than one).
  const rows = useMemo<Row[]>(() => {
    if (!thread || thread.bookings.length < 2) return messages;
    const byId = new Map(thread.bookings.map((x) => [x._id, x]));
    const out: Row[] = [];
    let last = '';
    for (const m of messages) {
      if (m.bookingId !== last && byId.has(m.bookingId)) out.push({ divider: byId.get(m.bookingId)! });
      last = m.bookingId;
      out.push(m);
    }
    return out;
  }, [messages, thread]);

  useEffect(() => {
    if (messages.length || otherTyping) setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  }, [messages.length, otherTyping]);

  // Reading the chat clears its unread badge (and again as new messages arrive while it's open).
  const qc = useQueryClient();
  useEffect(() => {
    if (!ids.length || status !== 'open') return;
    Promise.all(ids.map((id) => svc.markChatRead(id)))
      .then(() => qc.invalidateQueries({ queryKey: qk.unread }))
      .catch(() => {});
  }, [ids, status, messages.length, qc]);

  // SOS in the header while the panic button is on (session start → 1 h after the end) for any booking in the thread.
  const [sos, setSos] = useState(false);
  const panicBooking = (thread?.bookings ?? (b ? [b] : [])).find((x) => panicWindow(x, now).on) ?? null;
  const panicOn = !!panicBooking;

  // Keyboard: the composer shows a "hide" button while it's up; tapping or dragging the chat hides it too.
  const [kb, setKb] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKb(true));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKb(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  const [tipOpen, setTipOpen] = useState(false);
  const insets = useSafeAreaInsets();

  // The box clears at once; if the message didn't reach the server, the text comes back.
  const [sending, setSending] = useState(false);
  // A ref updates at once, so a fast double tap can't send the same message twice.
  const busy = useRef(false);
  const submit = async () => {
    const draft = text;
    if (!draft.trim() || busy.current) return;
    busy.current = true;
    setText('');
    setSending(true);
    const ok = await send(draft);
    busy.current = false;
    setSending(false);
    if (!ok) setText((cur) => (cur ? cur : draft));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton name="chevronLeft" label="Back" onPress={() => router.back()} />
        <Avatar uri={other?.profilePhotoUrl} name={other?.fullName} size={40} online={status === 'open'} />
        <Pressable style={{ flex: 1 }} accessibilityRole="button" accessibilityLabel="Booking details" onPress={() => router.push(`/booking/${b?._id ?? bookingId}`)}>
          <Text variant="headline" numberOfLines={1}>
            {other?.fullName ?? 'Chat'}
          </Text>
          <Text variant="caption" muted numberOfLines={1}>
            {closed ? 'Chat closed' : status === 'open' ? (thread?.sendTo ? whenOf(thread.sendTo) : b ? whenOf(b) : 'Online') : status === 'connecting' ? 'Connecting…' : 'Reconnecting…'}
          </Text>
        </Pressable>
        {panicOn && panicBooking ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={panicBooking.panic ? 'Safety alert active. Open it.' : 'SOS. Open the panic button.'}
            onPress={() => (panicBooking.panic ? router.push(`/panic/${panicBooking._id}`) : (Keyboard.dismiss(), setSos(true)))}
            hitSlop={6}
            style={styles.sos}
          >
            <Text style={styles.sosText}>SOS</Text>
          </Pressable>
        ) : null}
        {other?._id ? <SafetyMenu person={{ id: other._id, name: firstName || 'them' }} bookingId={b?._id} onBlocked={() => router.back()} /> : null}
        <IconButton name="info" label="Booking details" onPress={() => router.push(`/booking/${b?._id ?? bookingId}`)} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          ref={listRef}
          data={rows}
          extraData={known}
          keyExtractor={(r) => (isDivider(r) ? `d-${r.divider._id}` : r._id)}
          contentContainerStyle={styles.list}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => kb && listRef.current?.scrollToEnd({ animated: false })}
          ListHeaderComponent={
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: tipOpen }}
              accessibilityLabel="Keep it safe, public places only. Show the chat rules"
              onPress={() => setTipOpen((o) => !o)}
              style={[styles.safety, tipOpen && styles.safetyOpen]}
            >
              <View style={styles.safetyLine}>
                <Icon name="shieldCheck" size={14} color={colors.champagneDeep} />
                <Text variant="caption" color={colors.champagneDeep} style={{ fontFamily: fonts.semibold }} numberOfLines={1}>
                  Keep it safe · public places only
                </Text>
                <Icon name={tipOpen ? 'chevronUp' : 'chevronRight'} size={12} color={colors.champagneDeep} />
              </View>
              {tipOpen ? (
                <Text variant="caption" color={colors.gray600} style={{ marginTop: 6 }}>
                  Don’t share mobile numbers, addresses, social handles or other personal details, and keep politics and religion out of the chat. Meet only in public places. Numbers are hidden automatically, and you can report anything from the booking.
                </Text>
              ) : null}
            </Pressable>
          }
          ListFooterComponent={otherTyping ? <TypingDots name={other?.fullName?.split(' ')[0]} /> : undefined}
          renderItem={({ item }) => {
            if (isDivider(item)) {
              return (
                <Text variant="caption" muted center style={styles.divider} accessibilityRole="header">
                  {item.divider.ref ? `Booking #${item.divider.ref} · ` : ''}
                  {whenOf(item.divider)}
                </Text>
              );
            }
            const mine = String(item.senderId) === me?.id;
            return (
              <Pressable onPress={Keyboard.dismiss} accessible={false} style={[styles.bubbleRow, mine && { justifyContent: 'flex-end' }]}>
                <RiseIn animate={!!known && !known.has(item._id)} style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
                  <Text variant="callout" color={mine ? colors.onMoss : colors.ink}>
                    {item.content}
                  </Text>
                  <Text variant="caption" color={mine ? 'rgba(255,255,255,0.7)' : colors.gray400} style={{ alignSelf: 'flex-end', marginTop: 2 }}>
                    {time(item.createdAt)}
                  </Text>
                </RiseIn>
              </Pressable>
            );
          }}
        />
        {error ? (
          <Text variant="footnote" color={colors.danger} center style={{ paddingHorizontal: space.lg }} accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}
        {closed ? (
          <View style={styles.closed} accessible accessibilityLiveRegion="polite">
            <View style={styles.closedLine}>
              <Icon name="lock" size={14} color={colors.gray500} />
              <Text variant="footnote" muted center>
                Your session has ended, so chat is closed.
              </Text>
            </View>
            <Text variant="footnote" muted center>
              {isCompanion ? `It opens again if ${firstName ?? 'they'} books you again.` : `Book ${firstName ?? 'them'} again to chat.`}
            </Text>
          </View>
        ) : (
          <View style={styles.composer}>
            {kb ? <IconButton name="chevronDown" label="Hide keyboard" onPress={() => Keyboard.dismiss()} style={styles.hideKb} size={20} /> : null}
            <TextInput
              value={text}
              onChangeText={(v) => {
                setText(v);
                if (v) typing();
              }}
              placeholder="Type a message…"
              placeholderTextColor={colors.gray400}
              style={styles.input}
              multiline
              maxLength={MAX_MESSAGE_LENGTH}
              accessibilityLabel="Message"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send"
              disabled={!text.trim() || status !== 'open' || sending}
              onPress={() => void submit()}
              style={[styles.send, (!text.trim() || status !== 'open') && { opacity: 0.4 }]}
            >
              <Icon name="send" size={20} color={colors.onMoss} />
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>

      {panicBooking ? (
        <Modal visible={sos} transparent animationType="slide" onRequestClose={() => setSos(false)}>
          <Pressable style={styles.scrim} onPress={() => setSos(false)} accessibilityLabel="Close" accessibilityRole="button" />
          <View style={[styles.sheet, { paddingBottom: insets.bottom + space.lg }]} accessibilityViewIsModal>
            <View style={styles.grabber} />
            <HoldButton b={panicBooking} bare />
            <Pressable accessibilityRole="button" onPress={() => setSos(false)} style={styles.notNow}>
              <Text variant="subhead" muted>
                Not now
              </Text>
            </Pressable>
          </View>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingRight: space.xs, paddingVertical: space.xs, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line, backgroundColor: colors.paper },
  list: { padding: space.lg, gap: space.sm },
  safety: { alignSelf: 'center', maxWidth: '100%', paddingHorizontal: space.md, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.champagneMist, borderWidth: 1, borderColor: colors.line, marginBottom: space.md },
  safetyOpen: { alignSelf: 'stretch', borderRadius: radius.lg, padding: space.md },
  safetyLine: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  sos: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', marginHorizontal: 2 },
  sosText: { fontFamily: fonts.bold, fontSize: 11, color: colors.white, letterSpacing: 0.5 },
  hideKb: { width: 44, height: 44 },
  scrim: { flex: 1, backgroundColor: 'rgba(24,27,52,0.45)' },
  sheet: { backgroundColor: colors.paper, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, paddingHorizontal: space.xl },
  grabber: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.mistDeep, marginTop: space.sm },
  notNow: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  bubbleRow: { flexDirection: 'row' },
  bubble: { maxWidth: '80%', paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.lg },
  mine: { backgroundColor: colors.moss, borderBottomRightRadius: 4 },
  theirs: { backgroundColor: colors.paper, borderBottomLeftRadius: 4, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, padding: space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, backgroundColor: colors.paper },
  input: { flex: 1, maxHeight: 120, minHeight: 44, fontFamily: fonts.body, fontSize: 16, color: colors.ink, paddingHorizontal: space.lg, paddingTop: 11, paddingBottom: 11, backgroundColor: colors.mist, borderRadius: 22 },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
  closed: { padding: space.lg, gap: 2, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, backgroundColor: colors.paper },
  closedLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  divider: { marginVertical: space.sm },
});
