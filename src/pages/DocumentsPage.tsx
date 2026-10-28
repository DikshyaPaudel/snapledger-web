import { useReceipts } from '../api/hooks'

// Smoke test for the API connection. Day 5 turns this into the full list with filters.
export default function DocumentsPage() {
  const { data, isLoading, error } = useReceipts()

  return (
    <div>
      <h1 className="text-3xl font-bold">Documents</h1>
      {isLoading && <p className="mt-4 text-muted">Loading...</p>}
      {error && <p className="mt-4 text-warn-ink">Could not reach the API: {error.message}</p>}
      {data && <p className="mt-4 text-muted">{data.length} saved documents</p>}
    </div>
  )
}
