import { formatMoney } from '../lib/format'
import { lineItemsSum, newRow, type LineRow } from '../lib/review'

const input = 'w-full rounded-lg border border-line bg-white px-3 py-2 text-sm'

interface Props {
  rows: LineRow[]
  currency: string
  onChange: (rows: LineRow[]) => void
}

export default function LineItemsTable({ rows, currency, onChange }: Props) {
  const update = (id: string, patch: Partial<LineRow>) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const sum = lineItemsSum(rows)

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[1fr_7rem_2rem] gap-2 text-sm text-muted">
        <span>Description</span>
        <span>Amount</span>
        <span />
      </div>
      {rows.map((r, i) => (
        <div key={r.id} className="grid grid-cols-[1fr_7rem_2rem] items-center gap-2">
          <input
            className={input}
            aria-label={`Line ${i + 1} description`}
            value={r.description}
            onChange={(e) => update(r.id, { description: e.target.value })}
          />
          <input
            className={input}
            inputMode="decimal"
            aria-label={`Line ${i + 1} amount`}
            value={r.amount}
            onChange={(e) => update(r.id, { amount: e.target.value })}
          />
          <button
            type="button"
            aria-label={`Remove line ${i + 1}`}
            onClick={() => onChange(rows.filter((x) => x.id !== r.id))}
            className="rounded-lg text-muted hover:text-ink"
          >
            ×
          </button>
        </div>
      ))}
      {rows.length === 0 && <p className="text-sm text-muted">No line items were found.</p>}
      <div className="flex items-center justify-between pt-1">
        <button type="button" onClick={() => onChange([...rows, newRow()])} className="text-sm font-medium text-accent">
          Add line
        </button>
        {sum !== null && <span className="text-sm text-muted">Items total: {formatMoney(sum, currency)}</span>}
      </div>
    </div>
  )
}