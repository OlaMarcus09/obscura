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
    {
      source: '/dashboard/:path*',
      // Server Actions POST back to the current page with this header. They
      // perform their own auth checks and must not be redirected by Proxy.
      missing: [{ type: 'header', key: 'next-action' }],
    },
    {
      source: '/community/new/:path*',
      missing: [{ type: 'header', key: 'next-action' }],
    },
  ],
}
