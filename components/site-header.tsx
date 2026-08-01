import Link from 'next/link'
import { getSessionUser } from '@/lib/auth'
import { SignOutButton } from './sign-out-button'

export async function SiteHeader() {
  const user = await getSessionUser()

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-obsidian/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-serif text-lg tracking-wide text-white/90">
          Obscura
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/community" className="text-sm text-white/50 transition-colors hover:text-white">Community</Link>
              <Link href="/dashboard" className="text-sm text-white/50 transition-colors hover:text-white">Studio</Link>
              <span className="text-sm text-white/40">{user.email}</span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="text-sm text-white/50 transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-white/90"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
