import { useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { jobOutcome, useJob, useSaveReceipt } from '../api/hooks'
import ReviewForm from '../components/ReviewForm'
import type { ReviewState } from '../types/review'

export default function ReviewPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation() as { state: ReviewState | null }
  const { data, error } = useJob(jobId ?? null)
  const save = useSaveReceipt()
  const outcome = jobOutcome(data)

  const previewUrl = useMemo(() => (state?.file ? URL.createObjectURL(state.file) : null), [state])
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold">Review</h1>

      {error && <p className="text-warn-ink">Could not check the job: {error.message}</p>}
      {outcome.state === 'pending' && !error && (
        <p className="text-muted">Reading your document. This takes about 15 to 20 seconds.</p>
      )}
      {outcome.state === 'failed' && (
        <div className="flex flex-col gap-3">
          <p className="text-warn-ink">{outcome.message}</p>
          <Link to="/upload" className="font-medium text-accent">Try another document</Link>
        </div>
      )}

      {outcome.state === 'ready' && (
        <div className="flex flex-wrap items-start gap-6">
          <div className="min-w-64 flex-1 basis-80">
            {previewUrl ? (
              <img src={previewUrl} alt="Uploaded document" className="w-full rounded-xl border border-line bg-white" />
            ) : (
              <p className="rounded-xl border border-line bg-white p-6 text-sm text-muted">
                The image preview is not available after a page refresh.
              </p>
            )}
          </div>
          <div className="min-w-80 flex-1 basis-96">
            <ReviewForm
              data={outcome.data}
              initialDocType={state?.docType ?? null}
              saving={save.isPending}
              error={save.error?.message ?? null}
              onSave={(payload) => save.mutate(payload, { onSuccess: () => navigate('/documents') })}
              onDiscard={() => navigate('/upload')}
            />
          </div>
        </div>
      )}
    </div>
  )
}