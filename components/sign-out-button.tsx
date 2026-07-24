'use client'

import { authClient } from '@/lib/auth/client'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const router = useRouter()

  return (
    <button
      onClick={async () => {
        await authClient.signOut()
        router.push('/')
        router.refresh()
      }}
      className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-white/50 transition-colors hover:border-white/20 hover:text-white"
    >
      Sign Out
    </button>
  )
}
