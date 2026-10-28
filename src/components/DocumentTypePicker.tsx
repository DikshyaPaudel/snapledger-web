import type { DocumentType } from '../types/api'

export const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  receipt: 'Receipt',
  sales_invoice: 'Sales invoice',
  purchase_invoice: 'Purchase invoice',
}

const OPTIONS: { value: DocumentType; hint: string }[] = [
  { value: 'receipt', hint: 'A shop or expense receipt' },
  { value: 'sales_invoice', hint: 'You billed a customer' },
  { value: 'purchase_invoice', hint: 'A supplier billed you' },
]

interface Props {
  value: DocumentType | null
  onChange: (value: DocumentType) => void
}

export default function DocumentTypePicker({ value, onChange }: Props) {
  return (
    <div role="radiogroup" aria-label="Document type" className="flex flex-wrap gap-3">
      {OPTIONS.map((o) => {
        const selected = value === o.value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={`min-w-44 flex-1 rounded-xl border-2 p-4 text-left transition-colors ${
              selected ? 'border-accent bg-accent-soft' : 'border-line bg-white hover:border-muted'
            }`}
          >
            <div className="font-bold">{DOC_TYPE_LABELS[o.value]}</div>
            <div className="mt-1 text-sm text-muted">{o.hint}</div>
          </button>
        )
      })}
    </div>
  )
}
