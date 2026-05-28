# DEVLOG.md — SpendLens

## Day 1 — 2026-05-17
**Goal:** Project Setup & Foundation
- Initialized Next.js project with TypeScript and Tailwind CSS.
- Set up project structure following the build plan.
- Configured Supabase, Anthropic, and Resend environment variables.
- Created Supabase database schema for `audits` and `leads` tables.
- **Blocker:** `shadcn init` network issues. Resolved by manually adding components and using `sonner` instead of `toast`.

## Day 2 — 2026-05-18
**Goal:** Pricing Data + Audit Engine Core
- Compiled comprehensive pricing data for Cursor, Copilot, Claude, ChatGPT, etc.
- Implemented the deterministic audit engine in `lib/audit-engine/`.
- Wrote 5+ Vitest tests to verify audit logic (redundancy, plan mismatches).
- **Learning:** Claude's "Team" plan has a minimum of 5 seats, which affects the optimization logic.

## Day 3 — 2026-05-19
**Goal:** Input Form (Frontend)
- Built the `AuditForm` component with dynamic tool rows.
- Implemented `localStorage` persistence to save form state across reloads.
- Created the landing page with clear value propositions and CTAs.
- **UX Fix:** Added a "Team Size" selector to influence the "Switch to Team Plan" recommendations.

## Day 4 — 2026-05-20
**Goal:** API Routes + Database + Results Page
- Implemented `POST /api/audit` to run the engine and persist results to Supabase.
- Built the shareable results page (`/results/[auditId]`) using Next.js Server Components.
- Integrated `HeroSavings` and `ToolBreakdown` components for clear data visualization.
- **Supabase:** Used `supabaseAdmin` for server-side inserts to bypass RLS for non-authenticated users.

## Day 5 — 2026-05-21
**Goal:** AI Summary + Lead Capture + Email
- Integrated Anthropic's Claude 3 Haiku for generating personalized audit summaries.
- Implemented a fallback summary mechanism in case of API timeouts or rate limits.
- Built the `LeadCaptureModal` and `POST /api/leads` route.
- Integrated Resend for automated email confirmation.

## Day 6 — 2026-05-22
**Goal:** Polish, Share Button, Credex CTA
- Added dynamic OG image generation using `next/og`.
- Implemented a `ShareButton` with Web Share API and clipboard fallback.
- Added the "Credex CTA" for high-savings audits (>$500/mo).
- Performed an accessibility pass (Aria labels, contrast checks).

## Day 7 — 2026-05-23
**Goal:** Docs, CI, Final Polish
- Set up GitHub Actions CI for automated linting and testing.
- Wrote all required documentation (`README.md`, `REFLECTION.md`, etc.).
- Final verification of all user flows.
- Deployed to Vercel.

## Day 8 — 2026-05-24
**Goal:** Fixes & UI Refinement
- Fixed button nesting issues in Results page for better React compliance.
- Improved PDF export stability and styling.
- **Fix:** Resolved a layout shift occurring during export generation.

## Day 9 — 2026-05-25
**Goal:** Enhanced Audits & PDF Export
- Refactored PDF export logic into a dedicated library (`lib/export-pdf.ts`).
- Added automated tests for PDF generation using Vitest.
- Enhanced Supabase integration for more robust data handling.
- Optimized rate limiting and API response handling with new fetch utilities.

## Day 10 — 2026-05-27
**Goal:** Code Health & Vercel Optimization
- Resolved all project-wide ESLint and TypeScript diagnostics.
- Optimized environment variable handling for dynamic Vercel deployments.
- Renamed and refactored internal stores for better Hook compliance.
- Finalized production-ready configuration for email and OG image generation.
