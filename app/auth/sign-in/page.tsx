'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth/client'

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const form = new FormData(e.currentTarget)
    const email = (form.get('email') as string)?.trim()
    const password = form.get('password') as string

    if (!email) { setError('Email is required.'); setIsPending(false); return }
    if (!password) { setError('Password is required.'); setIsPending(false); return }

    const { error: authError } = await authClient.signIn.email({ email, password })

    if (authError) {
      setError(authError.message || 'Invalid credentials.')
      setIsPending(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Sign in to your Obscura studio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-white/50">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-white/30 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-white/50">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Your password"
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-white/30 focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-full bg-white py-3 text-sm font-semibold text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/30">
          No account yet?{' '}
          <Link href="/auth/sign-up" className="text-white/60 hover:text-white">
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}
