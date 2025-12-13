export function formatNumber(num: number | null | undefined, fractionDigits = 0): string {
  if (num === null || num === undefined) return '—';
  return num.toLocaleString(undefined, { maximumFractionDigits: fractionDigits });
}
