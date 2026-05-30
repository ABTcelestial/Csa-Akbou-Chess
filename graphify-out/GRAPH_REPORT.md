# Graph Report - .  (2026-05-30)

## Corpus Check
- 16 files · ~20,000 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 265 nodes · 302 edges · 43 communities (36 shown, 7 thin omitted)
- Extraction: 84% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 46 edges (avg confidence: 0.9)
- Token cost: 1,200 input · 520 output

## Community Hubs (Navigation)
- [[_COMMUNITY_shadcnui Primitives|shadcn/ui Primitives]]
- [[_COMMUNITY_Database & Security Layer|Database & Security Layer]]
- [[_COMMUNITY_Data Hooks & Social Icons|Data Hooks & Social Icons]]
- [[_COMMUNITY_File Upload & Filter Logic|File Upload & Filter Logic]]
- [[_COMMUNITY_Auth Session & Rate Limiting|Auth Session & Rate Limiting]]
- [[_COMMUNITY_App Routing & Pages|App Routing & Pages]]
- [[_COMMUNITY_Tournament Event Imagery|Tournament Event Imagery]]
- [[_COMMUNITY_Club Logo & Branding|Club Logo & Branding]]
- [[_COMMUNITY_Toast Notification System|Toast Notification System]]
- [[_COMMUNITY_About Page Chess Imagery|About Page Chess Imagery]]
- [[_COMMUNITY_Hero Banner Imagery|Hero Banner Imagery]]
- [[_COMMUNITY_Sidebar & Mobile Layout|Sidebar & Mobile Layout]]
- [[_COMMUNITY_Project Architecture Overview|Project Architecture Overview]]
- [[_COMMUNITY_Scroll Animation|Scroll Animation]]
- [[_COMMUNITY_Layout & Navigation Shell|Layout & Navigation Shell]]
- [[_COMMUNITY_Reveal Animation Component|Reveal Animation Component]]
- [[_COMMUNITY_shadcnui Registry|shadcn/ui Registry]]
- [[_COMMUNITY_Module Path Alias|Module Path Alias]]
- [[_COMMUNITY_Sitemap Reference|Sitemap Reference]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 46 edges
2. `CSA Akbou Chess Club Logo` - 10 edges
3. `App.tsx (Routing Entry)` - 8 edges
4. `useSupabase.ts (Data Hooks)` - 8 edges
5. `src/lib/supabase.ts` - 8 edges
6. `supabase/schema.sql` - 8 edges
7. `About Chess Hero Image` - 7 edges
8. `Hero Chess Image` - 7 edges
9. `Grand Hall Venue` - 7 edges
10. `src/pages/ Directory` - 6 edges

## Surprising Connections (you probably didn't know these)
- `App.tsx (Routing Entry)` --references--> `src/main.tsx (Module Entry)`  [INFERRED]
  CLAUDE.md → index.html
- `src/lib/supabase.ts` --conceptually_related_to--> `Environment Variables (.env)`  [INFERRED]
  CLAUDE.md → SUPABASE_SETUP.md
- `Base64 Image Storage Pattern` --conceptually_related_to--> `Supabase Storage Buckets`  [AMBIGUOUS]
  CLAUDE.md → SUPABASE_SETUP.md
- `Secret Admin Route Pattern` --rationale_for--> `robots.txt Admin Route Disallow`  [INFERRED]
  CLAUDE.md → robots.txt
- `useAuth Hook` --conceptually_related_to--> `Supabase Admin Auth (Email Invitation)`  [INFERRED]
  CLAUDE.md → SUPABASE_SETUP.md

## Hyperedges (group relationships)
- **Data Hooks map to Supabase Tables** — claudemd_usesupabase, claudemd_hook_usetournaments, claudemd_hook_useposts, claudemd_hook_usegallery, claudemd_hook_useregistrations, claudemd_hook_useplayers, claudemd_hook_useauth, claudemd_db_tournaments, claudemd_db_posts, claudemd_db_gallery, claudemd_db_registrations, claudemd_db_players [INFERRED 0.95]
- **TypeScript Interfaces for Supabase Entities** — claudemd_supabase_ts, claudemd_ts_tournament, claudemd_ts_post, claudemd_ts_galleryphoto, claudemd_ts_player, claudemd_ts_siteconfig [EXTRACTED 1.00]
- **Route Definitions map to Page Components** — claudemd_app_tsx, claudemd_page_index, claudemd_page_about, claudemd_page_tournaments, claudemd_page_achievements, claudemd_page_contact, claudemd_page_admin [EXTRACTED 1.00]
- **Admin Security Mechanisms** — claudemd_page_admin, claudemd_secret_route, claudemd_hook_useauth, claudemd_auth_security, robots_disallow_admin [INFERRED 0.85]

## Communities (43 total, 7 thin omitted)

### Community 1 - "Database & Security Layer"
Cohesion: 0.08
Nodes (32): Auth Rate Limiting & Session Security, Base64 Image Storage Pattern, gallery DB Table, page_views DB Table, players DB Table, posts DB Table, registrations DB Table, tournaments DB Table (+24 more)

### Community 2 - "Data Hooks & Social Icons"
Cohesion: 0.1
Nodes (4): useGallery(), usePlayers(), usePosts(), Toaster()

### Community 3 - "File Upload & Filter Logic"
Cohesion: 0.11
Nodes (4): uploadFile(), uploadMultiple(), handleUpload(), saveImg()

### Community 4 - "Auth Session & Rate Limiting"
Cohesion: 0.14
Nodes (13): fn(), generateSessionFingerprint(), getLockoutEnd(), getLoginAttempts(), incrementLoginAttempts(), isLockedOut(), lockoutRemainingMinutes(), submitRegistration() (+5 more)

### Community 5 - "App Routing & Pages"
Cohesion: 0.16
Nodes (17): App.tsx (Routing Entry), About Page (/a-propos), Achievements Page (/realisations), Admin Page (/gestion-csa-2025), Contact Page (/contact), Index Page (/), Tournaments Page (/tournois), src/pages/ Directory (+9 more)

### Community 6 - "Tournament Event Imagery"
Cohesion: 0.19
Nodes (14): Arched Windows, Grand Chandelier, Chess Boards, Chess Players, Chess Tournament Event, Competitive and Prestigious Atmosphere, CSA Akbou Chess Club, Formal Attire (Dark Suits) (+6 more)

### Community 7 - "Club Logo & Branding"
Cohesion: 0.4
Nodes (11): Akbou Chess (Text / Brand Name), Banner / Ribbon with Club Name, Checkered Chess Board Pattern (Bottom of Shield), Chess Piece Symbols Inside Shield, Crown (Top of Shield), CSA Akbou Chess Club (Organization), Gold / Amber Color Scheme, Heraldic Shield / Crest (+3 more)

### Community 8 - "Toast Notification System"
Cohesion: 0.33
Nodes (7): addToRemoveQueue(), dispatch(), genId(), reducer(), toast(), useToast(), Toaster()

### Community 9 - "About Page Chess Imagery"
Cohesion: 0.43
Nodes (8): Warm Ambient Candlelight Atmosphere, Chess Board, About Chess Hero Image, King Chess Piece (Dark Wood), Pawn Chess Pieces, Player Hand Making Move, Queen Chess Piece (Light Wood), About Page (/a-propos)

### Community 10 - "Hero Banner Imagery"
Cohesion: 0.39
Nodes (8): Active Chess Game in Progress, Wooden Chess Board, Decorative Hero Banner Asset, Green Leather Table Surface, Hero Chess Image, Chess Pieces (Staunton Style), Warm Ambient Lighting, Index / Homepage

### Community 13 - "Project Architecture Overview"
Cohesion: 0.33
Nodes (6): Graphify Structural Memory, Obsidian Vault Declarative Memory, CSA Akbou Chess Website Project, React/TypeScript SPA, Supabase Backend, Vercel Deployment

### Community 18 - "Layout & Navigation Shell"
Cohesion: 0.67
Nodes (3): Footer Component, Layout.tsx Component, Navbar Component

## Ambiguous Edges - Review These
- `Base64 Image Storage Pattern` → `Supabase Storage Buckets`  [AMBIGUOUS]
  SUPABASE_SETUP.md · relation: conceptually_related_to

## Knowledge Gaps
- **31 isolated node(s):** `React/TypeScript SPA`, `Supabase Backend`, `Vercel Deployment`, `React Router v6 Routes`, `Optimistic Local State Updates Pattern` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Base64 Image Storage Pattern` and `Supabase Storage Buckets`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `cn()` connect `shadcn/ui Primitives` to `Pagination UI`, `Sidebar & Mobile Layout`, `Drawer UI`, `Breadcrumb Navigation`, `Resizable Panels`, `Calendar UI`, `Form UI`, `Chart UI`, `Carousel UI`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `Toaster()` connect `Toast Notification System` to `Data Hooks & Social Icons`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `src/lib/supabase.ts` (e.g. with `useSupabase.ts (Data Hooks)` and `Environment Variables (.env)`) actually correct?**
  _`src/lib/supabase.ts` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `React/TypeScript SPA`, `Supabase Backend`, `Vercel Deployment` to the rest of the system?**
  _31 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `shadcn/ui Primitives` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Database & Security Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._