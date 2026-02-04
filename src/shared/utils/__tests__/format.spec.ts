import { describe, expect, it } from 'vitest';
import { formatDaysWithHours, formatNumber } from '../format';

describe('formatNumber', () => {
  it('returns em dash for nullish and NaN values', () => {
    expect(formatNumber(null)).toBe('—');
    expect(formatNumber(undefined)).toBe('—');
    expect(formatNumber(Number.NaN)).toBe('—');
  });

  it('formats numbers with locale separators and precision (not locale fragile)', () => {
    const value = formatNumber(12345.678, 1);
    expect(value).not.toBe('—');
    expect(value.replace(/\s/g, '')).toMatch(/12.*345.*7/);
  });
});

describe('formatDaysWithHours', () => {
  it('formats positive day values into days and hours', () => {
    expect(formatDaysWithHours(1.5)).toBe('1 ימים 12 שעות');
  });

  it('preserves sign for negative durations', () => {
    expect(formatDaysWithHours(-0.25)).toBe('-0 ימים 6 שעות');
  });

  it('returns em dash for missing values', () => {
    expect(formatDaysWithHours(null)).toBe('—');
  });
});
