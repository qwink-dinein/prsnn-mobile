import { useCallback, useEffect, useState } from 'react';
import { isSampleMode } from '@/services';
import { supabase } from './supabase';
import type { ChatMessage } from '@/domain/types';
import { mergeMessages } from '@/domain/chat';

export const MAX_MESSAGE_LENGTH = 1000; // database limit

type Status = 'connecting' | 'open' | 'closed' | 'error';
type Row = { id: string; booking_id: string; sender_id: string; content: string; created_at: string };
const toMessage = (r: Row): ChatMessage => ({ _id: r.id, bookingId: r.booking_id, senderId: r.sender_id, content: r.content, createdAt: r.created_at });

/**
 * Live chat for one booking: the messages table + Supabase Realtime.
 * Row-level security lets only the two people on a confirmed, paid booking
 * read or write; phone numbers are masked by the database on insert.
 *
 * History and live messages are merged (never replaced), and the history is loaded again
 * every time the live channel (re)connects, so nothing sent while it was connecting or
 * offline goes missing.
 */
export function useChat(bookingId: string, myId: string) {
  const sample = isSampleMode();
  const [messages, setMessages] = useState<ChatMessage[]>(() => (sample ? demoThread(bookingId, myId) : []));
  const [status, setStatus] = useState<Status>(sample ? 'open' : 'connecting');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sample) return;
    let alive = true;
    const add = (list: ChatMessage[]) => setMessages((prev) => mergeMessages(prev, list));
    const loadHistory = () =>
      supabase
        .from('messages')
        .select('id, booking_id, sender_id, content, created_at')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true })
        .limit(500)
        .then(({ data, error: e }) => {
          if (!alive) return;
          if (e) setError(e.message);
          else add((data ?? []).map(toMessage));
        });
    void loadHistory();
    const channel = supabase
      .channel(`chat:${bookingId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `booking_id=eq.${bookingId}` }, (payload) => add([toMessage(payload.new as Row)]))
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
    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, [bookingId, myId, sample]);

  /** Sends a message. Resolves true once the server has it; false (with `error` set) if it didn't go. */
  const send = useCallback(
    async (text: string): Promise<boolean> => {
      const message = text.trim();
      if (!message || message.length > MAX_MESSAGE_LENGTH) return false;
      if (sample) {
        setMessages((p) => [...p, { _id: `m${Date.now()}`, bookingId, senderId: myId, content: message, createdAt: new Date().toISOString() }]);
        return true;
      }
      const { data, error: e } = await supabase.from('messages').insert({ booking_id: bookingId, sender_id: myId, content: message }).select('id, booking_id, sender_id, content, created_at').single();
      if (e) {
        setError(e.message.includes('row-level security') ? 'Chat opens once the booking is confirmed and paid.' : 'Message not sent. Check your connection and try again.');
        return false;
      }
      setError(null);
      if (data) setMessages((prev) => mergeMessages(prev, [toMessage(data as Row)]));
      return true;
    },
    [bookingId, myId, sample],
  );

  return { messages, status, error, send };
}

function demoThread(bookingId: string, myId: string): ChatMessage[] {
  const at = (minsAgo: number) => new Date(Date.now() - minsAgo * 60_000).toISOString();
  return [
    { _id: 'm1', bookingId, senderId: 'other', content: 'Hi! Looking forward to our coffee meet on Sunday ☕', createdAt: at(60) },
    { _id: 'm2', bookingId, senderId: myId, content: 'Hi! Same here. See you at the venue around 4?', createdAt: at(50) },
    { _id: 'm3', bookingId, senderId: 'other', content: 'Yes, works for me!', createdAt: at(48) },
  ];
}
