# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for CSA Akbou Chess club — a React/TypeScript SPA backed by Supabase, deployed on Vercel.

## Commands

```bash
npm run dev        # Dev server on port 8080
npm run build      # Production build
npm run lint       # ESLint
npm run test       # Vitest (run once)
npm run test:watch # Vitest (watch mode)
```

> The project has both `bun.lock` and `package-lock.json`. Prefer `npm` for consistency, but `bun` works too.

## Environment

Create `.env` at the root with:
```
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

## Architecture

### Pages & Routing (`src/pages/`, `src/App.tsx`)

React Router v6. Routes:
- `/` → `Index` — homepage with gallery, posts, hero
- `/a-propos` → `About`
- `/tournois` → `Tournaments`
- `/realisations` → `Achievements`
- `/contact` → `Contact`
- `/gestion-csa-2025` → `Admin` (secret route — `/admin` intentionally returns 404)

### Data Layer (`src/hooks/useSupabase.ts`)

All Supabase data access lives here as custom hooks: `useTournaments`, `usePosts`, `useGallery`, `useRegistrations`, `usePlayers`, `useAuth`. Each hook exposes `{ data, loading, error, create, update, remove, refetch }`. Writes are done with optimistic local state updates.

`useAuth` implements client-side rate limiting (5 attempts → 15 min lockout), session fingerprinting, and a 2-hour inactivity timeout.

### Global Config (`src/lib/SiteConfigContext.tsx`)

All editable site text (club name, schedule, FAQ, hero content, social links, etc.) lives in the Supabase `site_config` table as key/value JSONB rows. `SiteConfigProvider` wraps the whole app and caches the config in `localStorage` for 30 minutes with offline fallback. Use `useSiteConfig()` to read/write:

```tsx
const { get, update } = useSiteConfig()
const name = get('club_name', 'CSA Akbou Chess')
```

### Supabase Client & Types (`src/lib/supabase.ts`)

Single Supabase client instance exported as `supabase`. TypeScript interfaces for all entities are defined here: `Tournament`, `Post`, `GalleryPhoto`, `Player`, `SiteConfig`.

**Images are stored as base64 data URLs directly in the database** — not in Supabase Storage buckets. `uploadFile()` resizes images to max 1200px and encodes them. The `_bucket` parameter in upload helpers is vestigial and ignored.

### UI Components (`src/components/`)

- `Layout.tsx` — wraps pages with `Navbar` + `Footer`
- `Reveal.tsx` — scroll-triggered fade-in animation wrapper
- `ui/` — shadcn/ui components (Radix UI based), generated via `components.json`

### Database Schema (`supabase/schema.sql`)

Tables: `tournaments`, `posts`, `gallery`, `site_config`, `registrations`, `players`, `page_views`.

To reset and recreate the schema, paste the full contents of `supabase/schema.sql` into the Supabase SQL Editor and run it. **This drops all existing tables.**

Admin accounts are managed via Supabase Authentication (email invitations only — no public signup).

### Path Alias

`@/` resolves to `./src/` throughout the codebase.

## Git Workflow

**After every code modification, always commit and push to remote.**

- Stage only the modified source files (not `.env`, binaries, or unrelated files)
- Write a meaningful commit message describing what changed and why
- Push to `origin main` immediately after committing
- Never leave changes uncommitted at the end of a task

## External Context & Memory Navigation

### Structural Memory (Graphify)
- This project utilizes Graphify to manage token context efficiently. 
- Before jumping blindly into editing deep hooks or component trees, check the structural map located in `graphify-out/graph.json` or run local graph queries.
- Do not read whole directories sequentially if structural relationships can be inferred from the graph.

### Declarative Memory (Obsidian Vault)
- High-level progress tracking, future feature specs, and multi-session logs live inside your local Obsidian vault directory.
- When finishing a development sprint, log a quick summary of changes to your Obsidian project logs folder to ensure clean continuity for the next session.