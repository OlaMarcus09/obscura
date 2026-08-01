# Obscura Handoff

Last updated: 2026-08-02

## Current state

Obscura is a Next.js 16 App Router application deployed from `main` through Vercel. It currently includes:

- Neon Auth sign-up, sign-in, session display, and sign-out.
- Creator Studio dashboard with authenticated delivery uploads.
- Private storage for delivery originals and 30-day delivery links.
- Public delivery/paywall presentation. Payment and authorized original download are not implemented yet.
- Community feed, public creator profile pages, and authenticated showcase publishing.
- Separate public Blob storage paths for community showcase media.
- Server-side creator-role checks, upload size/type validation, and compensating cleanup for partial writes.
- A client-side inactivity lock that signs authenticated users out after 45 minutes without pointer, keyboard, touch, or scroll activity.

## Database

The following hand-written migrations have been applied to Neon:

- `drizzle/0000_initial.sql`
- `drizzle/0001_community.sql`

The community migration adds `community_profiles` and `community_posts` with validation constraints and feed/creator indexes.

## Deployment configuration

Vercel production must provide:

- `DATABASE_URL`
- `NEON_AUTH_BASE_URL`
- `NEON_AUTH_COOKIE_SECRET`
- `NEXT_PUBLIC_NEON_AUTH_URL`
- `BLOB_READ_WRITE_TOKEN` or an equivalent connected Vercel Blob store configuration

Do not commit environment values or credentials.

The most recent deployment build fix marks auth-dependent rendering as dynamic and rethrows Next.js framework control-flow signals instead of converting them into application errors.

## Important implementation notes

- Every Server Action authenticates independently. Proxy is only an optimistic page-access guard.
- Proxy excludes requests carrying the `next-action` header so Server Action POSTs are not redirected.
- Delivery originals must remain private. Never use the original Blob URL as an unpaid preview.
- Community images are intentionally public and must remain separate from delivery assets.
- Neon HTTP does not support the transaction pattern used by standard Postgres drivers, so upload failures use compensating deletes.
- This repository uses Next.js 16. Read the relevant guides in `node_modules/next/dist/docs/` before changing framework behavior.

## Known gaps

1. Verify the latest Vercel deployment succeeds and confirm Studio and Community uploads with a small JPEG or PNG.
2. Confirm the production Vercel Blob store is connected. Upload actions now return inline configuration errors rather than crashing pages.
3. Add community profile onboarding/editing. The profile action exists, but no profile form is currently exposed.
4. Ensure community users are provisioned in `public.users` before their first post, even if they have never visited Studio.
5. Generate irreversible public preview derivatives for delivery assets rather than the current generic placeholder.
6. Build payments only after selecting a gateway: checkout creation, verified webhook, paid-access record, and authorized download proxy.
7. Add community follows, likes, comments, moderation/reporting, pagination, and rate limits in later slices.
8. Replace the client-only inactivity control with a server-enforced idle-session policy if stronger compliance guarantees are required.

## Recommended next session

Start by testing the production deployment end to end:

1. Sign in and leave an authenticated tab idle only during a dedicated timeout test.
2. Create a Studio delivery using a small valid image.
3. Publish a Community showcase.
4. Confirm the new rows and Blob objects were created.
5. Fix profile provisioning/onboarding before adding additional social features.

Latest feature and fix commits before this handoff:

- `73618d7` — community showcase MVP
- `f0f402f` — allow Server Actions through auth Proxy
- `7a635e6` — contain upload-service failures
- `d464f99` — 45-minute inactivity lockout
- `3dcf1ab` — dynamic rendering fix for Neon Auth
