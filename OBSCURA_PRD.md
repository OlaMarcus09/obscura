# Product Requirements Document: Obscura 

## Identity & Branding
- **Name:** Obscura
- **Concept:** A paywall-gated delivery system and creative network (Gumroad + WeTransfer + Dribbble).
- **Design System:** Deep obsidian background (`#0B0B0B`), stark white text. Use a serif font (`Playfair Display`) for client-facing delivery pages to evoke luxury, and `Inter` for the creator dashboard. 
- **Visual Mechanics:** Heavy use of blurs and glassmorphism. Watermarked files should feel "obscured" until the payment webhook clears the UI state.

## Tech Stack Mandate
- **Framework:** Next.js 15 (App Router, Server Actions)
- **Styling:** Tailwind CSS + shadcn/ui (Radix primitives)
- **Database:** PostgreSQL via Neon, using Drizzle ORM
- **Payments:** Stripe Connect (Creator payouts) + Stripe Checkout
- **Storage:** UploadThing (S3) or Cloudflare R2

## Core Database Schema (Drizzle)
1. `users`: id, email, name, stripe_account_id, role ('creator' | 'client')
2. `projects`: id, creator_id, title, price, status ('draft' | 'active' | 'archived')
3. `assets`: id, project_id, original_url, watermarked_url, mime_type, size
4. `delivery_links`: id, project_id, token, expires_at
5. `access_logs`: id, asset_id, viewer_email, ip, payment_intent_id, downloaded_at, paid (boolean)

## Critical API & Webhook Infrastructure
- `POST /api/projects/upload`: Handles file upload. Must mock or trigger a background job to generate a watermarked version of the asset.
- `GET /api/delivery/[slug]`: The paywall gate. If `paid=false` in `access_logs`, return `watermarked_url`. If `paid=true`, return `original_url`.
- `POST /api/webhooks/stripe`: Listens for `checkout.session.completed`. Uses the `idempotency_key` to prevent double-charging. Updates `access_logs.paid = true`.

## Execution Phases

**Phase 1: Database & Auth Setup**
- Install Drizzle ORM and configure the Postgres connection.
- Write the schema for the 5 core tables.
- Generate and run the initial migration.

**Phase 2: The Creator Studio (Dashboard)**
- Build a Kanban or List view of active projects.
- Implement the Upload Dropzone UI.
- Create the Server Action to generate a shareable `delivery_link` upon upload.

**Phase 3: The Client Paywall (Frontend)**
- Build the `/delivery/[slug]` public page.
- Render the obscured/watermarked image taking up 70% of the viewport.
- Overlay a glassmorphism card with the Creator's details, project title, and a "Pay to Unlock" CTA.

**Phase 4: Stripe Integration**
- Wire the CTA to Stripe Checkout.
- Build the webhook route to flip the `paid` status.
- Implement client-side polling so the obscured image crossfades into the clean image immediately after payment.