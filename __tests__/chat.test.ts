import { mergeMessages } from '@/domain/chat';
import type { ChatMessage } from '@/domain/types';

const m = (id: string, at: string): ChatMessage => ({ _id: id, bookingId: 'b', senderId: 's', content: id, createdAt: at });

describe('chat history and live messages', () => {
  it('keeps a live message that arrived before the history finished loading', () => {
    const live = [m('m3', '2026-11-16T10:03:00Z')];
    const history = [m('m1', '2026-11-16T10:01:00Z'), m('m2', '2026-11-16T10:02:00Z')];
    expect(mergeMessages(live, history).map((x) => x._id)).toEqual(['m1', 'm2', 'm3']);
  });
  it('never shows a message twice', () => {
    const list = [m('m1', '2026-11-16T10:01:00Z')];
    expect(mergeMessages(list, [m('m1', '2026-11-16T10:01:00Z')])).toBe(list);
  });
});
