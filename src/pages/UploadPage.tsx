import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DocumentTypePicker from '../components/DocumentTypePicker'
import DropZone from '../components/DropZone'
import { useExtract } from '../api/hooks'
import type { DocumentType } from '../types/api'
import type { ReviewState } from '../types/review'

export default function UploadPage() {
  const navigate = useNavigate()
  const [docType, setDocType] = useState<DocumentType | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const extract = useExtract()

  const canSubmit = docType !== null && file !== null && !extract.isPending

  function submit() {
    if (!docType || !file) return
    extract.mutate(file, {
      onSuccess: (job) => {
        const state: ReviewState = { docType, file }
        navigate(`/review/${job.job_id}`, { state })
      },
    })
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <h1 className="text-3xl font-bold">Upload a document</h1>

      <section className="flex flex-col gap-4 rounded-xl border border-line bg-white p-6">
        <h2 className="font-bold">What are you uploading?</h2>
        <DocumentTypePicker value={docType} onChange={setDocType} />

        <h2 className="mt-2 font-bold">Add the document</h2>
        <DropZone file={file} onFile={setFile} />

        {extract.isError && (
          <p role="alert" className="text-sm text-warn-ink">
            Upload failed: {extract.error.message}
          </p>
        )}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={submit}
          className="self-start rounded-lg bg-accent px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {extract.isPending ? 'Uploading...' : 'Extract data'}
        </button>
        {!docType && <p className="text-sm text-muted">Choose a document type to continue.</p>}
      </section>
    </div>
  )
}
