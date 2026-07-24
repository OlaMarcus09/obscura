'use client'

import { useState } from 'react'

export function CopyLink({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)
  const path = `/delivery/${token}`
  const shortPath = `/delivery/${token.slice(0, 8)}...`

  async function copy() {
    const url =
      typeof window !== 'undefined' ? window.location.origin + path : path
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-white"
      title="Copy delivery link"
    >
      <span className="truncate font-mono">{shortPath}</span>
      <span className="shrink-0 text-[10px]">{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  )
}
