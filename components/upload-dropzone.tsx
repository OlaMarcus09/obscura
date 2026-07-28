'use client'

import { useActionState, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { uploadProject, type UploadResult } from '@/app/dashboard/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? 'Delivering…' : 'Create delivery'}
    </button>
  )
}

export function UploadDropzone() {
  const [state, formAction] = useActionState<UploadResult | null, FormData>(
    uploadProject,
    null
  )
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function onFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    setFileName(file.name)
    setPreview(URL.createObjectURL(file))
    if (inputRef.current) {
      const dt = new DataTransfer()
      dt.items.add(file)
      inputRef.current.files = dt.files
    }
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
    >
      <h2 className="text-sm font-medium tracking-wide text-white/60 uppercase">
        New delivery
      </h2>

      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          onFiles(e.dataTransfer.files)
        }}
        className={`mt-4 flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed transition-colors sm:aspect-video ${
          dragging
            ? 'border-white/60 bg-white/[0.06]'
            : 'border-white/15 hover:border-white/30'
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={fileName ?? 'preview'}
            className="h-full w-full object-cover blur-sm"
          />
        ) : (
          <div className="px-6 text-center">
            <p className="text-sm text-white/70">
              Drag an image here, or click to browse
            </p>
            <p className="mt-1 text-xs text-white/40">
              It’s obscured until a client pays.
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          name="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </label>
      {fileName && (
        <p className="mt-2 truncate text-xs text-white/50">{fileName}</p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          name="title"
          placeholder="Project title"
          className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
        />
        <div className="flex items-center rounded-lg border border-white/10 bg-black/40 px-3 focus-within:border-white/40">
          <span className="text-sm text-white/40">$</span>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            className="w-full bg-transparent px-2 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4">
        <SubmitButton />
      </div>

      {state?.ok === false && (
        <p className="mt-3 text-sm text-red-400">{state.error}</p>
      )}
      {state?.ok && (
        <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm">
          <p className="text-emerald-300">“{state.title}” is ready to share.</p>
          <code className="mt-1 block truncate text-xs text-white/60">
            /delivery/{state.token}
          </code>
        </div>
      )}
    </form>
  )
}
