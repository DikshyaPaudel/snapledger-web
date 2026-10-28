const STYLES: Record<string, string> = {
  high: 'bg-accent-soft text-accent',
  medium: 'bg-warn-bg text-warn-ink',
  low: 'bg-red-100 text-red-800',
}

export default function ConfidenceBadge({ confidence }: { confidence: string | null }) {
  if (!confidence) return null
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${STYLES[confidence] ?? STYLES.medium}`}>
      Confidence: {confidence}
    </span>
  )
}