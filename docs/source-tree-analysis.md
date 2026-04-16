# Source Tree Analysis: bmad-moviedb

**Generated:** 2026-04-16
**Scan Level:** Exhaustive

## Directory Structure

```
bmad-moviedb/
├── index.html                  # HTML shell — app entry point, loads /src/main.tsx
├── package.json                # Dependencies & scripts (dev, build, preview)
├── tsconfig.json               # TypeScript config (strict, ES2020, React JSX)
├── vite.config.ts              # Vite config — React + Tailwind CSS plugins
├── vite-env.d.ts               # Vite/ImportMeta type declarations (VITE_TMDB_API_KEY)
├── .env.example                # Documents required VITE_TMDB_API_KEY env var
├── .gitignore                  # Ignores node_modules, dist, .env, .vercel, tsbuildinfo
│
├── src/                        # ★ Application source code
│   ├── main.tsx                # ★ Entry point — React root, router setup, ErrorPage
│   ├── App.tsx                 # Root layout — sticky navbar, API key gate, Outlet
│   ├── index.css               # Tailwind CSS import + custom @theme color tokens
│   │
│   ├── pages/                  # Route-level page components
│   │   ├── HomePage.tsx        # Popular/trending tabs with MovieGrid
│   │   ├── SearchPage.tsx      # Debounced search input + results grid
│   │   └── MovieDetailPage.tsx # Full movie detail (backdrop, cast, metadata)
│   │
│   ├── components/             # Reusable UI components
│   │   ├── MovieCard.tsx       # Movie poster card with title, year, rating
│   │   ├── MovieGrid.tsx       # Responsive grid layout for MovieCards
│   │   ├── ErrorBanner.tsx     # Error message with optional retry button
│   │   ├── LoadingSkeleton.tsx # Animated placeholder grid during loading
│   │   └── ApiKeyMissing.tsx   # Setup instructions when API key is missing
│   │
│   └── lib/                    # Shared utilities and data layer
│       ├── tmdb.ts             # TMDB API client — fetch wrappers, types, URL builders
│       └── cache.ts            # localStorage cache with TTL, stale fallback, eviction
│
├── dist/                       # Build output (gitignored)
├── .vercel/                    # Vercel deployment config (gitignored)
│
├── docs/                       # Project documentation (this folder)
│
├── _bmad/                      # BMad Method configuration
│   ├── bmm/config.yaml         # BMad Method module config
│   ├── cis/config.yaml         # Creative Intelligence Suite config
│   └── core/config.yaml        # Core module config
│
└── _bmad-output/               # BMad Method artifacts
    └── implementation-artifacts/
        ├── spec-tmdb-movie-browser.md  # Feature spec (completed)
        └── deferred-work.md            # Known issues deferred from code review
```

## Critical Directories

| Directory | Purpose | File Count |
|-----------|---------|-----------|
| `src/` | All application source code | 13 files |
| `src/pages/` | Route-level page components (one per route) | 3 files |
| `src/components/` | Reusable UI building blocks | 5 files |
| `src/lib/` | Data layer — API client and cache | 2 files |

## Entry Points

| File | Role |
|------|------|
| `index.html` | HTML document shell, loads `src/main.tsx` as ES module |
| `src/main.tsx` | React app bootstrap — creates root, configures router, renders `<App />` |
| `src/App.tsx` | Root layout component — API key gate, navigation bar, `<Outlet />` |

## Key Files

| File | Lines | Responsibility |
|------|-------|---------------|
| `src/lib/tmdb.ts` | 102 | TMDB API client, all data fetching, TypeScript interfaces |
| `src/lib/cache.ts` | 51 | localStorage cache with TTL, stale fallback, eviction |
| `src/pages/MovieDetailPage.tsx` | 147 | Most complex page — backdrop, poster, metadata, cast grid |
| `src/pages/SearchPage.tsx` | 100 | Debounced search with empty/loading/error/results states |
| `src/pages/HomePage.tsx` | 64 | Tab-switchable popular/trending grid |
| `src/main.tsx` | 47 | Router configuration, error boundary, app mount |

## File Statistics

| Metric | Value |
|--------|-------|
| Total source files | 13 |
| Total source lines | ~640 |
| TypeScript/TSX files | 11 |
| CSS files | 1 |
| HTML files | 1 |
| Test files | 0 |
| Configuration files | 4 (package.json, tsconfig.json, vite.config.ts, vite-env.d.ts) |
