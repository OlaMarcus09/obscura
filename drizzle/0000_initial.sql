-- Obscura initial schema (Phase 1)
-- Applied to Neon project hidden-tree-14268162 on 2026-07-22.
-- NOTE: drizzle-kit CLI cannot run on this machine (macOS 11 / Darwin 20.6.0):
-- its bundled esbuild requires macOS 12+ (dyld: Symbol not found: _SecTrustCopyCertificateChain).
-- This SQL was applied directly to Neon and kept here as the migration artifact.
-- `neon_auth.user` is owned by Neon Auth; `public.users` is the app profile keyed to it.

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY NOT NULL REFERENCES "neon_auth"."user"("id"),
  "stripe_account_id" text,
  "role" text NOT NULL DEFAULT 'creator'
);

CREATE TABLE IF NOT EXISTS "projects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "creator_id" uuid NOT NULL REFERENCES "users"("id"),
  "title" text NOT NULL,
  "price" integer NOT NULL,
  "status" text NOT NULL DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS "assets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "project_id" uuid NOT NULL REFERENCES "projects"("id"),
  "original_url" text NOT NULL,
  "watermarked_url" text,
  "mime_type" text NOT NULL,
  "size" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "delivery_links" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "project_id" uuid NOT NULL REFERENCES "projects"("id"),
  "token" text NOT NULL UNIQUE,
  "expires_at" timestamptz
);

CREATE TABLE IF NOT EXISTS "access_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "asset_id" uuid NOT NULL REFERENCES "assets"("id"),
  "viewer_email" text,
  "ip" text,
  "payment_intent_id" text,
  "downloaded_at" timestamptz DEFAULT now(),
  "paid" boolean NOT NULL DEFAULT false
);
