import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { DEMO, SOCKET_URL } from './config';
import { getApiToken } from './api';
import type { ChatMessage } from '@/domain/types';

export const MAX_MESSAGE_LENGTH = 1000; // backend socket limit

type Status = 'connecting' | 'open' | 'closed' | 'error';

/**
 * Live chat for one booking over the backend's Socket.io server.
 * Events (prsnn-backend/src/socket/index.js):
 *   emit join_room {bookingId}  → previous_messages ChatMessage[]
 *   emit send_message {bookingId, message} → receive_message ChatMessage
 *   on error (string), session_cancelled
 * Phone numbers in the other person's messages arrive masked by the server.
 */
export function useChat(bookingId: string, myId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => (DEMO ? demoThread(bookingId, myId) : []));
  const [status, setStatus] = useState<Status>(DEMO ? 'open' : 'connecting');
  const [error, setError] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (DEMO) return;
    const socket = io(SOCKET_URL, {
      auth: { token: getApiToken() },
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;
    socket.on('connect', () => {
      setStatus('open');
      setError(null);
      socket.emit('join_room', { bookingId });
    });
    socket.on('connect_error', () => setStatus('error'));
    socket.on('disconnect', () => setStatus('closed'));
    socket.on('previous_messages', (list: ChatMessage[]) => setMessages(list));
    socket.on('receive_message', (m: ChatMessage) => setMessages((prev) => (prev.some((p) => p._id === m._id) ? prev : [...prev, m])));
    socket.on('error', (msg: string) => setError(typeof msg === 'string' ? msg : 'Chat error'));
    socket.on('session_cancelled', () => setEnded(true));
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [bookingId, myId]);

  const send = useCallback(
    (text: string) => {
      const message = text.trim();
      if (!message || message.length > MAX_MESSAGE_LENGTH) return false;
      if (DEMO) {
        setMessages((p) => [...p, { _id: `m${Date.now()}`, bookingId, senderId: myId, content: message, createdAt: new Date().toISOString() }]);
        return true;
      }
      if (!socketRef.current?.connected) return false;
      socketRef.current.emit('send_message', { bookingId, message });
      return true;
    },
    [bookingId, myId],
  );

  return { messages, status, error, ended, send };
}

function demoThread(bookingId: string, myId: string): ChatMessage[] {
  const at = (minsAgo: number) => new Date(Date.now() - minsAgo * 60_000).toISOString();
  return [
    { _id: 'm1', bookingId, senderId: 'other', content: 'Hi! Looking forward to our coffee meet on Sunday ☕', createdAt: at(60) },
    { _id: 'm2', bookingId, senderId: myId, content: 'Hi! Same here. See you at the venue around 4?', createdAt: at(50) },
    { _id: 'm3', bookingId, senderId: 'other', content: 'Yes, works for me!', createdAt: at(48) },
  ];
}
