export function formatNumber(num: number | null | undefined, fractionDigits = 2): string {
  if (num === null || num === undefined || Number.isNaN(num)) return '—';
  return num.toLocaleString(undefined, {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  });
}

export function formatDaysWithHours(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';

  const totalHours = value * 24;
  const sign = totalHours < 0 ? '-' : '';
  const absHours = Math.abs(totalHours);
  const days = Math.floor(absHours / 24);
  const hours = Math.round(absHours % 24);

  return `${sign}${days} ימים ${hours} שעות`;
}
