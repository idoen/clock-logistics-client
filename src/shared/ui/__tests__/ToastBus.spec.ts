import { describe, expect, it } from 'vitest';
import { pushToast, subscribeToast } from '../ToastBus';

describe('ToastBus', () => {
  it('notifies subscribers with incrementing ids', () => {
    const messages: Array<{ id: number; text: string }> = [];
    const unsubscribe = subscribeToast((msg) => messages.push(msg));

    pushToast('First');
    pushToast('Second');

    unsubscribe();

    expect(messages).toHaveLength(2);
    expect(messages[0]).toEqual({ id: messages[0].id, text: 'First' });
    expect(messages[1]).toEqual({ id: messages[1].id, text: 'Second' });
    expect(messages[1].id).toBeGreaterThan(messages[0].id);
  });

  it('unsubscribes listeners', () => {
    const messages: Array<{ id: number; text: string }> = [];
    const unsubscribe = subscribeToast((msg) => messages.push(msg));

    unsubscribe();
    pushToast('Nope');

    expect(messages).toHaveLength(0);
  });
});
