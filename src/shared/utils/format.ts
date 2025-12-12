export function formatNumber(value: number | null | undefined, digits = 0) {
  if (value === null || value === undefined) return '—'
  return value.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits })
}
