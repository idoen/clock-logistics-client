import { afterEach, describe, expect, it, vi } from 'vitest';
import { addDays, formatDate, formatDateTime } from '../date';

describe('addDays', () => {
  it('adds days to a base date without mutating it', () => {
    const base = new Date('2024-01-01T00:00:00Z');
    const result = addDays(base, 3);

    expect(result.toISOString()).toBe('2024-01-04T00:00:00.000Z');
    expect(base.toISOString()).toBe('2024-01-01T00:00:00.000Z');
  });
});

describe('formatDate', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns em dash when value is missing', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('uses locale formatting for dates', () => {
    const spy = vi.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('formatted');
    const value = formatDate(new Date('2024-05-01T00:00:00Z'));

    expect(value).toBe('formatted');
    expect(spy).toHaveBeenCalledWith('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  });
});

describe('formatDateTime', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns em dash when value is missing', () => {
    expect(formatDateTime(undefined)).toBe('—');
  });

  it('uses locale formatting for date times', () => {
    const spy = vi.spyOn(Date.prototype, 'toLocaleString').mockReturnValue('formatted time');
    const value = formatDateTime('2024-05-01T10:30:00Z');

    expect(value).toBe('formatted time');
    expect(spy).toHaveBeenCalledWith('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  });
});
