import type { DocumentType, ExtractedData, LineItem, ReceiptConfirm } from '../types/api'
import { round2, toNumber } from './format'

export const CATEGORIES = ['food', 'transport', 'utilities', 'shopping', 'health', 'other'] as const

export const PARTY_LABEL: Record<DocumentType, string> = {
  receipt: 'Vendor',
  sales_invoice: 'Customer',
  purchase_invoice: 'Supplier',
}

export interface LineRow {
  id: string
  description: string
  amount: string
}

// Everything is a string while editing; numbers are parsed when saving.
export interface FormState {
  docType: DocumentType | null
  party: string // maps to "vendor" in the API
  date: string
  category: string
  currency: string
  total: string
  rows: LineRow[]
}

export const newRow = (description = '', amount = ''): LineRow => ({
  id: crypto.randomUUID(),
  description,
  amount,
})

export function toFormState(d: ExtractedData, docType: DocumentType | null): FormState {
  const category = d.category ?? ''
  return {
    docType,
    party: d.vendor ?? '',
    date: d.date && /^\d{4}-\d{2}-\d{2}$/.test(d.date) ? d.date : '',
    category: (CATEGORIES as readonly string[]).includes(category) ? category : category ? 'other' : '',
    currency: (d.currency ?? '').toUpperCase().slice(0, 3),
    total: d.total_amount == null ? '' : String(d.total_amount),
    rows: (d.line_items ?? []).map((i) => newRow(i.description ?? '', i.amount == null ? '' : String(i.amount))),
  }
}

export function lineItemsSum(rows: LineRow[]): number | null {
  const amounts = rows.map((r) => toNumber(r.amount)).filter((n): n is number => n !== null)
  return amounts.length ? round2(amounts.reduce((a, b) => a + b, 0)) : null
}

// Returns the two numbers when line items and the total disagree, otherwise null.
export function totalMismatch(form: FormState): { sum: number; total: number } | null {
  const sum = lineItemsSum(form.rows)
  const total = toNumber(form.total)
  if (sum === null || total === null) return null
  return Math.abs(sum - total) > 0.01 ? { sum, total: round2(total) } : null
}

export function toPayload(form: FormState, confidence: string | null): ReceiptConfirm | null {
  if (!form.docType) return null
  const items: LineItem[] = form.rows
    .filter((r) => r.description.trim() || r.amount.trim())
    .map((r) => ({ description: r.description.trim() || null, amount: toNumber(r.amount) }))
  return {
    vendor: form.party.trim() || null,
    date: form.date || null,
    total_amount: toNumber(form.total),
    currency: form.currency.trim() || null,
    category: form.category || null,
    confidence,
    line_items: items.length ? items : null,
    document_type: form.docType,
  }
}