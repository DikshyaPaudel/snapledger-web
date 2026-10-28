import { useState, type ReactNode } from 'react'
import ConfidenceBadge from './ConfidenceBadge'
import DocumentTypePicker from './DocumentTypePicker'
import LineItemsTable from './LineItemsTable'
import { formatMoney } from '../lib/format'
import { CATEGORIES, PARTY_LABEL, toFormState, toPayload, totalMismatch, type FormState } from '../lib/review'
import type { DocumentType, ExtractedData, ReceiptConfirm } from '../types/api'

const base = 'w-full rounded-lg border bg-white px-3 py-2.5'
const ok = 'border-line'
const warn = 'border-amber-400 bg-amber-50'

function Field({ label, id, missing, children }: { label: string; id: string; missing?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-muted">{label}</label>
      {children}
      {missing && <span className="text-sm text-warn-ink">Not found on the document. Please fill it in.</span>}
    </div>
  )
}

interface Props {
  data: ExtractedData
  initialDocType: DocumentType | null
  saving: boolean
  error: string | null
  onSave: (payload: ReceiptConfirm) => void
  onDiscard: () => void
}

export default function ReviewForm({ data, initialDocType, saving, error, onSave, onDiscard }: Props) {
  const [form, setForm] = useState<FormState>(() => toFormState(data, initialDocType))
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }))

  const mismatch = totalMismatch(form)
  const payload = toPayload(form, data.confidence)
  const partyLabel = form.docType ? PARTY_LABEL[form.docType] : 'Vendor'
  const empty = (v: string) => v.trim() === ''

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-line bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">Review extracted details</h2>
        <ConfidenceBadge confidence={data.confidence} />
      </div>
      <p className="-mt-3 text-sm text-muted">Nothing is saved until you confirm.</p>

      {data.confidence === 'low' && (
        <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-800">
          The model was not confident about this image. Check every field before saving.
        </p>
      )}
      {data.confidence === 'medium' && (
        <p className="rounded-lg bg-warn-bg px-3 py-2 text-sm text-warn-ink">Check the total and the date before saving.</p>
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-muted">Document type (required)</span>
        <DocumentTypePicker value={form.docType} onChange={(v) => set('docType', v)} />
      </div>

      <Field label={partyLabel} id="party" missing={empty(form.party)}>
        <input id="party" className={`${base} ${empty(form.party) ? warn : ok}`} value={form.party} onChange={(e) => set('party', e.target.value)} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date" id="date" missing={empty(form.date)}>
          <input id="date" type="date" className={`${base} ${empty(form.date) ? warn : ok}`} value={form.date} onChange={(e) => set('date', e.target.value)} />
        </Field>
        <Field label="Category" id="category">
          <select id="category" className={`${base} ${ok}`} value={form.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">None</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Total" id="total" missing={empty(form.total)}>
          <input id="total" inputMode="decimal" className={`${base} ${empty(form.total) ? warn : ok}`} value={form.total} onChange={(e) => set('total', e.target.value)} />
        </Field>
        <Field label="Currency" id="currency">
          <input id="currency" maxLength={3} className={`${base} ${ok}`} value={form.currency} onChange={(e) => set('currency', e.target.value.toUpperCase())} />
        </Field>
      </div>

      <div className="flex flex-col gap-2 border-t border-line pt-4">
        <h3 className="font-medium">Line items</h3>
        <LineItemsTable rows={form.rows} currency={form.currency} onChange={(rows) => set('rows', rows)} />
        {mismatch && (
          <p role="alert" className="rounded-lg bg-warn-bg px-3 py-2 text-sm text-warn-ink">
            Line items add up to {formatMoney(mismatch.sum, form.currency)}, but the total is {formatMoney(mismatch.total, form.currency)}. This can be tax or a missed line.
          </p>
        )}
      </div>

      {error && <p role="alert" className="text-sm text-warn-ink">Save failed: {error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!payload || saving}
          onClick={() => payload && onSave(payload)}
          className="rounded-lg bg-accent px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onDiscard} className="rounded-lg border border-line px-6 py-3">Discard</button>
        {!form.docType && <span className="text-sm text-muted">Choose a document type to save.</span>}
      </div>
    </div>
  )
}