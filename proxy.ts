import { auth } from '@/lib/auth/server'

export default auth.middleware({
  loginUrl: '/auth/sign-in',
})

export const config = {
  matcher: [
    /*
     * Protect /dashboard routes but skip:
     * - /api (handled by route handlers)
     * - /auth (public auth pages)
     * - /delivery (public paywall pages)
     * - /_next (static assets)
     * - favicon.ico
     */
    '/dashboard/:path*',
    '/community/new/:path*',
  ],
}
