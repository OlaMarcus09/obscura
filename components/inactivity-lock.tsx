'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/client'

const IDLE_TIMEOUT_MS = 45 * 60 * 1000
const LAST_ACTIVITY_KEY = 'obscura:last-activity'

export function InactivityLock({ enabled }: { enabled: boolean }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!enabled) {
      localStorage.removeItem(LAST_ACTIVITY_KEY)
      return
    }

    let timer: ReturnType<typeof setTimeout>
    let lastRecordedAt = 0

    async function lockSession() {
      localStorage.removeItem(LAST_ACTIVITY_KEY)
      await authClient.signOut().catch(() => {})
      router.replace(`/auth/sign-in?reason=inactive`)
      router.refresh()
    }

    function schedule(lastActivity: number) {
      clearTimeout(timer)
      const remaining = IDLE_TIMEOUT_MS - (Date.now() - lastActivity)
      if (remaining <= 0) {
        void lockSession()
        return
      }
      timer = setTimeout(() => void lockSession(), remaining)
    }

    function recordActivity() {
      const now = Date.now()
      // Limit storage writes for high-frequency pointer and keyboard events.
      if (now - lastRecordedAt < 15000) return
      lastRecordedAt = now
      localStorage.setItem(LAST_ACTIVITY_KEY, String(now))
      schedule(now)
    }

    const stored = Number(localStorage.getItem(LAST_ACTIVITY_KEY))
    const initialActivity = Number.isFinite(stored) && stored > 0 ? stored : Date.now()
    localStorage.setItem(LAST_ACTIVITY_KEY, String(initialActivity))
    schedule(initialActivity)

    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'scroll', 'touchstart']
    events.forEach((event) => window.addEventListener(event, recordActivity, { passive: true }))
    window.addEventListener('storage', recordActivity)

    return () => {
      clearTimeout(timer)
      events.forEach((event) => window.removeEventListener(event, recordActivity))
      window.removeEventListener('storage', recordActivity)
    }
  }, [enabled, pathname, router])

  return null
}
