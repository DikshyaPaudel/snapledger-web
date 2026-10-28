import { useEffect, useMemo, useRef, useState } from 'react'
import { validateImage } from '../lib/validate'

interface Props {
  file: File | null
  onFile: (file: File) => void
}

export default function DropZone({ file, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  function handle(f: File | undefined) {
    if (!f) return
    const problem = validateImage(f)
    setError(problem)
    if (!problem) onFile(f)
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        role="button"
        tabIndex={0}
        aria-label="Add a document image"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]) }}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging ? 'border-accent bg-accent-soft' : 'border-line bg-white hover:border-muted'
        }`}
      >
        {previewUrl ? (
          <div className="flex flex-col items-center gap-3">
            <img src={previewUrl} alt="Selected document" className="max-h-72 rounded-lg" />
            <div className="text-sm text-muted">{file?.name}. Click or drop to replace.</div>
          </div>
        ) : (
          <div className="py-8 text-muted">
            Drag a photo here, or click to browse
            <div className="mt-1 text-sm">PNG or JPG, up to 10 MB</div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { handle(e.target.files?.[0]); e.target.value = '' }}
        />
      </div>
      {error && <p role="alert" className="text-sm text-warn-ink">{error}</p>}
    </div>
  )
}
