import type { ChatMessage } from './types';

/**
 * Adds messages to a chat without duplicates, oldest first. History loads and live messages
 * are always merged with what's on screen, never swapped in, so a message that arrived while
 * the history was loading is kept.
 */
export function mergeMessages(prev: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  if (!incoming.length) return prev;
  const seen = new Set(prev.map((m) => m._id));
  const fresh = incoming.filter((m) => !seen.has(m._id));
  if (!fresh.length) return prev;
  return [...prev, ...fresh].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
