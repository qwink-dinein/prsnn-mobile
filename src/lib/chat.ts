import { useCallback, useEffect, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { isLivePreview, isSampleMode } from '@/services';
import { supabase } from './supabase';
import type { ChatMessage } from '@/domain/types';
import { mergeMessages } from '@/domain/chat';

export const MAX_MESSAGE_LENGTH = 1000; // database limit

/** A random UUID (v4) for a new message, so sending is idempotent. */
export function messageId(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  const h = '0123456789abcdef';
  let out = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) out += '-';
    else if (i === 14) out += '4';
    else if (i === 19) out += h[(Math.random() * 4) | 8];
    else out += h[(Math.random() * 16) | 0];
  }
  return out;
}

type Status = 'connecting' | 'open' | 'closed' | 'error';
type Row = { id: string; booking_id: string; sender_id: string; content: string; created_at: string };
const toMessage = (r: Row): ChatMessage => ({ _id: r.id, bookingId: r.booking_id, senderId: r.sender_id, content: r.content, createdAt: r.created_at });

/**
 * Live chat for one thread (every booking between the same two people): the messages table +
 * Supabase Realtime. Row-level security lets only the two people on a confirmed, paid booking read;
 * writing is allowed only while a booking is open (`chat_open`: accepted, paid, session not over),
 * so messages are sent to `sendTo`, the open booking (null when the chat is closed).
 * Phone numbers are masked by the database on insert.
 *
 * History and live messages are merged (never replaced), and the history is loaded again
 * every time the live channel (re)connects, so nothing sent while it was connecting or
 * offline goes missing.
 */
export function useChat(thread: { ids: string[]; sendTo: string | null; channel: string }, myId: string) {
  const ids = thread.ids;
  const idsKey = ids.join(',');
  const bookingId = thread.sendTo ?? ids[ids.length - 1] ?? '';
  const sample = isSampleMode();
  // Staff live preview: chats are private, so none are loaded or sent (admins read a chat only
  // when a problem is reported on the booking, from Admin → Bookings).
  const live = isLivePreview();
  const [messages, setMessages] = useState<ChatMessage[]>(() => (sample ? demoThread(bookingId, myId) : []));
  // A thread that gains or loses a booking starts from its own history again.
  useEffect(() => {
    if (!sample) setMessages([]);
  }, [idsKey, sample]);
  const [status, setStatus] = useState<Status>(sample ? 'open' : live ? 'closed' : 'connecting');
  const [error, setError] = useState<string | null>(live ? 'Chats are private, so they aren’t shown in a preview.' : null);
  // "Typing…": a Realtime broadcast on the same channel (nothing is stored). Hidden after 4 s of
  // silence or as soon as their message arrives.
  const [otherTyping, setOtherTyping] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const lastSent = useRef(0);
  const showTyping = useCallback((on: boolean) => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    setOtherTyping(on);
    if (on) typingTimer.current = setTimeout(() => setOtherTyping(false), 4000);
  }, []);
  useEffect(() => () => void (typingTimer.current && clearTimeout(typingTimer.current)), []);

  useEffect(() => {
    if (sample || live || !idsKey) return;
    let alive = true;
    const list = idsKey.split(',');
    const add = (list: ChatMessage[]) => {
      if (list.some((m) => String(m.senderId) !== myId)) showTyping(false);
      setMessages((prev) => mergeMessages(prev, list));
    };
    const loadHistory = () =>
      supabase
        .from('messages')
        .select('id, booking_id, sender_id, content, created_at')
        .in('booking_id', list)
        .order('created_at', { ascending: true })
        .limit(500)
        .then(({ data, error: e }) => {
          if (!alive) return;
          if (e) setError(e.message);
          else add((data ?? []).map(toMessage));
        });
    void loadHistory();
    const channel = supabase
      .channel(`chat:${thread.channel}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: list.length === 1 ? `booking_id=eq.${list[0]}` : `booking_id=in.(${list.join(',')})` }, (payload) => add([toMessage(payload.new as Row)]))
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload?.from && payload.from !== myId) showTyping(true);
      })
      .subscribe((s) => {
        if (!alive) return;
        if (s === 'SUBSCRIBED') {
          setStatus('open');
          setError(null);
          // Fill the gap between the first history load (or a dropped connection) and now.
          void loadHistory();
        } else if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT') setStatus('error');
        else if (s === 'CLOSED') setStatus('closed');
      });
    channelRef.current = channel;
    return () => {
      alive = false;
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [idsKey, thread.channel, myId, sample, live, showTyping]);

  /** Tell the other person I'm typing (at most every 2 s). */
  const typing = useCallback(() => {
    const now = Date.now();
    if (sample || live || now - lastSent.current < 2000 || !channelRef.current) return;
    lastSent.current = now;
    void channelRef.current.send({ type: 'broadcast', event: 'typing', payload: { from: myId } });
  }, [myId, sample, live]);

  /** Sends a message. Resolves true once the server has it; false (with `error` set) if it didn't go. */
  const send = useCallback(
    async (text: string): Promise<boolean> => {
      const message = text.trim();
      if (!message || message.length > MAX_MESSAGE_LENGTH) return false;
      if (live) return false;
      if (!sample && !thread.sendTo) {
        setError('This session has ended, so chat is closed.');
        return false;
      }
      if (sample) {
        setMessages((p) => [...p, { _id: `m${Date.now()}`, bookingId, senderId: myId, content: message, createdAt: new Date().toISOString() }]);
        // Sample mode: the other side "types" and answers, so the chat can be tried end to end.
        setTimeout(() => showTyping(true), 700);
        setTimeout(() => {
          showTyping(false);
          setMessages((p) => [...p, { _id: `r${Date.now()}`, bookingId, senderId: 'other', content: 'Sounds good!', createdAt: new Date().toISOString() }]);
        }, 2400);
        return true;
      }
      // One ID per message, made here: a double tap, or a retry after a dropped connection, can't save it twice
      // (the second insert hits the same primary key and is treated as already sent).
      const id = messageId();
      const { data, error: e } = await supabase.from('messages').insert({ id, booking_id: thread.sendTo, sender_id: myId, content: message }).select('id, booking_id, sender_id, content, created_at').single();
      if (e && (e as { code?: string }).code === '23505') {
        setError(null);
        return true;
      }
      if (e) {
        setError(e.message.includes('row-level security') ? 'Chat is closed: it’s open from confirmation until the session ends.' : 'Message not sent. Check your connection and try again.');
        return false;
      }
      setError(null);
      if (data) setMessages((prev) => mergeMessages(prev, [toMessage(data as Row)]));
      return true;
    },
    [bookingId, thread.sendTo, myId, sample, live, showTyping],
  );

  return { messages, status, error, send, otherTyping, typing };
}

function demoThread(bookingId: string, myId: string): ChatMessage[] {
  const at = (minsAgo: number) => new Date(Date.now() - minsAgo * 60_000).toISOString();
  return [
    { _id: 'm1', bookingId, senderId: 'other', content: 'Hi! Looking forward to our coffee meet on Sunday ☕', createdAt: at(60) },
    { _id: 'm2', bookingId, senderId: myId, content: 'Hi! Same here. See you at the venue around 4?', createdAt: at(50) },
    { _id: 'm3', bookingId, senderId: 'other', content: 'Yes, works for me!', createdAt: at(48) },
  ];
}
