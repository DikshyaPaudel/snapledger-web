export function toNumber(s: string): number | null {
  const n = Number.parseFloat(s.replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

export const round2 = (n: number) => Math.round(n * 100) / 100

export function formatMoney(n: number, currency: string): string {
  const code = currency.trim().toUpperCase()
  if (code.length !== 3) return n.toFixed(2)
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency: code }).format(n)
  } catch {
    return `${n.toFixed(2)} ${code}` // unknown currency code from the model
  }
}